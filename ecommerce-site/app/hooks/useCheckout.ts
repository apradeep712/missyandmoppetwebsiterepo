'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export type PaymentMethod = 'razorpay' | 'cod';

export type CheckoutPayload = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: { line1: string; city: string; state: string; pincode: string };
  items: Array<{ product_id: string; qty: number; selected_age_months: number | null }>;
};

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const s = existing ?? document.createElement('script');
    s.addEventListener('load', () => resolve(!!window.Razorpay));
    s.addEventListener('error', () => resolve(false));
    if (!existing) {
      s.src = SCRIPT_SRC;
      s.async = true;
      document.body.appendChild(s);
    }
  });
}

function newIdempotencyKey() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Shared checkout logic for cart + buy-now:
 * asks the server which payment methods are available, creates the order,
 * opens Razorpay (online) or finishes immediately (COD), verifies payment.
 */
export function useCheckout(opts: { onPlaced?: () => void } = {}) {
  const router = useRouter();
  const [online, setOnline] = useState<boolean | null>(null); // null = still loading
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idemKey = useRef<string>(newIdempotencyKey());

  useEffect(() => {
    let cancelled = false;
    fetch('/api/checkout/config')
      .then((r) => r.json())
      .then((c) => {
        if (cancelled) return;
        setOnline(!!c.online);
        if (c.online) loadRazorpayScript();
      })
      .catch(() => !cancelled && setOnline(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const goToResult = useCallback(
    (orderId: string, token: string) => router.push(`/order/success?orderId=${orderId}&t=${token}`),
    [router]
  );

  const placeOrder = useCallback(
    async (payload: CheckoutPayload, method: PaymentMethod) => {
      setError(null);
      setBusy(true);
      try {
        if (method === 'razorpay') {
          const ok = await loadRazorpayScript();
          if (!ok) throw new Error('Could not load the payment window. Check your connection, or choose Cash on Delivery.');
        }

        const res = await fetch('/api/checkout/create-order', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-idempotency-key': idemKey.current },
          body: JSON.stringify({ ...payload, payment_method: method }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Could not place your order. Please try again.');

        if (data.payment_method === 'cod') {
          opts.onPlaced?.();
          goToResult(data.order_id, data.view_token);
          return;
        }

        // ---- Online payment ----
        await new Promise<void>((resolve) => {
          let settled = false;
          const finish = () => {
            if (!settled) {
              settled = true;
              resolve();
            }
          };

          const rzp = new window.Razorpay({
            key: data.razorpay_key_id,
            amount: data.amount_cents,
            currency: data.currency || 'INR',
            order_id: data.razorpay_order_id,
            name: 'Missy & Moppet',
            description: `Order #${String(data.order_id).slice(0, 8)}`,
            prefill: {
              name: payload.customer_name,
              email: payload.customer_email,
              contact: payload.customer_phone,
            },
            notes: { order_id: data.order_id },
            theme: { color: '#4b3b33' },
            retry: { enabled: true, max_count: 3 },
            handler: async (response: any) => {
              try {
                const vr = await fetch('/api/checkout/verify-payment', {
                  method: 'POST',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({
                    order_id: data.order_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });
                if (!vr.ok) {
                  const d = await vr.json().catch(() => ({}));
                  throw new Error(d?.error || 'Payment verification failed');
                }
                opts.onPlaced?.();
              } catch (e: any) {
                // The webhook will still confirm a real payment; the result page shows the live status.
                console.error(e);
              } finally {
                idemKey.current = newIdempotencyKey();
                goToResult(data.order_id, data.view_token);
                finish();
              }
            },
            modal: {
              ondismiss: () => {
                setError('Payment was cancelled. You can try again, or choose Cash on Delivery.');
                idemKey.current = newIdempotencyKey();
                finish();
              },
            },
          });

          rzp.on('payment.failed', (resp: any) => {
            const reason = String(resp?.error?.description || 'Payment failed').replace(/[.\s]+$/, '');
            setError(`${reason}. No money was taken — please try again or choose Cash on Delivery.`);
            fetch('/api/checkout/verify-payment', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                order_id: data.order_id,
                razorpay_order_id: data.razorpay_order_id,
                razorpay_payment_id: resp?.error?.metadata?.payment_id,
                failed: true,
                reason,
              }),
            }).catch(() => {});
          });

          rzp.open();
        });
      } catch (e: any) {
        setError(e?.message || 'Something went wrong. Please try again.');
      } finally {
        setBusy(false);
      }
    },
    [goToResult, opts]
  );

  return { online, busy, error, setError, placeOrder };
}
