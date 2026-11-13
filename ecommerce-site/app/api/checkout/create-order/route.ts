import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getRazorpayClient } from "@/lib/razorpay";
import { isRazorpayLive, runAfterOrderPlaced } from "@/lib/orderPayment";
import { orderViewToken } from "@/lib/crypto";

export const runtime = "nodejs";

const MAX_QTY_PER_LINE = 10;

interface CheckoutInput {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_method?: "razorpay" | "cod";
  shipping_address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  items: Array<{
    product_id: string;
    qty: number;
    selected_age_months: number | null;
  }>;
}

class BadRequest extends Error {}

function str(v: unknown, field: string, max = 200) {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) throw new BadRequest(`${field} is required`);
  if (s.length > max) throw new BadRequest(`${field} is too long`);
  return s;
}

function validate(input: CheckoutInput) {
  if (!input || typeof input !== "object") throw new BadRequest("Invalid request");
  const name = str(input.customer_name, "Name", 100);
  const email = str(input.customer_email, "Email", 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequest("Please enter a valid email");

  const digits = String(input.customer_phone ?? "").replace(/\D/g, "");
  const phone10 = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(phone10)) throw new BadRequest("Please enter a valid 10-digit Indian mobile number");

  const a = input.shipping_address ?? ({} as CheckoutInput["shipping_address"]);
  if (a.country && a.country !== "India") throw new BadRequest("We currently ship only within India");
  const address = {
    line1: str(a.line1, "Address", 300),
    city: str(a.city, "City", 100),
    state: str(a.state, "State", 100),
    pincode: str(a.pincode, "Pincode", 6),
  };
  if (!/^[1-9]\d{5}$/.test(address.pincode)) throw new BadRequest("Please enter a valid 6-digit pincode");

  const method = input.payment_method ?? "razorpay";
  if (method !== "razorpay" && method !== "cod") throw new BadRequest("Invalid payment method");

  if (!Array.isArray(input.items) || !input.items.length) throw new BadRequest("Your cart is empty");
  if (input.items.length > 30) throw new BadRequest("Too many items");
  const items = input.items.map((it) => {
    const qty = Number(it?.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) {
      throw new BadRequest(`Quantity must be between 1 and ${MAX_QTY_PER_LINE}`);
    }
    if (typeof it.product_id !== "string" || !it.product_id) throw new BadRequest("Invalid product");
    const age = it.selected_age_months == null ? null : Number(it.selected_age_months);
    if (age !== null && !Number.isInteger(age)) throw new BadRequest("Invalid size");
    return { product_id: it.product_id, qty, selected_age_months: age };
  });

  return { name, email, phone: `+91${phone10}`, address, method, items };
}

export async function POST(req: Request) {
  let input: ReturnType<typeof validate>;
  try {
    input = validate((await req.json()) as CheckoutInput);
  } catch (e) {
    const msg = e instanceof BadRequest ? e.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const live = isRazorpayLive();
  if (input.method === "razorpay" && !live) {
    return NextResponse.json({ error: "Online payment is not available right now. Please choose Cash on Delivery." }, { status: 400 });
  }

  // --- Idempotency (optional header from the client) ---
  const idempotencyKey = req.headers.get("x-idempotency-key")?.slice(0, 100) || null;
  if (idempotencyKey) {
    const { data: existing } = await supabaseAdmin
      .from("orders")
      .select("id, razorpay_order_id, total_amount_cents, payment_status")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();
    if (existing && existing.payment_status !== "failed") {
      return NextResponse.json({
        order_id: existing.id,
        view_token: orderViewToken(existing.id),
        payment_method: existing.payment_status === "cod" ? "cod" : "razorpay",
        razorpay_order_id: existing.razorpay_order_id,
        amount_cents: existing.total_amount_cents,
        currency: "INR",
        razorpay_key_id: process.env.RAZORPAY_KEY_ID,
      });
    }
  }

  // --- Products: price/availability always come from the DB, never the browser ---
  const productIds = [...new Set(input.items.map((i) => i.product_id))];
  const { data: products, error: prodErr } = await supabaseAdmin
    .from("products")
    .select("id,name,price_cents,currency,is_active,stock,age_months")
    .in("id", productIds);

  if (prodErr) {
    console.error("Product lookup failed:", prodErr);
    return NextResponse.json({ error: "Could not load products. Please try again." }, { status: 500 });
  }
  const byId = new Map((products ?? []).map((p) => [p.id, p]));

  let totalAmountCents = 0;
  const qtyByProduct = new Map<string, number>();
  for (const it of input.items) {
    const p = byId.get(it.product_id);
    if (!p) return NextResponse.json({ error: "One of the products is no longer available" }, { status: 400 });
    if (!p.is_active) return NextResponse.json({ error: `${p.name} is no longer available` }, { status: 400 });
    if ((p.currency || "INR") !== "INR") return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
    const ages: number[] | null = Array.isArray(p.age_months) ? p.age_months : null;
    if (ages?.length && it.selected_age_months !== null && !ages.includes(it.selected_age_months)) {
      return NextResponse.json({ error: `Selected size is not available for ${p.name}` }, { status: 400 });
    }
    if (ages?.length && it.selected_age_months === null) {
      return NextResponse.json({ error: `Please choose a size for ${p.name}` }, { status: 400 });
    }
    qtyByProduct.set(p.id, (qtyByProduct.get(p.id) ?? 0) + it.qty);
    totalAmountCents += Number(p.price_cents) * it.qty;
  }
  for (const [pid, qty] of qtyByProduct) {
    const p = byId.get(pid)!;
    if (typeof p.stock === "number" && p.stock < qty) {
      return NextResponse.json(
        { error: p.stock > 0 ? `Only ${p.stock} left of ${p.name}` : `${p.name} is out of stock` },
        { status: 400 }
      );
    }
  }
  if (totalAmountCents < 100) return NextResponse.json({ error: "Invalid order total" }, { status: 400 });

  // --- Create DB order ---
  const { data: orderRow, error: orderErr } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_name: input.name,
      customer_email: input.email,
      customer_phone: input.phone,
      shipping_line1: input.address.line1,
      shipping_city: input.address.city,
      shipping_state: input.address.state,
      shipping_pincode: input.address.pincode,
      shipping_address: { ...input.address, country: "India" },
      currency: "INR",
      total_amount_cents: totalAmountCents,
      payment_status: input.method === "cod" ? "cod" : "created",
      fulfillment_status: "pending",
      idempotency_key: idempotencyKey,
    })
    .select("id")
    .single();

  if (orderErr || !orderRow) {
    console.error("Order insert failed:", orderErr);
    return NextResponse.json({ error: "Could not create your order. Please try again." }, { status: 500 });
  }

  const { error: itemsErr } = await supabaseAdmin.from("order_items").insert(
    input.items.map((it) => ({
      order_id: orderRow.id,
      product_id: it.product_id,
      quantity: it.qty,
      selected_age_months: it.selected_age_months,
      price_cents: byId.get(it.product_id)!.price_cents,
    }))
  );
  if (itemsErr) {
    console.error("Order items insert failed:", itemsErr);
    await supabaseAdmin.from("orders").update({ payment_status: "failed", payment_failed_reason: "items insert failed" }).eq("id", orderRow.id);
    return NextResponse.json({ error: "Could not create your order. Please try again." }, { status: 500 });
  }

  const base = {
    order_id: orderRow.id,
    view_token: orderViewToken(orderRow.id),
    amount_cents: totalAmountCents,
    currency: "INR",
  };

  // --- Cash on Delivery: done. Admin confirms by phone, then books the shipment. ---
  if (input.method === "cod") {
    runAfterOrderPlaced(orderRow.id, { autoShip: false });
    return NextResponse.json({ ...base, payment_method: "cod" });
  }

  // --- Razorpay order (amount in paise; receipt max 40 chars) ---
  let rpOrderId: string;
  try {
    const rpOrder = await getRazorpayClient().orders.create({
      amount: totalAmountCents,
      currency: "INR",
      receipt: `mm_${orderRow.id.replace(/-/g, "").slice(0, 30)}`,
      notes: { order_id: orderRow.id },
    });
    rpOrderId = rpOrder.id;
  } catch (e: any) {
    console.error("Razorpay order create failed:", e?.error ?? e);
    await supabaseAdmin
      .from("orders")
      .update({ payment_status: "failed", payment_failed_reason: "razorpay order create failed" })
      .eq("id", orderRow.id);
    return NextResponse.json({ error: "Payment could not be started. Please try again or choose Cash on Delivery." }, { status: 502 });
  }

  const { error: updErr } = await supabaseAdmin.from("orders").update({ razorpay_order_id: rpOrderId }).eq("id", orderRow.id);
  if (updErr) {
    console.error("Saving razorpay_order_id failed:", updErr);
    return NextResponse.json({ error: "Payment could not be started. Please try again." }, { status: 500 });
  }
  await supabaseAdmin.from("razorpay_payments").insert({ order_id: orderRow.id, razorpay_order_id: rpOrderId, status: "created" });

  return NextResponse.json({
    ...base,
    payment_method: "razorpay",
    razorpay_order_id: rpOrderId,
    razorpay_key_id: process.env.RAZORPAY_KEY_ID,
  });
}
