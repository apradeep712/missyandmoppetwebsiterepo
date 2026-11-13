import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isShiprocketConfigured, shiprocketFetch } from "@/lib/shiprocket";

/**
 * Books a Shiprocket shipment for an order: create order → assign AWB → request pickup.
 *
 * Safe to call more than once (payment handler, webhook, admin button):
 * - only one caller can "claim" the order (conditional update on orders.fulfillment_status);
 * - if the Shiprocket order was already created but AWB/pickup failed, a retry continues
 *   from that step instead of creating a duplicate Shiprocket order.
 *
 * orders.fulfillment_status: pending → booking → shipment_created
 *                                         ↘ shipment_failed / awb_pending (retryable)
 */

export type ShipmentResult =
  | { ok: true; status: string; awb_code?: string | null; courier_name?: string | null; already?: boolean }
  | { ok: false; error: string; status?: string };

const RETRYABLE = ["pending", "shipment_failed", "awb_pending"];

/** Shiprocket wants "YYYY-MM-DD HH:mm" — use India time, not the server's (UTC on Vercel). */
export function formatShiprocketDate(d = new Date()) {
  const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${ist.getUTCFullYear()}-${pad(ist.getUTCMonth() + 1)}-${pad(ist.getUTCDate())} ${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())}`;
}

/** Last 10 digits of an Indian phone number ("+91 98765 43210" → "9876543210"). */
export function tenDigitPhone(phone: string | null | undefined) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  return digits.slice(-10);
}

type OrderRow = {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_line1: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;
  payment_status: string;
};
type ItemRow = { quantity: number; selected_age_months: number | null; price_cents: number; product: { name: string; product_code: string | null; id: string } };

/** Pure payload builder (unit-tested). */
export function buildShiprocketOrderPayload(order: OrderRow, items: ItemRow[], pickupLocation: string, now = new Date()) {
  const order_items = items.map((it) => {
    const age = it.selected_age_months;
    const baseSku = it.product.product_code || it.product.id.slice(0, 8);
    return {
      name: age != null ? `${it.product.name} (${age} months)` : it.product.name,
      sku: age != null ? `${baseSku}-${age}M` : baseSku,
      units: Number(it.quantity),
      selling_price: Number(it.price_cents) / 100,
      discount: 0,
      tax: 0,
    };
  });
  const sub_total = order_items.reduce((sum, x) => sum + x.selling_price * x.units, 0);
  const isCod = order.payment_status === "cod";

  // Split "First Last" — Shiprocket has separate first/last name fields.
  const [first, ...rest] = String(order.customer_name ?? "Customer").trim().split(/\s+/);

  return {
    order_id: order.id, // our DB id (string is accepted)
    order_date: formatShiprocketDate(now),
    pickup_location: pickupLocation,
    billing_customer_name: first,
    billing_last_name: rest.join(" "),
    billing_address: order.shipping_line1 ?? "",
    billing_address_2: "",
    billing_city: order.shipping_city ?? "",
    billing_pincode: String(order.shipping_pincode ?? ""),
    billing_state: order.shipping_state ?? "",
    billing_country: "India",
    billing_email: order.customer_email ?? "",
    billing_phone: tenDigitPhone(order.customer_phone),
    shipping_is_billing: true,
    order_items,
    payment_method: isCod ? "COD" : "Prepaid",
    shipping_charges: 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total,
    // Defaults for one baby/kids garment parcel. Adjust per product if weight disputes happen.
    length: Number(process.env.SHIPROCKET_DEFAULT_LENGTH_CM || 25),
    breadth: Number(process.env.SHIPROCKET_DEFAULT_BREADTH_CM || 20),
    height: Number(process.env.SHIPROCKET_DEFAULT_HEIGHT_CM || 5),
    weight: Number(process.env.SHIPROCKET_DEFAULT_WEIGHT_KG || 0.5),
  };
}

/** Assign-AWB response: { awb_assign_status: 1, response: { data: { awb_code, courier_name, courier_company_id } } } */
export function parseAwbResponse(resp: any): { ok: true; awb_code: string; courier_name: string | null; courier_company_id: string | null } | { ok: false; error: string } {
  const data = resp?.response?.data ?? {};
  if (resp?.awb_assign_status === 1 && data.awb_code) {
    return {
      ok: true,
      awb_code: String(data.awb_code),
      courier_name: data.courier_name ?? null,
      courier_company_id: data.courier_company_id != null ? String(data.courier_company_id) : null,
    };
  }
  return { ok: false, error: data.awb_assign_error || resp?.message || "AWB not assigned" };
}

async function setFulfillment(orderId: string, status: string) {
  await supabaseAdmin.from("orders").update({ fulfillment_status: status }).eq("id", orderId);
}

export async function createShipmentForOrder(orderId: string): Promise<ShipmentResult> {
  if (!isShiprocketConfigured()) {
    return { ok: false, error: "Shiprocket is not configured yet (SHIPROCKET_EMAIL / PASSWORD / PICKUP_LOCATION)." };
  }

  const { data: order, error: orderErr } = await supabaseAdmin
    .from("orders")
    .select("id, customer_name, customer_email, customer_phone, shipping_line1, shipping_city, shipping_state, shipping_pincode, payment_status, fulfillment_status")
    .eq("id", orderId)
    .single();
  if (orderErr || !order) return { ok: false, error: "Order not found" };

  if (order.payment_status !== "paid" && order.payment_status !== "cod") {
    return { ok: false, error: "Order is not paid (and not COD) yet" };
  }
  if (order.fulfillment_status === "shipment_created") {
    const { data: s } = await supabaseAdmin.from("shipments").select("awb_code, courier_name").eq("order_id", orderId).maybeSingle();
    return { ok: true, status: "shipment_created", awb_code: s?.awb_code, courier_name: s?.courier_name, already: true };
  }

  // Claim the order so concurrent callers don't double-book.
  const { data: claimed } = await supabaseAdmin
    .from("orders")
    .update({ fulfillment_status: "booking" })
    .eq("id", orderId)
    .in("fulfillment_status", RETRYABLE)
    .select("id");
  if (!claimed?.length) {
    return { ok: false, error: "A shipment is already being booked for this order", status: order.fulfillment_status };
  }

  try {
    // Existing shipment row (from an earlier partial attempt)?
    const { data: existing } = await supabaseAdmin.from("shipments").select("*").eq("order_id", orderId).maybeSingle();

    let shipmentRowId: string | undefined = existing?.id;
    let srShipmentId: string | null = existing?.shipment_id ?? null;
    let raw: Record<string, unknown> = (existing?.raw as Record<string, unknown>) ?? {};

    if (!srShipmentId) {
      const { data: items, error: itemsErr } = await supabaseAdmin
        .from("order_items")
        .select("quantity, selected_age_months, price_cents, product:products ( id, name, product_code )")
        .eq("order_id", orderId);
      if (itemsErr || !items?.length) throw new Error("Order has no items");

      const payload = buildShiprocketOrderPayload(order, items as unknown as ItemRow[], process.env.SHIPROCKET_PICKUP_LOCATION!);
      const createResp = await shiprocketFetch<{ order_id: number; shipment_id: number; status?: string }>(
        "orders/create/adhoc",
        { method: "POST", json: payload }
      );
      if (!createResp?.shipment_id) throw new Error(`Shiprocket did not return a shipment id: ${JSON.stringify(createResp)}`);

      srShipmentId = String(createResp.shipment_id);
      raw = { ...raw, createResp };
      const row = {
        order_id: orderId,
        shiprocket_order_id: String(createResp.order_id),
        shipment_id: srShipmentId,
        status: "created",
        raw,
      };
      // Save immediately, so a retry never creates a second Shiprocket order.
      if (shipmentRowId) {
        await supabaseAdmin.from("shipments").update(row).eq("id", shipmentRowId);
      } else {
        const { data: ins, error: insErr } = await supabaseAdmin.from("shipments").insert(row).select("id").single();
        if (insErr) console.error("Could not save shipment row:", insErr);
        shipmentRowId = ins?.id;
      }
    }

    // Assign AWB (Shiprocket picks the courier).
    let awb: ReturnType<typeof parseAwbResponse>;
    try {
      const awbResp = await shiprocketFetch<any>("courier/assign/awb", { method: "POST", json: { shipment_id: Number(srShipmentId) } });
      raw = { ...raw, awbResp };
      awb = parseAwbResponse(awbResp);
    } catch (e: any) {
      awb = { ok: false, error: String(e?.message ?? e) };
    }

    if (!awb.ok) {
      if (shipmentRowId) await supabaseAdmin.from("shipments").update({ status: "awb_failed", raw: { ...raw, awbError: awb.error } }).eq("id", shipmentRowId);
      await setFulfillment(orderId, "awb_pending");
      return { ok: false, error: `Shiprocket order created, but courier (AWB) could not be assigned: ${awb.error}. Fix in Shiprocket or retry.`, status: "awb_pending" };
    }

    // Request pickup. A failure here is not fatal: it can be scheduled from the Shiprocket panel.
    let pickupToken: string | null = null;
    let pickupScheduled: string | null = null;
    try {
      const pickupResp = await shiprocketFetch<any>("courier/generate/pickup", { method: "POST", json: { shipment_id: [Number(srShipmentId)] } });
      raw = { ...raw, pickupResp };
      pickupToken = pickupResp?.response?.pickup_token_number ?? null;
      pickupScheduled = pickupResp?.response?.pickup_scheduled_date ?? null;
    } catch (e: any) {
      raw = { ...raw, pickupError: String(e?.message ?? e) };
    }

    if (shipmentRowId) {
      await supabaseAdmin
        .from("shipments")
        .update({
          awb_code: awb.awb_code,
          courier_name: awb.courier_name,
          courier_company_id: awb.courier_company_id,
          status: pickupToken || pickupScheduled ? "pickup_requested" : "awb_assigned",
          pickup_token_number: pickupToken ? String(pickupToken) : null,
          pickup_generated_at: pickupToken || pickupScheduled ? new Date().toISOString() : null,
          raw,
        })
        .eq("id", shipmentRowId);
    }
    await setFulfillment(orderId, "shipment_created");
    return { ok: true, status: "shipment_created", awb_code: awb.awb_code, courier_name: awb.courier_name };
  } catch (e: any) {
    console.error("createShipmentForOrder failed:", e);
    await setFulfillment(orderId, "shipment_failed");
    return { ok: false, error: String(e?.message ?? e), status: "shipment_failed" };
  }
}
