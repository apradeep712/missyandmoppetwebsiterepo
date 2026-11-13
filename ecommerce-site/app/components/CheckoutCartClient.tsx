'use client';

import { useMemo, useState } from 'react';
import { useCartStore } from '@/app/store/cartStore';
import { useCheckout, type PaymentMethod } from '@/app/hooks/useCheckout';
import PaymentMethodPicker from '@/app/components/PaymentMethodPicker';
import { INDIAN_STATES } from '@/lib/indianStates';

export default function CheckoutCartClient() {
  const { items, clear } = useCartStore();
  const { online, busy, error, placeOrder } = useCheckout({ onPlaced: clear });

  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');
  const [chosen, setMethod] = useState<PaymentMethod | null>(null);
  // Until the customer picks, default to online payment when it's available.
  const method: PaymentMethod = chosen ?? (online ? 'razorpay' : 'cod');

  const isValid = useMemo(
    () => items.length > 0 && /^[6-9]\d{9}$/.test(phone) && /^[1-9]\d{5}$/.test(pincode) && state !== '',
    [items, phone, pincode, state]
  );

  async function onSubmit(form: HTMLFormElement) {
    if (!isValid || busy) return;
    const fd = new FormData(form);
    await placeOrder(
      {
        customer_name: String(fd.get('name') || ''),
        customer_email: String(fd.get('email') || ''),
        customer_phone: `+91${phone}`,
        shipping_address: {
          line1: String(fd.get('address') || ''),
          city: String(fd.get('city') || ''),
          state,
          pincode,
        },
        items: items.map((i) => ({
          product_id: i.id,
          qty: i.quantity,
          selected_age_months: i.selected_age_months,
        })),
      },
      method
    );
  }

  const label = busy
    ? method === 'razorpay'
      ? 'Opening payment…'
      : 'Placing order…'
    : method === 'razorpay'
      ? 'Pay now'
      : 'Place COD order';

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(e.currentTarget); }} className="space-y-4">
      <div className="rounded-[2rem] border border-[#ead8cd] bg-white p-8 space-y-4 shadow-sm">
        <input name="name" className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm text-[#4b3b33] [-webkit-text-fill-color:#4b3b33] placeholder:text-[#b8a497] placeholder:[-webkit-text-fill-color:#b8a497]" placeholder="Full Name" required maxLength={100} />
        <input name="email" type="email" className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm text-[#4b3b33] [-webkit-text-fill-color:#4b3b33] placeholder:text-[#b8a497] placeholder:[-webkit-text-fill-color:#b8a497]" placeholder="Email" required />
        <div className="flex gap-2">
          <span className="bg-[#fdf7f2] border border-[#ead8cd] rounded-xl px-4 py-3 text-sm font-bold text-[#4b3b33]">+91</span>
          <input
            value={phone}
            inputMode="numeric"
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="flex-1 rounded-xl border border-[#ead8cd] p-3 text-sm text-[#4b3b33] [-webkit-text-fill-color:#4b3b33] placeholder:text-[#b8a497] placeholder:[-webkit-text-fill-color:#b8a497]"
            placeholder="10-digit mobile number"
            required
          />
        </div>
        <textarea name="address" className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm text-[#4b3b33] [-webkit-text-fill-color:#4b3b33] placeholder:text-[#b8a497] placeholder:[-webkit-text-fill-color:#b8a497]" placeholder="Shipping Address" rows={3} required maxLength={300} />
        <div className="grid grid-cols-2 gap-4">
          <input name="city" className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm text-[#4b3b33] [-webkit-text-fill-color:#4b3b33] placeholder:text-[#b8a497] placeholder:[-webkit-text-fill-color:#b8a497]" placeholder="City" required />
          <input
            value={pincode}
            inputMode="numeric"
            maxLength={6}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm text-[#4b3b33] [-webkit-text-fill-color:#4b3b33] placeholder:text-[#b8a497] placeholder:[-webkit-text-fill-color:#b8a497]"
            placeholder="6-digit Pincode"
            required
          />
        </div>
        <select value={state} onChange={(e) => setState(e.target.value)} className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm text-[#4b3b33] [-webkit-text-fill-color:#4b3b33] placeholder:text-[#b8a497] placeholder:[-webkit-text-fill-color:#b8a497] bg-white" required>
          <option value="">Select State</option>
          {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="rounded-[2rem] border border-[#ead8cd] bg-white p-6 shadow-sm">
        <PaymentMethodPicker online={online} value={method} onChange={setMethod} />
      </div>

      {error && <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-center text-xs text-red-600">{error}</p>}
      <button disabled={busy || !isValid || online === null} type="submit" className="w-full rounded-full bg-[#4b3b33] py-5 text-white font-bold text-sm shadow-lg disabled:opacity-50">
        {label}
      </button>
      <p className="text-center text-[11px] text-[#a07d68]">We currently deliver within India only.</p>
    </form>
  );
}
