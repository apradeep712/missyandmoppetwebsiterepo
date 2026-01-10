'use client';

import Script from 'next/script';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

// List of Indian States & UTs
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

declare global {
  interface Window {
    Razorpay?: any;
  }
}

type Props = {
  productId: string;
  qty: number;
  ageMonths: number | null;
};

export default function CheckoutBuyNowClient({ productId, qty, ageMonths }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Form Field States for Validation
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [selectedState, setSelectedState] = useState('');

  // Validation logic
  const isValid = useMemo(() => {
    const isPhoneValid = /^\d{10}$/.test(phone);
    const isPincodeValid = /^\d{6}$/.test(pincode);
    const isStateValid = selectedState !== "";
    
    return productId && qty >= 1 && isPhoneValid && isPincodeValid && isStateValid;
  }, [productId, qty, phone, pincode, selectedState]);

  async function onSubmit(form: HTMLFormElement) {
    if (!isValid) {
      setErr("Please ensure Phone is 10 digits and Pincode is 6 digits.");
      return;
    }
    setErr(null);
    setLoading(true);

    try {
      const fd = new FormData(form);
      const payload = {
        customer_name: String(fd.get('name') || ''),
        customer_email: String(fd.get('email') || ''),
        customer_phone: phone,
        shipping_address: {
          line1: String(fd.get('line1') || ''),
          city: String(fd.get('city') || ''),
          state: selectedState,
          pincode: pincode,
        },
        items: [
          {
            product_id: productId,
            qty,
            selected_age_months: ageMonths,
          },
        ],
      };

      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create order');

      const { order_id: internalOrderId, razorpay_order_id: razorpayOrderId, razorpay_key_id: razorpayKeyId, amount_cents: amount, currency = 'INR' } = data;

      if (razorpayOrderId.includes('FAKE')) {
        router.push(`/order/success?orderId=${internalOrderId}`);
        return;
      }

      if (!window.Razorpay) throw new Error('Razorpay script not loaded');

      const rzp = new window.Razorpay({
        key: razorpayKeyId,
        amount: amount,
        currency: currency,
        order_id: razorpayOrderId,
        name: 'Missy & Moppet',
        description: 'Quality clothing for little ones',
        handler: async (response: any) => {
          const vr = await fetch('/api/checkout/verify-payment', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              order_id: internalOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (!vr.ok) throw new Error('Payment verification failed');
          router.push(`/order/success?orderId=${internalOrderId}`);
        },
        prefill: {
          name: payload.customer_name,
          email: payload.customer_email,
          contact: payload.customer_phone,
        },
        theme: { color: '#4b3b33' },
      });

      rzp.open();
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <form className="mx-auto max-w-xl space-y-6 pb-12" onSubmit={(e) => { e.preventDefault(); onSubmit(e.currentTarget); }}>
        <div className="overflow-hidden rounded-3xl border border-[#ead8cd] bg-white shadow-sm">
          <div className="bg-[#fdf7f2] px-6 py-4 border-b border-[#ead8cd]">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#4b3b33]">Delivery Details</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">Full Name</label>
                <input name="name" className="input-style" placeholder="Enter name" required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">Phone (10 Digits)</label>
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`input-style ${phone.length > 0 && phone.length < 10 ? 'border-orange-300' : ''}`} 
                  placeholder="9876543210" 
                  required 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">Email Address</label>
              <input name="email" type="email" className="input-style" placeholder="your@email.com" required />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">House/Flat No, Street, Area</label>
              <input name="line1" className="input-style" placeholder="Address line" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">City</label>
                <input name="city" className="input-style" placeholder="City" required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">Pincode</label>
                <input 
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`input-style ${pincode.length > 0 && pincode.length < 6 ? 'border-orange-300' : ''}`} 
                  placeholder="6-digit Pincode" 
                  required 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-[#a07d68] ml-1">State</label>
              <select 
                value={selectedState} 
                onChange={(e) => setSelectedState(e.target.value)}
                className="rounded-xl border border-[#ead8cd] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#4b3b33] transition-colors appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>Select your state</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {err && (
          <div className="rounded-xl bg-red-50 p-4 text-xs text-red-600 border border-red-100">
            {err}
          </div>
        )}

        {pincode.length === 6 && (
          <div className="flex items-center gap-2 px-2 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            We deliver to {pincode}!
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !isValid} 
          className="w-full rounded-2xl bg-[#4b3b33] py-4 text-sm font-bold text-white transition-all hover:bg-[#3a2e29] active:scale-[0.99] disabled:opacity-50 disabled:grayscale"
        >
          {loading ? 'Processing...' : 'Complete Purchase'}
        </button>
      </form>

      <style jsx>{`
        .input-style {
          @apply rounded-xl border border-[#ead8cd] px-4 py-2.5 text-sm outline-none focus:border-[#4b3b33] transition-colors;
        }
      `}</style>
    </>
  );
}