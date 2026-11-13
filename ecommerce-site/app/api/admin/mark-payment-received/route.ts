import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/adminAuth';

export const runtime = 'nodejs';

/** Admin-only: mark an order paid manually (e.g. COD cash collected, or a bank transfer). */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { order_id } = (await req.json().catch(() => ({}))) as { order_id?: string };
  if (!order_id || typeof order_id !== 'string') {
    return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
  }

  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('id, payment_status')
    .eq('id', order_id)
    .maybeSingle();
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const { error: updErr } = await supabaseAdmin
    .from('orders')
    .update({ payment_status: 'paid' })
    .eq('id', order_id);

  if (updErr) {
    console.error('Failed to mark payment received:', updErr);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, payment_status: 'paid' });
}
