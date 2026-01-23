import { NextResponse } from "next/server";  
import { cookies } from "next/headers";  
import { createServerClient } from "@supabase/auth-helpers-nextjs";  
import { verifyPayment } from "@/lib/providers/payments";  
import { createShipment } from "@/lib/providers/shipping";
  
type Body = {  
  order_id: string;  
  provider_order_id: string;  
  provider_payment_id: string;  
  provider_signature: string;  
};
  
function isNonEmptyString(v: any) {  
  return typeof v === "string" && v.trim().length > 0;  
}
  
export async function POST(req: Request) {  
  try {  
    const body = (await req.json()) as Body;
  
    if (  
      !isNonEmptyString(body.order_id) ||  
      !isNonEmptyString(body.provider_order_id) ||  
      !isNonEmptyString(body.provider_payment_id) ||  
      !isNonEmptyString(body.provider_signature)  
    ) {  
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });  
    }
  
    const cookieStore = await cookies();  
    const supabase = createServerClient(  
      process.env.NEXT_PUBLIC_SUPABASE_URL!,  
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,  
      {  
        cookies: {  
          get(name: string) {  
            return cookieStore.get(name)?.value;  
          },  
        },  
      }  
    );
  
    const { data: order, error: orderErr } = await supabase  
      .from("orders")  
      .select("*")  
      .eq("id", body.order_id)  
      .single();
  
    if (orderErr || !order) {  
      return NextResponse.json({ error: "Order not found" }, { status: 404 });  
    }
  
    // Bind provider_order_id to this order  
    const { data: attempt, error: attErr } = await supabase  
      .from("payment_attempts")  
      .select("*")  
      .eq("order_id", order.id)  
      .eq("provider_order_id", body.provider_order_id)  
      .single();
  
    if (attErr || !attempt) {  
      return NextResponse.json({ error: "Payment attempt not found for this order" }, { status: 400 });  
    }
  
    // Idempotency: don't double-create shipments  
    if (attempt.status === "verified" || order.status === "paid" || order.status === "shipping_pending") {  
      const { data: existingShipment } = await supabase  
        .from("shipments")  
        .select("*")  
        .eq("order_id", order.id)  
        .maybeSingle();
  
      return NextResponse.json({ ok: true, shipment: existingShipment ?? null, already_processed: true });  
    }
  
    const v = await verifyPayment({  
      provider_order_id: body.provider_order_id,  
      provider_payment_id: body.provider_payment_id,  
      provider_signature: body.provider_signature,  
    });
  
    if (!v.ok) {  
      await supabase  
        .from("payment_attempts")  
        .update({  
          provider_payment_id: body.provider_payment_id,  
          provider_signature: body.provider_signature,  
          status: "failed",  
        })  
        .eq("order_id", order.id)  
        .eq("provider_order_id", body.provider_order_id);
  
      return NextResponse.json({ error: `Payment verification failed: ${v.reason}` }, { status: 400 });  
    }
  
    await supabase  
      .from("payment_attempts")  
      .update({  
        provider_payment_id: body.provider_payment_id,  
        provider_signature: body.provider_signature,  
        status: "verified",  
      })  
      .eq("order_id", order.id)  
      .eq("provider_order_id", body.provider_order_id);
  
    await supabase.from("orders").update({ status: "paid" }).eq("id", order.id);
  
    // Shipment idempotency check  
    const { data: existingShipment } = await supabase  
      .from("shipments")  
      .select("*")  
      .eq("order_id", order.id)  
      .maybeSingle();
  
    if (existingShipment) {  
      await supabase.from("orders").update({ status: "shipping_pending" }).eq("id", order.id);  
      return NextResponse.json({ ok: true, shipment: existingShipment, already_created: true });  
    }
  
    // Create shipment (Shiprocket/mock depends on your provider switch)  
    const shipment = await createShipment({  
      order_id: order.id,  
      amount_paise: order.total_amount_cents, // treat as paise  
      customer: {  
        name: order.customer_name,  
        email: order.customer_email,  
        phone: order.customer_phone,  
      },  
      shipping_address: order.shipping_address,  
      items: order.items,  
    });
  
    await supabase.from("shipments").insert({  
  order_id: order.id,  
  shiprocket_order_id: shipment.provider_order_id, // store provider order id here  
  shipment_id: shipment.shipment_id,  
  awb_code: shipment.awb_code,  
  courier_name: shipment.courier_name,  
  courier_company_id: shipment.courier_company_id ?? null,  
  pickup_token_number: shipment.pickup_token_number ?? null,  
  pickup_scheduled_at: shipment.pickup_scheduled_at ?? null,  
  pickup_generated_at: shipment.pickup_generated_at ?? null,  
  status: shipment.status, // e.g. "pickup_scheduled"  
  raw: shipment.raw,  
});  
  
    await supabase.from("orders").update({ status: "shipping_pending" }).eq("id", order.id);
  
    return NextResponse.json({ ok: true, shipment });  
  } catch (e: any) {  
    console.error("orders/verify-payment error", e);  
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });  
  }  
}  