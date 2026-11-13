import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hmacSha256Hex, safeEqual } from "@/lib/crypto";
import { markOrderPaid, markOrderPaymentFailed } from "@/lib/orderPayment";

export const runtime = "nodejs";

/**
 * Razorpay webhook — the safety net when the customer closes the window after paying.
 *
 * Razorpay Dashboard → Settings → Webhooks:
 *   URL:    https://<site>/api/webhooks/razorpay
 *   Secret: same value as RAZORPAY_WEBHOOK_SECRET
 *   Events: payment.captured, payment.failed  (and keep "auto-capture" ON in Payment settings)
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret === "placeholder") {
    console.error("RAZORPAY_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  if (!signature || !safeEqual(hmacSha256Hex(webhookSecret, body), signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  const payment = event?.payload?.payment?.entity;
  if (!payment?.order_id) {
    // Event we don't handle (or without a payment entity) — acknowledge so Razorpay doesn't retry.
    return NextResponse.json({ ok: true, ignored: event?.event });
  }

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, payment_status, total_amount_cents")
    .eq("razorpay_order_id", payment.order_id)
    .maybeSingle();

  if (!order) {
    console.warn("Webhook: no order for razorpay_order_id", payment.order_id);
    return NextResponse.json({ ok: true, ignored: "unknown order" });
  }

  try {
    switch (event.event) {
      case "payment.captured":
      case "payment.authorized":
      case "order.paid": {
        if (Number(payment.amount) !== Number(order.total_amount_cents) || (payment.currency && payment.currency !== "INR")) {
          console.error(`Webhook: amount mismatch for order ${order.id}: paid ${payment.amount} ${payment.currency}, expected ${order.total_amount_cents}`);
          return NextResponse.json({ ok: true, ignored: "amount mismatch" });
        }
        const { justPaid } = await markOrderPaid({
          orderId: order.id,
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: payment.id,
          source: "webhook",
        });
        return NextResponse.json({ ok: true, justPaid });
      }
      case "payment.failed":
        await markOrderPaymentFailed({
          orderId: order.id,
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: payment.id,
          reason: [payment.error_code, payment.error_description].filter(Boolean).join(": ") || "payment failed",
        });
        return NextResponse.json({ ok: true });
      default:
        return NextResponse.json({ ok: true, ignored: event.event });
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    // 500 → Razorpay retries later, which is what we want for transient DB errors.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
