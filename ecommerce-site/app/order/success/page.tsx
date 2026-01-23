import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const sp = await searchParams;
  const orderId = sp.orderId;

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 text-center">
      {/* Success Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
        <CheckCircle2 size={48} strokeWidth={1.5} />
      </div>

      {/* Main Text */}
      <h1 className="text-3xl font-bold tracking-tight text-[#4b3b33] sm:text-4xl">
        Order Confirmed!
      </h1>
      <p className="mt-4 text-base text-[#7c675b]">
        Thank you for shopping with Missy & Moppet. <br className="hidden sm:block" />
        We've received your order and are getting it ready for shipment.
      </p>

      {/* Order Details Card */}
      <div className="mt-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#ead8cd] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#ead8cd] bg-[#fdf7f2] px-6 py-4">
          <Package size={18} className="text-[#a07d68]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#4b3b33]">Order Summary</span>
        </div>
        <div className="p-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-[#a07d68]">Order ID</span>
            <span className="font-mono font-medium text-[#4b3b33]">{orderId || 'N/A'}</span>
          </div>
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-[#a07d68]">Status</span>
            <span className="font-medium text-green-600">Payment Successful</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4b3b33] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[#3a2e29] active:scale-[0.98]"
        >
          Continue Shopping
          <ArrowRight size={16} />
        </Link>
       
      </div>

      <p className="mt-8 text-xs text-[#a07d68]">
        Our team is preparing your order with love and care. We will reach out to you within 1 hour.
      </p>
    </div>
  );
}