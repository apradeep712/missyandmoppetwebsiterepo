import { NextResponse } from "next/server";  
import { cookies } from "next/headers";  
import { createServerClient } from "@supabase/auth-helpers-nextjs";  
import { createPaymentOrder } from "@/lib/providers/payments";
  
type ItemInput = {  
  product_id: string;  
  qty: number;  
  selected_age_months?: number | null;  
};
  
type Body = {  
  customer_name: string;  
  customer_email: string;  
  customer_phone: string;  
  shipping_address: any;  
  items: ItemInput[];  
};
  
function isNonEmptyString(v: any) {  
  return typeof v === "string" && v.trim().length > 0;  
}
  
export async function POST(req: Request) {  
  try {  
    const body = (await req.json()) as Body;
  
    if (!isNonEmptyString(body.customer_name) || !isNonEmptyString(body.customer_email) || !isNonEmptyString(body.customer_phone)) {  
      return NextResponse.json({ error: "Missing customer fields" }, { status: 400 });  
    }  
    if (!body.shipping_address) {  
      return NextResponse.json({ error: "Missing shipping_address" }, { status: 400 });  
    }  
    if (!Array.isArray(body.items) || body.items.length < 1) {  
      return NextResponse.json({ error: "Missing items" }, { status: 400 });  
    }
  
    for (const it of body.items) {  
      if (!it || !isNonEmptyString(it.product_id)) {  
        return NextResponse.json({ error: "Invalid item.product_id" }, { status: 400 });  
      }  
      const q = Number(it.qty);  
      if (!Number.isFinite(q) || q < 1 || q > 50) {  
        return NextResponse.json({ error: "Invalid item.qty" }, { status: 400 });  
      }  
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
  
    // Compute total from products.price_cents (treated as minor unit)  
    const productIds = Array.from(new Set(body.items.map((i) => i.product_id)));
  
    const { data: products, error: prodErr } = await supabase  
      .from("products")  
      .select("id, price_cents, is_active")  
      .in("id", productIds);
  
    if (prodErr) {  
      console.error(prodErr);  
      return NextResponse.json({ error: "Failed to load products" }, { status: 500 });  
    }
  
    const byId = new Map<string, any>((products || []).map((p) => [p.id, p]));  
    if (byId.size !== productIds.length) {  
      return NextResponse.json({ error: "One or more products not found" }, { status: 400 });  
    }
  
    for (const p of byId.values()) {  
      if (p.is_active === false) {  
        return NextResponse.json({ error: "One or more products inactive" }, { status: 400 });  
      }  
    }
  
    let total_amount_cents = 0;  
    for (const it of body.items) {  
      const p = byId.get(it.product_id);  
      const unit = Number(p.price_cents);  
      const q = Number(it.qty);  
      if (!Number.isFinite(unit) || unit < 0) {  
        return NextResponse.json({ error: "Invalid product price" }, { status: 500 });  
      }  
      total_amount_cents += unit * q;  
    }
  
    if (!Number.isFinite(total_amount_cents) || total_amount_cents < 1) {  
      return NextResponse.json({ error: "Computed amount invalid" }, { status: 400 });  
    }
  
    // Create internal order (match your existing schema)  
    const { data: order, error: orderErr } = await supabase  
      .from("orders")  
      .insert({  
        status: "pending",          // ensure your enum supports this  
        currency: "INR",  
        total_amount_cents,                // <-- your column  
        customer_name: body.customer_name, // <-- requires adding columns  
        customer_email: body.customer_email,  
        customer_phone: body.customer_phone,  
        shipping_address: body.shipping_address,  
        items: body.items,  
      })  
      .select("*")  
      .single();
  
    if (orderErr || !order) {  
      console.error(orderErr);  
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });  
    }
  
    // Create Razorpay payment order (expects minor unit: paise)  
    const paymentOrder = await createPaymentOrder({  
      amount_paise: order.total_amount_cents, // treat cents column as paise for INR  
      currency: order.currency,  
      receipt: `order_${order.id}`,  
    });
  
    // Store attempt  
    const { error: payErr } = await supabase.from("payment_attempts").insert({  
      order_id: order.id,  
      provider: paymentOrder.provider,  
      provider_order_id: paymentOrder.provider_order_id,  
      status: "created",  
    });
  
    if (payErr) {  
      console.error(payErr);  
      return NextResponse.json({ error: "Failed to create payment attempt" }, { status: 500 });  
    }
  
    return NextResponse.json({  
      ok: true,  
      order_id: order.id,  
      payment: paymentOrder,  
      razorpay_key_id:  
        process.env.PAYMENTS_PROVIDER === "razorpay" ? process.env.RAZORPAY_KEY_ID : null,  
    });  
  } catch (e: any) {  
    console.error("orders/create error", e);  
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });  
  }  
}  