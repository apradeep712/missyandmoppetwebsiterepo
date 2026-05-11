// app/components/NewbornKitInterestedButtonClient.tsx
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type NewbornKitInterestedButtonClientProps = {
  label?: string;
  loadingLabel?: string;
  successLabel?: string;
  source?: string;
  microcopy?: string;
  variant?: 'dark' | 'light';
};

export default function NewbornKitInterestedButtonClient({
  label = 'Request Your Kit',
  loadingLabel = 'Sending...',
  successLabel = 'Request Received',
  source = 'unknown',
  microcopy,
  variant = 'dark',
}: NewbornKitInterestedButtonClientProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleClick = async () => {
    if (loading || submitted) return;

    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/requests/newborn-kits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Interested in the Newborn Kit',
          source,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
      setMessage(
        'Request received. Our team will contact you soon with availability and kit details.'
      );
    } catch (e) {
      setError('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isLight = variant === 'light';

  return (
    <div className="w-full space-y-3">
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={loading || submitted}
        whileHover={!submitted ? { scale: 1.02, y: -1 } : undefined}
        whileTap={!submitted ? { scale: 0.98 } : undefined}
        className={[
          'group relative w-full overflow-hidden rounded-full px-7 py-5 text-sm font-bold uppercase tracking-[0.2em] shadow-2xl transition-all disabled:cursor-default',
          isLight
            ? 'bg-[#f3d8c3] text-[#4b3b33] hover:bg-white disabled:opacity-95'
            : 'bg-[#4b3b33] text-[#fdf7f2] hover:bg-[#3f312b] disabled:opacity-95',
        ].join(' ')}
      >
        {!submitted && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        )}

        <span className="relative flex items-center justify-center gap-3">
          {loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {loadingLabel}
            </>
          ) : submitted ? (
            <>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] text-white">
                ✓
              </span>
              {successLabel}
            </>
          ) : (
            label
          )}
        </span>
      </motion.button>

      {microcopy && !message && !error && (
        <p
          className={[
            'text-center text-[11px] font-medium leading-relaxed',
            isLight ? 'text-white/65' : 'text-[#7c675b]',
          ].join(' ')}
        >
          {microcopy}
        </p>
      )}

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"
          >
            <p className="text-center text-xs font-medium leading-relaxed text-emerald-700">
              {message}
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-red-100 bg-red-50 p-4"
          >
            <p className="text-center text-xs font-medium leading-relaxed text-red-700">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}