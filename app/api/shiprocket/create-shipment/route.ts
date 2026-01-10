import { NextResponse } from "next/server";  
import { supabaseAdmin } from "@/lib/supabaseAdmin";  
import { shiprocketFetch } from "@/lib/shiprocket";
  
function formatShiprocketDate(d = new Date()) {  
  // Shiprocket examples accept "YYYY-MM-DD HH:mm"  
  const pad = (n: number) => String(n).padStart(2, "0");  
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;  
}
  
export async function POST(req: Request) {  
  const { order_id } = (await req.json()) as { order_id: string };
  
  // 1) Load order  
  const { data: order, error: orderErr } = await supabaseAdmin  
    .from("orders")  
    .select("*")  
    .eq("id", order_id)  
    .single();
  
  if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 });  
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  
  if (order.payment_status !== "paid") {  
    return NextResponse.json({ error: "Order not paid yet" }, { status: 400 });  
  }
  
  // 2) Idempotency: if shipment exists with shipment_id, return it  
  const { data: existingShipment } = await supabaseAdmin  
    .from("shipments")  
    .select("*")  
    .eq("order_id", order_id)  
    .maybeSingle();
  
  if (existingShipment?.shiprocket_shipment_id) {  
    return NextResponse.json({ ok: true, shipment: existingShipment });  
  }
  
  // 3) Load order_items + products for name/price/product_code  
  const { data: items, error: itemsErr } = await supabaseAdmin  
    .from("order_items")  
    .select("product_id, qty, selected_age_months, unit_price_cents")  
    .eq("order_id", order_id);
  
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });  
  if (!items?.length) return NextResponse.json({ error: "No order items" }, { status: 400 });
  
  const productIds = items.map((i) => i.product_id);  
  const { data: products, error: prodErr } = await supabaseAdmin  
    .from("products")  
    .select("id,name,product_code,price_cents,currency")  
    .in("id", productIds);
  
  if (prodErr) return NextResponse.json({ error: prodErr.message }, { status: 500 });  
  const byId = new Map(products?.map((p) => [p.id, p]) ?? []);
  
  // 4) Build Shiprocket order_items with your rule:  
  // selling_price SAME (from price_cents), annotate only name/sku with age  
  const order_items = items.map((it) => {  
    const p = byId.get(it.product_id);  
    if (!p) throw new Error(`Product not found: ${it.product_id}`);  
    if (p.currency !== "INR") throw new Error(`Unsupported currency ${p.currency}`);
  
    const selling_price = Number(p.price_cents) / 100; // INR  
    const baseSku = p.product_code ?? p.id;
  
    return {  
      name: `${p.name} (${it.selected_age_months} months)`,  
      sku: `${baseSku}-${it.selected_age_months}M`,  
      units: Number(it.qty),  
      selling_price,  
      discount: 0,  
      tax: 0,  
    };  
  });
  
  const sub_total = order_items.reduce((sum: number, x: any) => sum + x.selling_price * x.units, 0);
  
  // 5) Create shipments row early (idempotency anchor)  
  const { data: shipmentRow, error: shipInsErr } = await supabaseAdmin  
    .from("shipments")  
    .upsert(  
      { order_id, status: "created" },  
      { onConflict: "order_id" }  
    )  
    .select("*")  
    .single();
  
  if (shipInsErr) return NextResponse.json({ error: shipInsErr.message }, { status: 500 });
  
  // 6) Create Shiprocket order  
  const payload = {  
    order_id: order.id, // your DB order id (string). Shiprocket accepts string order_id.  
    order_date: formatShiprocketDate(new Date()),  
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION!,
  
    billing_customer_name: order.customer_name,  
    billing_last_name: "",  
    billing_address: order.shipping_line1,  
    billing_address_2: "",  
    billing_city: order.shipping_city,  
    billing_pincode: Number(order.shipping_pincode),  
    billing_state: order.shipping_state,  
    billing_country: "India",  
    billing_email: order.customer_email,  
    billing_phone: order.customer_phone,
  
    shipping_is_billing: true,
  
    order_items,
  
    payment_method: "Prepaid",  
    shipping_charges: 0,  
    giftwrap_charges: 0,  
    transaction_charges: 0,  
    total_discount: 0,  
    sub_total,
  
    // Defaults (adjust if you have real weights/dimensions)  
    length: 10,  
    breadth: 10,  
    height: 10,  
    weight: 0.5,  
  };
  
  type CreateOrderResp = {  
    order_id: number;  
    shipment_id: number;  
  };
  
  let createResp: CreateOrderResp;  
  try {  
    createResp = await shiprocketFetch<CreateOrderResp>("orders/create/adhoc", {  
      method: "POST",  
      json: payload,  
    });  
  } catch (e: any) {  
    await supabaseAdmin  
      .from("shipments")  
      .update({ status: "failed", raw: { error: String(e?.message ?? e) } })  
      .eq("id", shipmentRow.id);
  
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });  
  }
  
  // 7) Assign AWB (auto courier if courier_id omitted)  
  type AssignAwbResp = { awb_code: string; courier_name?: string };  
  const awbResp = await shiprocketFetch<AssignAwbResp>("courier/assign/awb", {  
    method: "POST",  
    json: { shipment_id: createResp.shipment_id },  
  });
  
  // 8) Request pickup  
  type PickupResp = any;  
  const pickupResp = await shiprocketFetch<PickupResp>("courier/generate/pickup", {  
    method: "POST",  
    json: { shipment_id: [createResp.shipment_id] },  
  });
  
  // 9) Save to DB  
  const { data: finalShipment, error: updErr } = await supabaseAdmin  
    .from("shipments")  
    .update({  
      shiprocket_order_id: createResp.order_id,  
      shiprocket_shipment_id: createResp.shipment_id,  
      awb_code: awbResp.awb_code,  
      courier_name: awbResp.courier_name ?? null,  
      status: "pickup_requested",  
      raw: { createResp, awbResp, pickupResp },  
    })  
    .eq("id", shipmentRow.id)  
    .select("*")  
    .single();
  
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
  
  // Update order fulfillment status  
  await supabaseAdmin  
    .from("orders")  
    .update({ fulfillment_status: "shipment_created" })  
    .eq("id", order_id);
  
  return NextResponse.json({ ok: true, shipment: finalShipment });  
}  