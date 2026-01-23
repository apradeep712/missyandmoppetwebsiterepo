'use client';

import { useState } from 'react';
import Link from 'next/link';
import HomeHeader from '@/app/components/HomeHeader';
import { useCartStore } from '@/app/store/cartStore';
import CheckoutCartClient from '@/app/components/CheckoutCartClient';

export default function CartPage() {
  const { items, removeItem, setQuantity } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalCents = items.reduce((sum, item) => sum + item.price_cents * item.quantity, 0);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#fdf7f2]">
        <HomeHeader />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-2xl font-serif text-[#4b3b33]">Your cart is empty</h1>
          <Link href="/shop" className="mt-4 inline-block text-[#a07d68] underline">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33] pb-20">
      <HomeHeader />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-8 text-center">
          {isCheckingOut ? 'Finalize Order' : 'Your Shopping Cart'}
        </h1>

        <div className="flex flex-col items-center">
          {!isCheckingOut ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
              <div className="lg:col-span-8 space-y-4">
                <div className="rounded-[2rem] border border-[#ead8cd] bg-white p-6 shadow-sm">
                  {items.map((item) => (
                    <div key={item.line_id} className="flex items-center gap-4 py-6 border-b border-[#ead8cd]/30 last:border-0">
                      <div className="h-24 w-24 bg-[#f4e3d7] rounded-2xl overflow-hidden flex-shrink-0">
                        {item.image_url && <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        <p className="text-[10px] text-[#a07d68] uppercase mb-2">Age: {item.selected_age_months || 'N/A'}M</p>
                        <div className="flex items-center gap-4">
                          <button onClick={() => setQuantity(item.line_id, item.quantity - 1)} className="h-8 w-8 rounded-full border border-[#ead8cd]">-</button>
                          <span className="text-sm font-bold">{item.quantity}</span>
                          <button onClick={() => setQuantity(item.line_id, item.quantity + 1)} className="h-8 w-8 rounded-full border border-[#ead8cd]">+</button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm mb-2">₹{(item.price_cents / 100).toFixed(2)}</p>
                        <button onClick={() => removeItem(item.line_id)} className="text-[#a85454] text-[10px] font-bold uppercase tracking-widest">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4">
                <div className="rounded-[2rem] bg-[#4b3b33] p-8 text-[#fdf7f2] shadow-xl sticky top-24">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs opacity-70 uppercase tracking-widest">Total Amount</span>
                    <span className="text-2xl font-serif">₹{(totalCents / 100).toFixed(2)}</span>
                  </div>
                  <button onClick={() => setIsCheckingOut(true)} className="w-full rounded-full bg-white py-4 text-sm font-bold text-[#4b3b33]">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              <button onClick={() => setIsCheckingOut(false)} className="mb-6 text-[10px] font-bold uppercase tracking-widest text-[#a07d68]">← Return to Cart</button>
              <CheckoutCartClient />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}