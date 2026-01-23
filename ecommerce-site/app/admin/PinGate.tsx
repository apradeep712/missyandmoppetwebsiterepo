'use client';

import { useState, useEffect } from 'react';

export default function PinGate({ children }: { children: React.ReactNode }) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  // Pulling from env for security
  const VALID_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN;

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === VALID_PIN) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
      // Shake effect or feedback could be added here
    }
  };

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
                className="w-full rounded-2xl bg-[#4b3b33] py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-stone-300 transition-all hover:bg-[#3d3029] active:scale-[0.98]"
              >
                Verify & Enter
              </button>
            </form>
          </div>

          {/* Footer link */}
          <div className="text-center mt-8">
            <a href="/" className="text-[10px] font-bold uppercase tracking-widest text-[#b8927c] hover:text-[#4b3b33] transition-colors">
              ← Return to storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}