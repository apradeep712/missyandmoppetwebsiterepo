import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

interface MarkPaidInput {
  order_id: string;
}

export async function POST(req: Request) {
  try {
    const { order_id } = (await req.json()) as MarkPaidInput;

    if (!order_id || typeof order_id !== 'string') {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // Confirm the order exists first, so we can return a clear 404.
    const { data: order, error: findErr } = await supabaseAdmin
      .from('orders')
      .select('id, payment_status')
      .eq('id', order_id)
      .single();

    if (findErr || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const { error: updErr } = await supabaseAdmin
      .from('orders')
      .update({ payment_status: 'paid' })
      .eq('id', order_id);

    if (updErr) {
      console.error('Failed to mark payment received:', updErr);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, payment_status: 'paid' });
  } catch (err) {
    console.error('Unexpected mark-payment-received error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
