import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendConfirmationInput {
  order_id: string;
}

export async function POST(req: Request) {
  try {
    const { order_id } = (await req.json()) as SendConfirmationInput;

    if (!order_id || typeof order_id !== "string") {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    // --- Fetch order + items (mirrors the select used in admin/orders/page.tsx) ---
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        customer_name,
        customer_email,
        total_amount_cents,
        shipping_line1,
        shipping_city,
        shipping_state,
        shipping_pincode,
        created_at,
        order_items (
          quantity,
          price_cents,
          selected_age_months,
          products ( name )
        )
      `
      )
      .eq("id", order_id)
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.customer_email) {
      return NextResponse.json(
        { error: "This order has no customer email on file" },
        { status: 400 }
      );
    }

    // --- Build the items table ---
    const items = (order.order_items as any[]) || [];
    const productListHtml = items
      .map((oi) => {
        return `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${oi.products?.name ?? "Item"}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${oi.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${oi.selected_age_months ?? "N/A"} mo</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">₹${(oi.price_cents / 100).toFixed(2)}</td>
          </tr>`;
      })
      .join("");

    const shortId = order.id.slice(0, 8);

    // --- Send the customer-facing confirmation email ---
    await resend.emails.send({
      from: "Missy & Moppet <onboarding@resend.dev>",
      to: [order.customer_email],
      subject: `Your Missy & Moppet order is confirmed (#${shortId})`,
      html: `
        <div style="font-family: sans-serif; color: #4b3b33; max-width: 600px;">
          <h2>Thank you for your order, ${order.customer_name ?? "there"}! 💛</h2>
          <p>We're delighted to confirm that we've received your order and are getting it ready.</p>

          <h3>Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #eee; text-align: left;">
                <th style="padding: 8px;">Product</th>
                <th style="padding: 8px;">Qty</th>
                <th style="padding: 8px;">Age</th>
                <th style="padding: 8px;">Price</th>
              </tr>
            </thead>
            <tbody>${productListHtml}</tbody>
          </table>

          <p style="font-size: 18px; font-weight: bold; margin-top: 20px;">Total: ₹${(order.total_amount_cents / 100).toFixed(2)}</p>

          <div style="background: #fdf7f2; padding: 20px; border-radius: 15px; border: 1px solid #ead8cd; margin-top: 20px;">
            <h3 style="margin-top: 0;">Shipping to</h3>
            <p style="margin: 0;">${order.shipping_line1 ?? ""}, ${order.shipping_city ?? ""}, ${order.shipping_state ?? ""} - ${order.shipping_pincode ?? ""}</p>
          </div>

          <p style="margin-top: 20px;">We'll be in touch with shipping updates. If you have any questions, just reply to this email.</p>
          <p style="font-size: 12px; color: #a07d68;">Order ID: ${order.id}</p>
          <p style="font-size: 12px; color: #a07d68;">With love, the Missy &amp; Moppet team</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Failed to send order confirmation:", err);
    return NextResponse.json(
      { error: "Failed to send confirmation email" },
      { status: 500 }
    );
  }
}
