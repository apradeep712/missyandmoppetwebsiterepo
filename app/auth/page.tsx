'use client';
  
import { useState, useEffect } from 'react';  
import { useRouter } from 'next/navigation';  
import { useSupabaseBrowserClient } from '../providers';  
import { motion, AnimatePresence } from 'framer-motion';  
import Link from 'next/link';
  
type Mode = 'email' | 'coming-soon';
  
export default function AuthPage() {  
  const supabase = useSupabaseBrowserClient();  
  const router = useRouter();
  
  const [mode, setMode] = useState<Mode>('email');  
  const [email, setEmail] = useState('');  
  const [loading, setLoading] = useState(false);  
  const [message, setMessage] = useState<string | null>(null);  
  const [error, setError] = useState<string | null>(null);
  
  // If already signed in, redirect to /account  
  useEffect(() => {  
    const checkUser = async () => {  
      const { data } = await supabase.auth.getUser();  
      if (data.user) {  
        router.push('/account');  
      }  
    };  
    checkUser();  
  }, [supabase, router]);
  
  const handleSendEmailLink = async (e: React.FormEvent) => {  
    e.preventDefault();  
    setLoading(true);  
    setError(null);  
    setMessage(null);
  
    try {  
      const { error } = await supabase.auth.signInWithOtp({  
        email,  
      });
  
      if (error) {  
        setError(error.message);  
      } else {  
        setMessage("We've sent a sign-in link to your email.");  
      }  
    } catch (err: any) {  
      setError(err.message || 'Unexpected error');  
    } finally {  
      setLoading(false);  
    }  
  };
  
  const handleGoogleSignIn = async () => {  
    setLoading(true);  
    setError(null);
  
    try {  
      const { error } = await supabase.auth.signInWithOAuth({  
        provider: 'google',  
      });
  
      if (error) setError(error.message);  
      // Supabase handles redirect; when we come back,  
      // the useEffect above will see a user and push('/account')  
    } catch (err: any) {  
      setError(err.message || 'Unexpected error');  
      setLoading(false);  
    }  
  };
  
  return (  
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33]">  
      {/* Subtle pastel background */}  
      <div className="pointer-events-none absolute inset-0 opacity-40">  
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_#bae6fd_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#fecaca_0,_transparent_55%)]" />  
      </div>  
      <div className="pointer-events-none absolute inset-0 bg-[#fdf7f2]/80 backdrop-blur-sm" />
  
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8">  
        {/* Left side: space for image / video later */}  
        <div className="hidden flex-1 pr-8 lg:block">  
          <motion.div  
            className="h-72 rounded-3xl bg-gradient-to-br from-pink-100 via-rose-50 to-sky-50 shadow-[0_26px_70px_rgba(148,116,96,0.30)]"  
            initial={{ opacity: 0, y: 24 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.5, ease: 'easeOut' }}  
          >  
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#7c675b]">  
              Soft hero image / video of parents and little ones logging into  
              their Missy &amp; Mopet account will go here.  
            </div>  
          </motion.div>  
        </div>
  
        {/* Right side: sign-in card */}  
        <div className="flex w-full justify-center lg:flex-1 lg:justify-end">  
          <motion.div  
            className="w-full max-w-md rounded-3xl border border-[#ead8cd] bg-white/95 p-6 shadow-[0_25px_80px_rgba(148,116,96,0.35)]"  
            initial={{ opacity: 0, y: 32, scale: 0.97 }}  
            animate={{ opacity: 1, y: 0, scale: 1 }}  
            transition={{ duration: 0.45, ease: 'easeOut' }}  
          >  
            {/* Logo + title */}  
            <div className="mb-6 flex items-center justify-between">  
              <Link href="/" className="flex items-center gap-2">  
                <span className="h-7 w-7 rounded-full bg-gradient-to-br from-pink-400 to-sky-400" />  
                <div className="leading-tight">  
                  <div className="text-sm font-semibold tracking-tight">  
                    Missy &amp; Mopet  
                  </div>  
                  <div className="text-[10px] text-[#7c675b]">  
                    Sign in to your pastel world  
                  </div>  
                </div>  
              </Link>  
            </div>
  
            {/* Tabs */}  
            <div className="mb-4 flex rounded-full bg-[#f4e3d7] p-1 text-[11px] text-[#7c675b]">  
              <button  
                type="button"  
                onClick={() => setMode('email')}  
                className={`flex-1 rounded-full px-3 py-1.5 transition ${  
                  mode === 'email'  
                    ? 'bg-white text-[#4b3b33]'  
                    : 'hover:bg-[#fdf2e9]'  
                }`}  
              >  
                Email sign in  
              </button>  
              <button  
                type="button"  
                onClick={() => setMode('coming-soon')}  
                className={`flex-1 rounded-full px-3 py-1.5 transition ${  
                  mode === 'coming-soon'  
                    ? 'bg-white text-[#4b3b33]'  
                    : 'hover:bg-[#fdf2e9]'  
                }`}  
              >  
                Phone OTP  
              </button>  
            </div>
  
            <AnimatePresence mode="wait">  
              {mode === 'email' && (  
                <motion.div  
                  key="email"  
                  initial={{ opacity: 0, x: 24 }}  
                  animate={{ opacity: 1, x: 0 }}  
                  exit={{ opacity: 0, x: -24 }}  
                  transition={{ duration: 0.35, ease: 'easeOut' }}  
                >  
                  <h1 className="mb-1 text-xl font-semibold">Sign in</h1>  
                  <p className="mb-4 text-sm text-[#7c675b]">  
                    Use a one-time link sent to your email. No password to  
                    remember.  
                  </p>
  
                  {/* Google button */}  
                  <button  
                    type="button"  
                    onClick={handleGoogleSignIn}  
                    disabled={loading}  
                    className="mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-[#4b3b33] shadow-[0_12px_32px_rgba(148,116,96,0.22)] hover:bg-[#fdf7f2] disabled:opacity-60"  
                  >  
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">  
                      <span className="text-[11px] font-bold text-slate-700">  
                        G  
                      </span>  
                    </span>  
                    <span>Continue with Google</span>  
                  </button>
  
                  <div className="mb-4 flex items-center gap-2 text-[11px] text-[#a07d68]">  
                    <div className="h-px flex-1 bg-[#ead8cd]" />  
                    <span>or use email</span>  
                    <div className="h-px flex-1 bg-[#ead8cd]" />  
                  </div>
  
                  <form onSubmit={handleSendEmailLink} className="space-y-4">  
                    <div>  
                      <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                        Email address  
                      </label>  
                      <input  
                        type="email"  
                        required  
                        placeholder="you@example.com"  
                        value={email}  
                        onChange={(e) => setEmail(e.target.value)}  
                        className="w-full rounded-lg border border-[#ead8cd] bg-[#fdf7f2] px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
                      />  
                    </div>  
                    <button  
                      type="submit"  
                      disabled={loading}  
                      className="w-full rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"  
                    >  
                      {loading ? 'Sending link...' : 'Send sign-in link'}  
                    </button>  
                  </form>
  
                  {error && (  
                    <p className="mt-4 text-xs text-red-500">  
                      Error: {error}  
                    </p>  
                  )}  
                  {message && (  
                    <p className="mt-4 text-xs text-emerald-500">  
                      {message}  
                    </p>  
                  )}
  
                  <p className="mt-6 text-[11px] text-[#a07d68]">  
                    By continuing, you agree to our future{' '}  
                    <span className="underline">Terms</span> and{' '}  
                    <span className="underline">Privacy Policy</span>.  
                  </p>  
                </motion.div>  
              )}
  
              {mode === 'coming-soon' && (  
                <motion.div  
                  key="phone"  
                  initial={{ opacity: 0, x: 24 }}  
                  animate={{ opacity: 1, x: 0 }}  
                  exit={{ opacity: 0, x: -24 }}  
                  transition={{ duration: 0.35, ease: 'easeOut' }}  
                >  
                  <h1 className="mb-1 text-xl font-semibold">Phone OTP</h1>  
                  <p className="mb-4 text-sm text-[#7c675b]">  
                    Phone sign‑in is coming soon. For now, use email or Google  
                    to access your account.  
                  </p>  
                  <div className="rounded-2xl border border-[#ead8cd] bg-[#fdf7f2] px-4 py-4 text-xs text-[#7c675b]">  
                    <p className="mb-1 font-semibold text-[#4b3b33]">  
                      Why phone OTP?  
                    </p>  
                    <p>  
                      We know phone numbers matter for parents buying kidswear,  
                      so we&apos;re building a safe way to use them for quick  
                      sign‑ins and order updates.  
                    </p>  
                  </div>  
                  <button  
                    type="button"  
                    onClick={() => setMode('email')}  
                    className="mt-6 w-full rounded-full bg-[#4b3b33] px-4 py-2.5 text-sm font-medium text-[#fdf7f2] hover:bg-[#3a2e29]"  
                  >  
                    Use email sign-in instead  
                  </button>  
                </motion.div>  
              )}  
            </AnimatePresence>  
          </motion.div>  
        </div>  
      </div>  
    </main>  
  );  
}  