'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/app/store/cartStore';

const INDIAN_STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"];

export default function CheckoutCartClient() {
  const router = useRouter();
  const { items, clear } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('');

  const isValid = useMemo(() => {
    return items.length > 0 && phone.length >= 10 && pincode.length === 6 && state !== "";
  }, [items, phone, pincode, state]);

  async function onSubmit(form: HTMLFormElement) {
    if (!isValid) return;
    setErr(null); setLoading(true);

    try {
      const fd = new FormData(form);
      const payload = {
        customer_name: String(fd.get('name')),
        customer_email: String(fd.get('email')),
        customer_phone: `+91${phone}`,
        shipping_address: {
          line1: String(fd.get('address')),
          city: String(fd.get('city')),
          state: state,
          pincode: pincode,
        },
        items: items.map(i => ({
          product_id: i.id,
          qty: i.quantity,
          selected_age_months: i.selected_age_months
        })),
      };

      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Since we want email notification and success page
      clear();
      router.push(`/order/success?orderId=${data.order_id}`);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(e.currentTarget); }} className="space-y-4">
      <div className="rounded-[2rem] border border-[#ead8cd] bg-white p-8 space-y-4 shadow-sm">
        <input name="name" className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm" placeholder="Full Name" required />
        <input name="email" type="email" className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm" placeholder="Email" required />
        <div className="flex gap-2">
          <span className="bg-[#fdf7f2] border border-[#ead8cd] rounded-xl px-4 py-3 text-sm font-bold">+91</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} className="flex-1 rounded-xl border border-[#ead8cd] p-3 text-sm" placeholder="Phone Number" required />
        </div>
        <textarea name="address" className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm" placeholder="Shipping Address" rows={3} required />
        <div className="grid grid-cols-2 gap-4">
          <input name="city" className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm" placeholder="City" required />
          <input value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm" placeholder="Pincode" required />
        </div>
        <select value={state} onChange={(e) => setState(e.target.value)} className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm bg-white" required>
          <option value="">Select State</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {err && <p className="text-red-500 text-xs text-center">{err}</p>}
      <button disabled={loading || !isValid} type="submit" className="w-full rounded-full bg-[#4b3b33] py-5 text-white font-bold text-sm shadow-lg disabled:opacity-50">
        {loading ? 'Placing Order...' : 'Complete Purchase'}
      </button>
    </form>
  );
}