import { after } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendAdminOrderEmail, sendCustomerConfirmationEmail } from "@/lib/email";
import { createShipmentForOrder } from "@/lib/createShipment";
import { isShiprocketConfigured } from "@/lib/shiprocket";

export function paymentsProvider() {
  return (process.env.PAYMENTS_PROVIDER || "mock").toLowerCase();
}

/** Real Razorpay is on only when the provider is "razorpay" and real keys are set. */
export function isRazorpayLive() {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  return paymentsProvider() === "razorpay" && !!secret && secret !== "placeholder" && !!process.env.RAZORPAY_KEY_ID;
}

async function logPayment(row: {
  order_id: string;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  status: string;
}) {
  const { error } = await supabaseAdmin.from("razorpay_payments").insert(row);
  if (error) console.error("razorpay_payments log failed:", error.message);
}

/**
 * Marks an order paid exactly once. Only the caller that actually flips the status
 * (client verify OR webhook, whichever comes first) sends emails and books the shipment.
 */
export async function markOrderPaid(params: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string | null;
  source: "verify" | "webhook";
}): Promise<{ justPaid: boolean }> {
  const { data: flipped, error } = await supabaseAdmin
    .from("orders")
    .update({
      payment_status: "paid",
      razorpay_payment_id: params.razorpayPaymentId,
      ...(params.razorpaySignature ? { razorpay_signature: params.razorpaySignature } : {}),
      payment_failed_reason: null,
    })
    .eq("id", params.orderId)
    .neq("payment_status", "paid")
    .select("id");

  if (error) throw new Error(`Could not mark order paid: ${error.message}`);
  const justPaid = !!flipped?.length;

  if (justPaid) {
    await logPayment({
      order_id: params.orderId,
      razorpay_order_id: params.razorpayOrderId,
      razorpay_payment_id: params.razorpayPaymentId,
      razorpay_signature: params.razorpaySignature ?? null,
      status: params.source === "webhook" ? "verified_webhook" : "verified",
    });
    runAfterOrderPlaced(params.orderId, { autoShip: true });
  }
  return { justPaid };
}

/** Marks a failed attempt — but never downgrades a paid order (e.g. a late failure event). */
export async function markOrderPaymentFailed(params: {
  orderId: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  reason?: string | null;
}) {
  await supabaseAdmin
    .from("orders")
    .update({ payment_status: "failed", payment_failed_reason: params.reason ?? null })
    .eq("id", params.orderId)
    .not("payment_status", "in", "(paid,cod)");

  await logPayment({
    order_id: params.orderId,
    razorpay_order_id: params.razorpayOrderId ?? null,
    razorpay_payment_id: params.razorpayPaymentId ?? null,
    status: "failed",
  });
}

/**
 * After an order is paid (or placed as COD): emails + (paid only) automatic shipment.
 * Runs after the response is sent so the customer isn't kept waiting.
 */
export function runAfterOrderPlaced(orderId: string, opts: { autoShip: boolean }) {
  after(async () => {
    await Promise.allSettled([sendAdminOrderEmail(orderId), sendCustomerConfirmationEmail(orderId)]);
    if (opts.autoShip && isShiprocketConfigured()) {
      const res = await createShipmentForOrder(orderId);
      if (!res.ok) console.error(`Auto-shipment failed for ${orderId}:`, res.error);
    }
  });
}
