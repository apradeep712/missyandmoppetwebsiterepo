import { NextResponse } from "next/server";  
import { supabaseAdmin } from "@/lib/supabaseAdmin";  
import { getRazorpayClient } from "@/lib/razorpay";  
import { Resend } from 'resend'; // 1. Added Resend import

const resend = new Resend(process.env.RESEND_API_KEY);

interface CheckoutInput {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    product_id: string;
    qty: number;
    selected_age_months: number | null;
  }>;
}

function assertPincode(pincode: string) {  
  if (!/^\d{6}$/.test(pincode)) throw new Error("Invalid pincode");  
}

export async function POST(req: Request) {  
  try {
    const input = (await req.json()) as CheckoutInput;

    assertPincode(input.shipping_address.pincode);

    if (!input.items?.length) {  
      return NextResponse.json({ error: "No items" }, { status: 400 });  
    }

    // --- Step 1: Fetch products from DB ---
    const productIds = input.items.map((i) => i.product_id);  
    const { data: products, error: prodErr } = await supabaseAdmin  
      .from("products")  
      .select("id,name,price_cents,currency,product_code,is_active,stock")  
      .in("id", productIds);

    if (prodErr) return NextResponse.json({ error: prodErr.message }, { status: 500 });  
    if (!products || products.length !== productIds.length) {  
      return NextResponse.json({ error: "One or more products not found" }, { status: 400 });  
    }

    const byId = new Map(products.map((p) => [p.id, p]));  
    let totalAmountCents = 0;

    for (const it of input.items) {  
      const p = byId.get(it.product_id);  
      if (!p) return NextResponse.json({ error: "Product missing" }, { status: 400 });  
      totalAmountCents += Number(p.price_cents) * Number(it.qty);  
    }

    // --- Step 2: Create DB order ---
    const { data: orderRow, error: orderErr } = await supabaseAdmin  
      .from("orders")  
      .insert({  
        customer_name: input.customer_name,  
        customer_email: input.customer_email, 
        customer_phone: input.customer_phone, 
        shipping_line1: input.shipping_address.line1,  
        shipping_city: input.shipping_address.city,  
        shipping_state: input.shipping_address.state,  
        shipping_pincode: input.shipping_address.pincode,
        shipping_address: input.shipping_address,
        currency: "INR",  
        total_amount_cents: totalAmountCents,
        payment_status: "created",  
        fulfillment_status: "pending",  
      })  
      .select("*")  
      .single();

    if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 });

    // --- Step 3: Insert order items ---
    const itemsToInsert = input.items.map((it) => {  
      const p = byId.get(it.product_id)!;  
      return {  
        order_id: orderRow.id,  
        product_id: p.id,  
        quantity: it.qty,  
        selected_age_months: it.selected_age_months,  
        price_cents: p.price_cents,  
      };  
    });

    const { error: itemsErr } = await supabaseAdmin.from("order_items").insert(itemsToInsert);  
    if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

    // --- Step 4: Razorpay Order (with Mock Fallback) ---
    let rpOrderId = "";
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === "placeholder") {
       rpOrderId = `order_FAKE_${Date.now()}`;
    } else {
       const razorpay = getRazorpayClient();  
       const rpOrder = await razorpay.orders.create({  
         amount: totalAmountCents, 
         currency: "INR",  
         receipt: `order_${orderRow.id}`,  
       });
       rpOrderId = rpOrder.id;
    }

    await supabaseAdmin  
      .from("orders")  
      .update({ razorpay_order_id: rpOrderId })  
      .eq("id", orderRow.id);

    // --- Step 5: Trigger Admin Email Notification (NEW) ---
    try {
      const productListHtml = products.map(p => {
        const item = input.items.find(it => it.product_id === p.id);
        return `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item?.qty}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item?.selected_age_months || 'N/A'} mo</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">₹${p.price_cents / 100}</td>
          </tr>`;
      }).join('');

      await resend.emails.send({
        from: 'Missy & Moppet Orders <onboarding@resend.dev>',
        to: 'atishpradeep@gmail.com',
        subject: `New Manual Order: ${input.customer_name}`,
        html: `
          <div style="font-family: sans-serif; color: #4b3b33; max-width: 600px;">
            <h2>🚨 New Order Received</h2>
            <p>A new order has been placed and needs manual processing.</p>
            
            <div style="background: #fdf7f2; padding: 20px; border-radius: 15px; border: 1px solid #ead8cd;">
              <h3 style="margin-top: 0;">Customer Details</h3>
              <p><strong>Name:</strong> ${input.customer_name}</p>
              <p><strong>Phone:</strong> ${input.customer_phone}</p>
              <p><strong>Email:</strong> ${input.customer_email}</p>
              <p><strong>Address:</strong> ${input.shipping_address.line1}, ${input.shipping_address.city}, ${input.shipping_address.state} - ${input.shipping_address.pincode}</p>
            </div>

            <h3>Items Ordered</h3>
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
            
            <p style="font-size: 18px; font-weight: bold; margin-top: 20px;">Total Amount: ₹${totalAmountCents / 100}</p>
            <p style="font-size: 12px; color: #a07d68;">Order ID: ${orderRow.id}</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send admin email:", emailErr);
      // We don't return 500 here because the order is already in the DB.
    }

    return NextResponse.json({  
      order_id: orderRow.id,  
      razorpay_order_id: rpOrderId,  
      amount_cents: totalAmountCents,  
      currency: "INR",  
      razorpay_key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "placeholder",  
    });

  } catch (err: any) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}