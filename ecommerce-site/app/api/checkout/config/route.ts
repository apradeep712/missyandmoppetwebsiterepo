import { NextResponse } from "next/server";
import { isRazorpayLive } from "@/lib/orderPayment";

export const dynamic = "force-dynamic";

/** Tells the checkout UI which payment methods are available right now. */
export async function GET() {
  const online = isRazorpayLive();
  return NextResponse.json({
    online,
    cod: true,
    razorpay_key_id: online ? process.env.RAZORPAY_KEY_ID : null,
  });
}
