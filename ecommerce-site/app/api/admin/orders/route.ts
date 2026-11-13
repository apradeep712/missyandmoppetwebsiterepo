import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isShiprocketConfigured } from "@/lib/shiprocket";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Admin-only: list orders with items and shipment info. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(
      `id, created_at, customer_name, customer_phone, customer_email, total_amount_cents,
       payment_status, fulfillment_status, payment_failed_reason, razorpay_payment_id,
       shipping_city, shipping_pincode,
       order_items ( quantity, price_cents, selected_age_months, products ( name ) )`
    )
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    console.error("Admin orders load failed:", error);
    return NextResponse.json({ error: "Could not load orders" }, { status: 500 });
  }

  const ids = (orders ?? []).map((o) => o.id);
  const { data: shipments } = ids.length
    ? await supabaseAdmin.from("shipments").select("order_id, awb_code, courier_name, status").in("order_id", ids)
    : { data: [] as any[] };
  const shipByOrder = new Map((shipments ?? []).map((s) => [s.order_id, s]));

  return NextResponse.json({
    shiprocket_configured: isShiprocketConfigured(),
    orders: (orders ?? []).map((o) => ({ ...o, shipment: shipByOrder.get(o.id) ?? null })),
  });
}
