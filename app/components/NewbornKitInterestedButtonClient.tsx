'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewbornKitInterestedButtonClient() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/requests/newborn-kits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Interested in the Newborn Kit',
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setMessage('Thank you! We have received your request. Our team will contact you soon.');
    } catch (e) {
      setError('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative w-full overflow-hidden rounded-full bg-[#4b3b33] px-8 py-5 text-sm font-bold uppercase tracking-[0.2em] text-[#fdf7f2] shadow-2xl transition-all hover:bg-[#3f312b] disabled:opacity-70"
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        
        <span className="relative flex items-center justify-center gap-3">
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin text-[#fdf7f2]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </>
          ) : (
            'Request Your Kit'
          )}
        </span>
      </motion.button>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100"
          >
            <p className="text-center text-xs font-medium text-emerald-700 leading-relaxed">
              {message}
            </p>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-red-50 p-4 border border-red-100"
          >
            <p className="text-center text-xs font-medium text-red-700">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}