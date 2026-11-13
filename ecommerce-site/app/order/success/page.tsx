import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, Clock, XCircle, Truck } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { orderViewToken, safeEqual } from '@/lib/crypto';

export const dynamic = 'force-dynamic';

type View = {
  tone: 'ok' | 'cod' | 'pending' | 'failed' | 'unknown';
  title: string;
  message: string;
  statusLabel: string;
};

function viewFor(paymentStatus: string | null): View {
  switch (paymentStatus) {
    case 'paid':
      return {
        tone: 'ok',
        title: 'Order Confirmed!',
        message: "Thank you for shopping with Missy & Moppet. We've received your payment and are getting your order ready for shipment.",
        statusLabel: 'Paid',
      };
    case 'cod':
      return {
        tone: 'cod',
        title: 'Order Placed!',
        message: "Thank you! Your Cash on Delivery order is placed. We'll call you shortly to confirm it before shipping.",
        statusLabel: 'Cash on Delivery',
      };
    case 'failed':
      return {
        tone: 'failed',
        title: 'Payment not completed',
        message: "Your payment didn't go through and no money was taken. You can try again from the product page, or choose Cash on Delivery.",
        statusLabel: 'Payment failed',
      };
    case 'created':
      return {
        tone: 'pending',
        title: 'Confirming your payment…',
        message: "We haven't received confirmation from the bank yet. If money was deducted, it will be confirmed automatically within a few minutes — please refresh this page.",
        statusLabel: 'Awaiting payment',
      };
    default:
      return {
        tone: 'unknown',
        title: 'Thank you!',
        message: "We couldn't load this order's details. If you completed a payment, you'll receive a confirmation email shortly.",
        statusLabel: '—',
      };
  }
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; t?: string }>;
}) {
  const { orderId, t } = await searchParams;

  let order: { id: string; payment_status: string; total_amount_cents: number } | null = null;
  if (orderId && t && safeEqual(t, orderViewToken(orderId))) {
    const { data } = await supabaseAdmin
      .from('orders')
      .select('id, payment_status, total_amount_cents')
      .eq('id', orderId)
      .maybeSingle();
    order = data;
  }

  const v = viewFor(order?.payment_status ?? null);
  const Icon = v.tone === 'ok' ? CheckCircle2 : v.tone === 'cod' ? Truck : v.tone === 'failed' ? XCircle : v.tone === 'pending' ? Clock : CheckCircle2;
  const iconClass =
    v.tone === 'failed' ? 'bg-red-50 text-red-500' : v.tone === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600';
  const statusClass = v.tone === 'failed' ? 'text-red-500' : v.tone === 'pending' ? 'text-amber-600' : 'text-green-600';

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${iconClass}`}>
        <Icon size={48} strokeWidth={1.5} />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-[#4b3b33] sm:text-4xl">{v.title}</h1>
      <p className="mt-4 max-w-lg text-base text-[#7c675b]">{v.message}</p>

      {order && (
        <div className="mt-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#ead8cd] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#ead8cd] bg-[#fdf7f2] px-6 py-4">
            <Package size={18} className="text-[#a07d68]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#4b3b33]">Order Summary</span>
          </div>
          <div className="space-y-3 p-6 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-[#a07d68]">Order ID</span>
              <span className="font-mono font-medium text-[#4b3b33]">#{order.id.slice(0, 8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a07d68]">Total</span>
              <span className="font-medium text-[#4b3b33]">₹{(order.total_amount_cents / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a07d68]">Status</span>
              <span className={`font-medium ${statusClass}`}>{v.statusLabel}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4b3b33] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[#3a2e29] active:scale-[0.98]"
        >
          Continue Shopping
          <ArrowRight size={16} />
        </Link>
      </div>

      {(v.tone === 'ok' || v.tone === 'cod') && (
        <p className="mt-8 text-xs text-[#a07d68]">
          A confirmation email is on its way. Our team is preparing your order with love and care.
        </p>
      )}
    </div>
  );
}
