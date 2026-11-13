'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PinGate({ children }: { children: React.ReactNode }) {
  const [pin, setPin] = useState('');
  // null = checking the existing session cookie
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  // The PIN is checked on the server, which sets an httpOnly session cookie.
  // Admin API routes (mark paid, book shipment, send email) require that cookie.
  useEffect(() => {
    fetch('/api/admin/login')
      .then((r) => r.json())
      .then((d) => setIsAuthenticated(!!d.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setError(false);
      } else {
        setError(true);
        setPin('');
      }
    } catch {
      setError(true);
    } finally {
      setChecking(false);
    }
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#fdf7f2]" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fdf7f2] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md">
          {/* Logo / Icon Area */}
          <div className="text-center mb-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white border border-[#ead8cd] shadow-sm mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-[#4b3b33] tracking-tight">Admin Dashboard</h1>
            <p className="text-[#b8927c] text-xs uppercase tracking-[0.2em] mt-1">Missy & Moppet</p>
          </div>

          {/* PIN Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] border border-[#ead8cd] p-10 shadow-xl shadow-stone-200/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-center text-[10px] font-bold uppercase tracking-widest text-[#a07d68]">
                  Enter Security PIN
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  maxLength={8}
                  className={`w-full text-center text-3xl tracking-[0.5em] rounded-2xl border-2 py-4 outline-none transition-all 
                    ${error 
                      ? 'border-red-200 bg-red-50 text-red-400 focus:border-red-300' 
                      : 'border-[#fdf7f2] bg-[#fdf7f2] text-[#4b3b33] focus:border-[#ead8cd] focus:bg-white'
                    }`}
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-center text-[10px] font-bold text-red-400 uppercase tracking-tighter">
                  Access Denied • Please try again
                </p>
              )}

              <button
                type="submit"
                disabled={checking || !pin}
                className="w-full rounded-2xl bg-[#4b3b33] py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-stone-300 transition-all hover:bg-[#3d3029] active:scale-[0.98]"
              >
                Verify & Enter
              </button>
            </form>
          </div>

          {/* Footer link */}
          <div className="text-center mt-8">
            <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-[#b8927c] hover:text-[#4b3b33] transition-colors">
              ← Return to storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}