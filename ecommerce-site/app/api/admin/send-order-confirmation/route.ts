import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { sendCustomerConfirmationEmail } from "@/lib/email";

export const runtime = "nodejs";

/** Admin-only: (re)send the order confirmation email to the customer. */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { order_id } = (await req.json().catch(() => ({}))) as { order_id?: string };
  if (!order_id || typeof order_id !== "string") {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  const res = await sendCustomerConfirmationEmail(order_id);
  if (!res.ok) {
    const status = res.error === "Order not found" ? 404 : res.error?.includes("no customer email") ? 400 : 500;
    return NextResponse.json({ error: res.error || "Failed to send confirmation email" }, { status });
  }
  return NextResponse.json({ ok: true });
}
