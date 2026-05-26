import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hmacSha256Hex } from "@/lib/crypto";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const body = await req.json() as {
    order_id: string; // your DB order id
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };

  // Load order and verify it matches
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("id, razorpay_order_id, payment_status")
    .eq("id", body.order_id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (order.razorpay_order_id !== body.razorpay_order_id) {
    return NextResponse.json({ error: "Razorpay order mismatch" }, { status: 400 });
  }

  // Verify signature: sha256(order_id|payment_id)
  const payload = `${body.razorpay_order_id}|${body.razorpay_payment_id}`;
  const expected = hmacSha256Hex(process.env.RAZORPAY_KEY_SECRET!, payload);

  if (expected !== body.razorpay_signature) {
    // Log failed verification attempt
    try {
      await supabaseAdmin.from("razorpay_payments").insert({
        order_id: body.order_id,
        razorpay_order_id: body.razorpay_order_id,
        razorpay_payment_id: body.razorpay_payment_id,
        razorpay_signature: body.razorpay_signature,
        status: "failed",
      });

      // Update order status to failed
      await supabaseAdmin
        .from("orders")
        .update({ payment_status: "failed" })
        .eq("id", body.order_id);
    } catch (logErr) {
      console.error("Failed to log payment failure:", logErr);
    }

    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Mark paid (idempotent)
  let wasJustPaid = false;
  if (order.payment_status !== "paid") {
    const { error: updErr } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        razorpay_payment_id: body.razorpay_payment_id,
        razorpay_signature: body.razorpay_signature,
      })
      .eq("id", order.id);

    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
    wasJustPaid = true;

    // Log successful verification
    try {
      await supabaseAdmin.from("razorpay_payments").insert({
        order_id: body.order_id,
        razorpay_order_id: body.razorpay_order_id,
        razorpay_payment_id: body.razorpay_payment_id,
        razorpay_signature: body.razorpay_signature,
        status: "verified",
      });
    } catch (logErr) {
      console.error("Failed to log successful payment:", logErr);
      // Don't fail the payment if logging fails
    }
  }

  // Trigger shipment creation automatically after successful payment
  // Only trigger if we just marked it paid (idempotency - avoid duplicate shipments)
  if (wasJustPaid && process.env.SHIPROCKET_EMAIL) {
    try {
      // Call shipment creation API internally
      const shipmentRes = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/shiprocket/create-shipment`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: order.id }),
        }
      );

      if (!shipmentRes.ok) {
        const shipErr = await shipmentRes.json().catch(() => ({}));
        console.error('Shipment creation failed:', shipErr);
        // Don't fail the payment verification if shipping fails
        // Admin can manually create shipment later
      }
    } catch (shipErr) {
      console.error('Error triggering shipment creation:', shipErr);
      // Don't fail the payment verification if shipping fails
    }
  }

  return NextResponse.json({ ok: true });
}  