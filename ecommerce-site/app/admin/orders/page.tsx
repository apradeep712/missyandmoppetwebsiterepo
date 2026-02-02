'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function AdminOrdersPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_cents,
            selected_age_months,
            products ( name )
          )
        `)
        .order('created_at', { ascending: false });

      if (!error) setOrders(data || []);
      setLoading(false);
    }
    fetchOrders();
  }, [supabase]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-serif font-bold text-[#4b3b33]">Customer Orders</h1>
        <p className="text-xs text-[#b8927c] uppercase tracking-widest font-bold">Manage fulfillment & payments</p>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-[#ead8cd]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#fdf7f2] text-[10px] uppercase tracking-widest font-bold text-[#b8927c]">
            <tr>
              <th className="px-6 py-4">Order / Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#fdf7f2]">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center animate-pulse">Loading orders...</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="text-sm text-[#7c675b] hover:bg-[#fdf7f2]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-[#4b3b33] text-xs">#{order.id.slice(0,8)}</div>
                  <div className="text-[10px] opacity-70">{new Date(order.created_at).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold">{order.customer_name}</div>
                  <div className="text-[10px]">{order.customer_phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-[200px] truncate italic text-xs">
                    {order.order_items?.map((oi: any) => `${oi.quantity}x ${oi.products?.name}`).join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-[#4b3b33]">
                  ₹{(order.total_amount_cents / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {order.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}