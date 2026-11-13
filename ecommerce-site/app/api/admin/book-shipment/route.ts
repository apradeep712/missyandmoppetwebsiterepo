import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { createShipmentForOrder } from "@/lib/createShipment";

export const runtime = "nodejs";

/** Admin-only: book (or retry) the Shiprocket shipment for a paid or confirmed COD order. */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { order_id } = (await req.json().catch(() => ({}))) as { order_id?: string };
  if (!order_id || typeof order_id !== "string") {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
  }

  const result = await createShipmentForOrder(order_id);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
