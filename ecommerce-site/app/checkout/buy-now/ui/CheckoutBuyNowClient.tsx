'use client';

import { useMemo, useState } from 'react';
import { useCheckout, type PaymentMethod } from '@/app/hooks/useCheckout';
import PaymentMethodPicker from '@/app/components/PaymentMethodPicker';
import { INDIAN_STATES } from '@/lib/indianStates';

type Props = {
  productId: string;
  qty: number;
  ageMonths: number | null;
};

const inputCls =
  'rounded-xl border border-[#ead8cd] px-4 py-2.5 text-sm outline-none focus:border-[#4b3b33] transition-colors bg-white';

export default function CheckoutBuyNowClient({ productId, qty, ageMonths }: Props) {
  const { online, busy, error, setError, placeOrder } = useCheckout();

  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [chosen, setMethod] = useState<PaymentMethod | null>(null);
  // Until the customer picks, default to online payment when it's available.
  const method: PaymentMethod = chosen ?? (online ? 'razorpay' : 'cod');

  const isValid = useMemo(
    () =>
      !!productId &&
      Number.isInteger(qty) && qty >= 1 &&
      /^[6-9]\d{9}$/.test(phone) &&
      /^[1-9]\d{5}$/.test(pincode) &&
      selectedState !== '',
    [productId, qty, phone, pincode, selectedState]
  );

  const submit = async (form: HTMLFormElement) => {
    if (!isValid) {
      setError('Please fill in all fields: a 10-digit mobile number and a 6-digit pincode.');
      return;
    }
    const fd = new FormData(form);
    await placeOrder(
      {
        customer_name: String(fd.get('name') || ''),
        customer_email: String(fd.get('email') || ''),
        customer_phone: `+91${phone}`,
        shipping_address: {
          line1: String(fd.get('line1') || ''),
          city: String(fd.get('city') || ''),
          state: selectedState,
          pincode,
        },
        items: [{ product_id: productId, qty, selected_age_months: ageMonths }],
      },
      method
    );
  };

  return (
    <form
      className="mx-auto max-w-xl space-y-6 pb-12"
      onSubmit={(e) => {
        e.preventDefault();
        submit(e.currentTarget);
      }}
    >
      <div className="overflow-hidden rounded-3xl border border-[#ead8cd] bg-white shadow-sm">
        <div className="bg-[#fdf7f2] px-6 py-4 border-b border-[#ead8cd]">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#4b3b33]">Delivery Details</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">Full Name</label>
              <input name="name" className={inputCls} placeholder="Enter name" required maxLength={100} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">Phone Number</label>
              <div className="flex gap-2">
                <span className="flex items-center justify-center bg-[#fdf7f2] border border-[#ead8cd] rounded-xl px-3 text-sm text-[#4b3b33] font-medium min-w-[50px]">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`${inputCls} flex-1 min-w-0`}
                  placeholder="10-digit mobile"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">Email Address</label>
            <input name="email" type="email" className={inputCls} placeholder="your@email.com" required />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">House/Flat No, Street, Area</label>
            <input name="line1" className={inputCls} placeholder="Address line" required maxLength={300} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">City</label>
              <input name="city" className={inputCls} placeholder="City" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">Pincode</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={inputCls}
                placeholder="6-digit pincode"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className={`${inputCls} appearance-none cursor-pointer`}
              required
            >
              <option value="" disabled>Select your state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-[#a07d68]">We currently deliver within India only.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-[#ead8cd] bg-white p-6 shadow-sm">
        <PaymentMethodPicker online={online} value={method} onChange={setMethod} />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-xs text-red-600 border border-red-100">{error}</div>
      )}

      <button
        type="submit"
        disabled={busy || !isValid || online === null}
        className="w-full rounded-2xl bg-[#4b3b33] py-4 text-sm font-bold text-white transition-all hover:bg-[#3a2e29] active:scale-[0.99] disabled:opacity-50 disabled:grayscale"
      >
        {busy
          ? method === 'razorpay' ? 'Opening payment…' : 'Placing order…'
          : method === 'razorpay' ? 'Pay now' : 'Place COD order'}
      </button>
    </form>
  );
}
