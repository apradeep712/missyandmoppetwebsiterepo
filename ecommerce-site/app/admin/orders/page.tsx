'use client';

import React, { useCallback, useEffect, useState } from 'react';

type Shipment = { awb_code: string | null; courier_name: string | null; status: string | null } | null;
type Order = {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  total_amount_cents: number;
  payment_status: string;
  fulfillment_status: string | null;
  payment_failed_reason: string | null;
  order_items: Array<{ quantity: number; selected_age_months: number | null; products: { name: string } | null }>;
  shipment: Shipment;
};

type BtnState = 'idle' | 'busy' | 'done' | 'error';

const PAY_LABEL: Record<string, { text: string; cls: string }> = {
  paid: { text: 'Paid online', cls: 'bg-green-100 text-green-700' },
  cod: { text: 'COD', cls: 'bg-amber-100 text-amber-800' },
  created: { text: 'Awaiting payment', cls: 'bg-stone-100 text-stone-600' },
  failed: { text: 'Payment failed', cls: 'bg-red-100 text-red-700' },
};

const btn =
  'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [shiprocketOn, setShiprocketOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [state, setState] = useState<Record<string, BtnState>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Could not load orders');
      setOrders(data.orders);
      setShiprocketOn(!!data.shiprocket_configured);
      setLoadError(null);
    } catch (e: any) {
      setLoadError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function call(key: string, url: string, orderId: string, after?: (data: any) => void) {
    setState((s) => ({ ...s, [key]: 'busy' }));
    setMessages((m) => ({ ...m, [orderId]: '' }));
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) throw new Error(data?.error || 'Request failed');
      setState((s) => ({ ...s, [key]: 'done' }));
      after?.(data);
    } catch (e: any) {
      setState((s) => ({ ...s, [key]: 'error' }));
      setMessages((m) => ({ ...m, [orderId]: e.message }));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-serif font-bold text-[#4b3b33]">Customer Orders</h1>
        <p className="text-xs text-[#b8927c] uppercase tracking-widest font-bold">Manage fulfillment & payments</p>
        {!shiprocketOn && !loading && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
            Shiprocket is not connected yet, so shipments can&apos;t be booked from here. Add the Shiprocket settings in Vercel to enable it.
          </p>
        )}
      </div>

      {loadError && <p className="rounded-xl bg-red-50 p-3 text-xs text-red-600">{loadError}</p>}

      <div className="overflow-x-auto rounded-[2rem] border border-[#ead8cd]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#fdf7f2] text-[10px] uppercase tracking-widest font-bold text-[#b8927c]">
            <tr>
              <th className="px-6 py-4">Order / Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Shipping</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#fdf7f2]">
            {loading ? (
              <tr><td colSpan={7} className="p-10 text-center animate-pulse">Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="p-10 text-center">No orders yet.</td></tr>
            ) : (
              orders.map((order) => {
                const pay = PAY_LABEL[order.payment_status] ?? { text: order.payment_status, cls: 'bg-stone-100 text-stone-600' };
                const shipped = order.fulfillment_status === 'shipment_created';
                const canShip = (order.payment_status === 'paid' || order.payment_status === 'cod') && !shipped;
                const shipKey = `ship:${order.id}`;
                const payKey = `pay:${order.id}`;
                const mailKey = `mail:${order.id}`;

                return (
                  <tr key={order.id} className="align-top text-sm text-[#7c675b] hover:bg-[#fdf7f2]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#4b3b33] text-xs">#{order.id.slice(0, 8)}</div>
                      <div className="text-[10px] opacity-70">{new Date(order.created_at).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{order.customer_name}</div>
                      <div className="text-[10px]">{order.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[200px] text-xs italic">
                        {order.order_items
                          ?.map((oi) => `${oi.quantity}× ${oi.products?.name ?? 'Item'}${oi.selected_age_months != null ? ` (${oi.selected_age_months}m)` : ''}`)
                          .join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#4b3b33]">₹{(order.total_amount_cents / 100).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold uppercase ${pay.cls}`}>{pay.text}</span>
                      {order.payment_status === 'cod' && !shipped && (
                        <div className="mt-1 text-[10px] text-amber-700">Call to confirm, then book</div>
                      )}
                      {order.payment_status === 'failed' && order.payment_failed_reason && (
                        <div className="mt-1 max-w-[160px] text-[10px] text-red-600">{order.payment_failed_reason}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {shipped ? (
                        <>
                          <div className="font-bold text-green-700">Booked</div>
                          {order.shipment?.awb_code && <div className="font-mono text-[10px]">AWB {order.shipment.awb_code}</div>}
                          {order.shipment?.courier_name && <div className="text-[10px]">{order.shipment.courier_name}</div>}
                        </>
                      ) : order.fulfillment_status === 'awb_pending' ? (
                        <span className="text-amber-700">Courier not assigned – retry</span>
                      ) : order.fulfillment_status === 'shipment_failed' ? (
                        <span className="text-red-600">Booking failed – retry</span>
                      ) : order.fulfillment_status === 'booking' ? (
                        <span>Booking…</span>
                      ) : (
                        <span className="opacity-60">Not shipped</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {canShip && shiprocketOn && (
                          <button
                            type="button"
                            disabled={state[shipKey] === 'busy'}
                            onClick={() => {
                              if (order.payment_status === 'cod' && !confirm('Have you confirmed this COD order with the customer? This books a real Shiprocket pickup.')) return;
                              call(shipKey, '/api/admin/book-shipment', order.id, () => load());
                            }}
                            className={`${btn} bg-[#4b3b33] text-[#fdf7f2] border-[#4b3b33] hover:opacity-90`}
                          >
                            {state[shipKey] === 'busy' ? 'Booking…' : state[shipKey] === 'error' ? 'Retry booking' : 'Book shipment'}
                          </button>
                        )}

                        {order.payment_status !== 'paid' && (
                          <button
                            type="button"
                            disabled={state[payKey] === 'busy'}
                            onClick={() => {
                              if (!confirm('Mark this order as paid? Only do this once the money is actually received (e.g. COD cash collected).')) return;
                              call(payKey, '/api/admin/mark-payment-received', order.id, () =>
                                setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, payment_status: 'paid' } : o)))
                              );
                            }}
                            className={`${btn} bg-white text-[#4b3b33] border-[#4b3b33] hover:bg-[#fdf7f2]`}
                          >
                            {state[payKey] === 'busy' ? 'Saving…' : 'Mark payment received'}
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={state[mailKey] === 'busy'}
                          onClick={() => call(mailKey, '/api/admin/send-order-confirmation', order.id)}
                          className={`${btn} ${
                            state[mailKey] === 'done'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-white text-[#4b3b33] border-[#ead8cd] hover:bg-[#fdf7f2]'
                          }`}
                        >
                          {state[mailKey] === 'busy' ? 'Sending…' : state[mailKey] === 'done' ? 'Sent ✓' : 'Resend confirmation'}
                        </button>
                      </div>
                      {messages[order.id] && <p className="mt-2 max-w-[240px] text-[10px] text-red-600">{messages[order.id]}</p>}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
