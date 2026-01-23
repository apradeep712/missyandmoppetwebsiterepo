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
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });  
  }
  
  // Mark paid (idempotent)  
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
  }
  
  return NextResponse.json({ ok: true });  
}  