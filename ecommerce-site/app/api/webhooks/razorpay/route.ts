import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hmacSha256Hex } from "@/lib/crypto";

export const runtime = "nodejs";

/**
 * Razorpay Webhook Handler
 *
 * Handles async payment notifications from Razorpay for scenarios where
 * client-side verification fails (user closes browser, network issues, etc.)
 *
 * Setup: Configure webhook URL in Razorpay Dashboard:
 * https://dashboard.razorpay.com/app/webhooks
 *
 * Events handled:
 * - payment.authorized: Payment successful
 * - payment.failed: Payment failed
 * - payment.captured: Payment captured (for manual capture flows)
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret || webhookSecret === "placeholder") {
      console.error("RAZORPAY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const expectedSignature = hmacSha256Hex(webhookSecret, body);

    if (expectedSignature !== signature) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse webhook event
    const event = JSON.parse(body);
    console.log("Razorpay webhook event:", event.event);

    // Handle different event types
    switch (event.event) {
      case "payment.authorized":
      case "payment.captured":
        await handlePaymentSuccess(event);
        break;

      case "payment.failed":
        await handlePaymentFailure(event);
        break;

      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function handlePaymentSuccess(event: any) {
  const payment = event.payload.payment.entity;
  const razorpayOrderId = payment.order_id;
  const razorpayPaymentId = payment.id;

  console.log(`Processing successful payment: ${razorpayPaymentId} for order: ${razorpayOrderId}`);

  // Find order by razorpay_order_id
  const { data: order, error: orderErr } = await supabaseAdmin
    .from("orders")
    .select("id, payment_status")
    .eq("razorpay_order_id", razorpayOrderId)
    .single();

  if (orderErr || !order) {
    console.error("Order not found for razorpay_order_id:", razorpayOrderId);
    return;
  }

  // Check if already processed (idempotency)
  if (order.payment_status === "paid") {
    console.log("Payment already processed for order:", order.id);
    return;
  }

  // Update order status
  const { error: updateErr } = await supabaseAdmin
    .from("orders")
    .update({
      payment_status: "paid",
      razorpay_payment_id: razorpayPaymentId,
    })
    .eq("id", order.id);

  if (updateErr) {
    console.error("Failed to update order:", updateErr);
    throw updateErr;
  }

  // Log to razorpay_payments table
  try {
    await supabaseAdmin.from("razorpay_payments").insert({
      order_id: order.id,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      status: "verified",
    });
  } catch (logErr) {
    console.error("Failed to log payment:", logErr);
  }

  // Trigger shipment creation if configured
  if (process.env.SHIPROCKET_EMAIL) {
    try {
      const shipmentRes = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/shiprocket/create-shipment`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: order.id }),
        }
      );

      if (!shipmentRes.ok) {
        console.error('Webhook: Shipment creation failed');
      } else {
        console.log('Webhook: Shipment created successfully');
      }
    } catch (shipErr) {
      console.error('Webhook: Error triggering shipment:', shipErr);
    }
  }

  console.log(`Successfully processed payment for order: ${order.id}`);
}

async function handlePaymentFailure(event: any) {
  const payment = event.payload.payment.entity;
  const razorpayOrderId = payment.order_id;
  const razorpayPaymentId = payment.id;
  const errorCode = payment.error_code;
  const errorDescription = payment.error_description;

  console.log(`Processing failed payment: ${razorpayPaymentId} for order: ${razorpayOrderId}`);

  // Find order by razorpay_order_id
  const { data: order, error: orderErr } = await supabaseAdmin
    .from("orders")
    .select("id, payment_status")
    .eq("razorpay_order_id", razorpayOrderId)
    .single();

  if (orderErr || !order) {
    console.error("Order not found for razorpay_order_id:", razorpayOrderId);
    return;
  }

  // Update order status to failed
  const { error: updateErr } = await supabaseAdmin
    .from("orders")
    .update({
      payment_status: "failed",
    })
    .eq("id", order.id);

  if (updateErr) {
    console.error("Failed to update order:", updateErr);
    throw updateErr;
  }

  // Log failed payment
  try {
    await supabaseAdmin.from("razorpay_payments").insert({
      order_id: order.id,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      status: "failed",
    });
  } catch (logErr) {
    console.error("Failed to log payment failure:", logErr);
  }

  console.log(`Payment failed for order ${order.id}: ${errorCode} - ${errorDescription}`);
}
