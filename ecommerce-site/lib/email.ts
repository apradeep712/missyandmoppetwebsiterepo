import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/** Sender. Stays on Resend's sandbox sender until the client verifies their domain. */
export const EMAIL_FROM =
  process.env.EMAIL_FROM || "Missy & Moppet <onboarding@resend.dev>";

/** Where new-order alerts go. */
export const ADMIN_ORDER_EMAIL =
  process.env.ADMIN_ORDER_EMAIL || "missyandmoppet@gmail.com";

let resendClient: Resend | null = null;
function resend() {
  if (!process.env.RESEND_API_KEY) return null;
  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export function escapeHtml(v: unknown) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const rupees = (paise: number) => `₹${(Number(paise) / 100).toFixed(2)}`;

type OrderForEmail = {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  total_amount_cents: number;
  payment_status: string;
  shipping_line1: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;
  order_items: Array<{
    quantity: number;
    price_cents: number;
    selected_age_months: number | null;
    products: { name: string } | null;
  }>;
};

export async function loadOrderForEmail(orderId: string): Promise<OrderForEmail | null> {
  const { data } = await supabaseAdmin
    .from("orders")
    .select(
      `id, customer_name, customer_email, customer_phone, total_amount_cents, payment_status,
       shipping_line1, shipping_city, shipping_state, shipping_pincode,
       order_items ( quantity, price_cents, selected_age_months, products ( name ) )`
    )
    .eq("id", orderId)
    .single();
  return (data as unknown as OrderForEmail) ?? null;
}

function itemsTable(order: OrderForEmail) {
  const rows = (order.order_items || [])
    .map(
      (oi) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(oi.products?.name ?? "Item")}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(oi.quantity)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${oi.selected_age_months != null ? escapeHtml(oi.selected_age_months) + " mo" : "N/A"}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;">${rupees(oi.price_cents)}</td>
        </tr>`
    )
    .join("");
  return `
    <table style="width:100%;border-collapse:collapse;">
      <thead><tr style="background:#eee;text-align:left;">
        <th style="padding:8px;">Product</th><th style="padding:8px;">Qty</th>
        <th style="padding:8px;">Age</th><th style="padding:8px;">Price</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function address(order: OrderForEmail) {
  return [order.shipping_line1, order.shipping_city, order.shipping_state]
    .filter(Boolean)
    .map(escapeHtml)
    .join(", ") + (order.shipping_pincode ? ` - ${escapeHtml(order.shipping_pincode)}` : "");
}

/** Alert to the shop owner: a paid order, or a COD order that needs a confirmation call. */
export async function sendAdminOrderEmail(orderId: string) {
  const client = resend();
  const order = await loadOrderForEmail(orderId);
  if (!client || !order) return { ok: false, error: "Email not configured or order missing" };

  const isCod = order.payment_status === "cod";
  const subject = isCod
    ? `New COD order – call to confirm: ${order.customer_name ?? ""}`
    : `New PAID order: ${order.customer_name ?? ""} (${rupees(order.total_amount_cents)})`;
  const intro = isCod
    ? "A <strong>Cash on Delivery</strong> order was placed. Please call the customer to confirm, then click <em>Book shipment</em> in Admin → Orders."
    : "Payment was received online via Razorpay. The shipment is booked automatically if Shiprocket is set up; otherwise book it from Admin → Orders.";

  const { error } = await client.emails.send({
    from: EMAIL_FROM,
    to: [ADMIN_ORDER_EMAIL],
    subject,
    html: `
      <div style="font-family:sans-serif;color:#4b3b33;max-width:600px;">
        <h2>${isCod ? "🟠 New COD order" : "✅ New paid order"}</h2>
        <p>${intro}</p>
        <div style="background:#fdf7f2;padding:20px;border-radius:15px;border:1px solid #ead8cd;">
          <h3 style="margin-top:0;">Customer</h3>
          <p><strong>Name:</strong> ${escapeHtml(order.customer_name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(order.customer_phone)}</p>
          <p><strong>Email:</strong> ${escapeHtml(order.customer_email)}</p>
          <p><strong>Address:</strong> ${address(order)}</p>
        </div>
        <h3>Items</h3>
        ${itemsTable(order)}
        <p style="font-size:18px;font-weight:bold;margin-top:20px;">Total: ${rupees(order.total_amount_cents)} ${isCod ? "(collect on delivery)" : "(paid)"}</p>
        <p style="font-size:12px;color:#a07d68;">Order ID: ${escapeHtml(order.id)}</p>
      </div>`,
  });
  if (error) console.error("Admin order email failed:", error);
  return { ok: !error, error: error?.message };
}

/** Confirmation to the customer. */
export async function sendCustomerConfirmationEmail(orderId: string) {
  const client = resend();
  const order = await loadOrderForEmail(orderId);
  if (!client) return { ok: false, error: "Email not configured" };
  if (!order) return { ok: false, error: "Order not found" };
  if (!order.customer_email) return { ok: false, error: "This order has no customer email on file" };

  const isCod = order.payment_status === "cod";
  const shortId = order.id.slice(0, 8);
  const { error } = await client.emails.send({
    from: EMAIL_FROM,
    to: [order.customer_email],
    subject: `Your Missy & Moppet order is ${isCod ? "placed" : "confirmed"} (#${shortId})`,
    html: `
      <div style="font-family:sans-serif;color:#4b3b33;max-width:600px;">
        <h2>Thank you for your order, ${escapeHtml(order.customer_name ?? "there")}! 💛</h2>
        <p>${
          isCod
            ? "We've received your Cash on Delivery order. We'll call you shortly to confirm it, then get it on its way."
            : "We've received your payment and are getting your order ready."
        }</p>
        <h3>Order summary</h3>
        ${itemsTable(order)}
        <p style="font-size:18px;font-weight:bold;margin-top:20px;">Total: ${rupees(order.total_amount_cents)}${isCod ? " – pay on delivery" : " – paid"}</p>
        <div style="background:#fdf7f2;padding:20px;border-radius:15px;border:1px solid #ead8cd;margin-top:20px;">
          <h3 style="margin-top:0;">Shipping to</h3>
          <p style="margin:0;">${address(order)}</p>
        </div>
        <p style="margin-top:20px;">We'll be in touch with shipping updates. If you have any questions, just reply to this email.</p>
        <p style="font-size:12px;color:#a07d68;">Order ID: ${escapeHtml(order.id)}</p>
        <p style="font-size:12px;color:#a07d68;">With love, the Missy &amp; Moppet team</p>
      </div>`,
  });
  if (error) console.error("Customer confirmation email failed:", error);
  return { ok: !error, error: error?.message };
}
