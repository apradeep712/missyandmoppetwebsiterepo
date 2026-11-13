import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hmacSha256Hex, safeEqual } from "@/lib/crypto";
import { isRazorpayLive, markOrderPaid, markOrderPaymentFailed } from "@/lib/orderPayment";

export const runtime = "nodejs";

type VerifyBody = {
  order_id?: string; // our DB order id
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  failed?: boolean; // client reports a failed attempt (Razorpay "payment.failed")
  reason?: string;
};

export async function POST(req: Request) {
  if (!isRazorpayLive()) {
    return NextResponse.json({ error: "Online payments are not enabled" }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as VerifyBody;
  if (!body.order_id || !body.razorpay_order_id) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, razorpay_order_id, payment_status")
    .eq("id", body.order_id)
    .maybeSingle();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!order.razorpay_order_id || order.razorpay_order_id !== body.razorpay_order_id) {
    return NextResponse.json({ error: "Payment does not match this order" }, { status: 400 });
  }

  // Client-reported failure: record it (never downgrades a paid order).
  if (body.failed) {
    await markOrderPaymentFailed({
      orderId: order.id,
      razorpayOrderId: body.razorpay_order_id,
      razorpayPaymentId: body.razorpay_payment_id ?? null,
      reason: body.reason?.slice(0, 300) ?? "payment failed",
    });
    return NextResponse.json({ ok: false, payment_status: order.payment_status === "paid" ? "paid" : "failed" });
  }

  if (!body.razorpay_payment_id || !body.razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  // Razorpay signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
  const expected = hmacSha256Hex(
    process.env.RAZORPAY_KEY_SECRET!,
    `${body.razorpay_order_id}|${body.razorpay_payment_id}`
  );
  if (!safeEqual(expected, body.razorpay_signature)) {
    // Don't change the order: a bad/forged signature says nothing about the real payment.
    console.warn("Invalid Razorpay signature for order", order.id);
    return NextResponse.json({ error: "Payment could not be verified" }, { status: 400 });
  }

  try {
    await markOrderPaid({
      orderId: order.id,
      razorpayOrderId: body.razorpay_order_id,
      razorpayPaymentId: body.razorpay_payment_id,
      razorpaySignature: body.razorpay_signature,
      source: "verify",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Payment received but could not be saved. We'll confirm it shortly." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, payment_status: "paid" });
}
