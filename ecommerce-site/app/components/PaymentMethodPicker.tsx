'use client';

import { CreditCard, Truck } from 'lucide-react';
import type { PaymentMethod } from '@/app/hooks/useCheckout';

/** "Pay online" / "Cash on Delivery" choice. Online is hidden when Razorpay isn't configured. */
export default function PaymentMethodPicker({
  online,
  value,
  onChange,
}: {
  online: boolean | null;
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}) {
  const options: Array<{ id: PaymentMethod; title: string; note: string; Icon: typeof CreditCard }> = [
    ...(online
      ? [{ id: 'razorpay' as const, title: 'Pay online', note: 'UPI, cards, net banking, wallets', Icon: CreditCard }]
      : []),
    { id: 'cod', title: 'Cash on Delivery', note: "Pay when it arrives. We'll call to confirm.", Icon: Truck },
  ];

  if (online === null) {
    return <div className="h-[68px] animate-pulse rounded-2xl bg-[#f3e7de]" aria-label="Loading payment options" />;
  }

  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 ml-1 text-[10px] font-bold uppercase tracking-widest text-[#a07d68]">Payment method</legend>
      {options.map(({ id, title, note, Icon }) => {
        const active = value === id;
        return (
          <label
            key={id}
            className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 transition-colors ${
              active ? 'border-[#4b3b33] bg-[#fdf7f2]' : 'border-[#ead8cd] bg-white hover:border-[#c9ad9a]'
            }`}
          >
            <input
              type="radio"
              name="payment_method"
              value={id}
              checked={active}
              onChange={() => onChange(id)}
              className="sr-only"
            />
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${active ? 'bg-[#4b3b33] text-white' : 'bg-[#fdf7f2] text-[#a07d68]'}`}>
              <Icon size={18} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-[#4b3b33]">{title}</span>
              <span className="block text-xs text-[#a07d68]">{note}</span>
            </span>
            <span className={`h-4 w-4 rounded-full border-2 ${active ? 'border-[#4b3b33] bg-[#4b3b33] shadow-[inset_0_0_0_3px_#fdf7f2]' : 'border-[#c9ad9a]'}`} />
          </label>
        );
      })}
    </fieldset>
  );
}
