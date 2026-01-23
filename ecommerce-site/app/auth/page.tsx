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

  // Use the env variable for the redirect
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  const redirectUrl = `${siteUrl}/auth/callback`;

  try {
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl },
    });
    setMessage("Magic link sent!");
  } catch (err: any) {
    setError(err.message);
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
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) setError(error.message);  
    } catch (err: any) {  
      setError(err.message || 'Unexpected error');  
      setLoading(false);  
    }  
  };

  return (  
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33] overflow-hidden font-sans">  
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-pink-100/50 blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-sky-100/50 blur-[120px]" 
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">  
        {/* Left side: Content */}
        <div className="hidden flex-1 lg:block pr-16">  
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-serif font-medium text-[#4b3b33] mb-6 leading-tight">
              Every little moment <br /> 
              <span className="text-[#a07d68]">is a memory.</span>
            </h2>
            <p className="text-lg text-[#7c675b] max-w-md mb-8 leading-relaxed">
              Join our community of parents and discover a world of soft colors and quality fabrics for your little ones.
            </p>
            <div className="flex gap-4">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-[#ead8cd]" />
                  ))}
               </div>
               <p className="text-sm self-center text-[#a07d68] font-medium">Joined by 2000+ parents</p>
            </div>
          </motion.div>
        </div>

        {/* Right side: Auth Card */}  
        <div className="flex w-full justify-center lg:flex-1 lg:justify-end">  
          <motion.div  
            className="w-full max-w-md rounded-[2.5rem] border border-white/60 bg-white/70 backdrop-blur-xl p-8 shadow-[0_32px_64px_-16px_rgba(148,116,96,0.2)]"  
            initial={{ opacity: 0, y: 40 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.6, type: "spring", damping: 20 }}
          >  
            {/* Brand Header */}  
            <div className="mb-10 text-center lg:text-left">  
              <Link href="/" className="inline-flex items-center gap-3">  
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#fbc2eb] to-[#a6c1ee] rotate-12" />  
                <div className="text-left">  
                  <div className="text-lg font-bold tracking-tight">Missy & Moppet</div>  
                  <div className="text-[11px] font-medium text-[#a07d68] uppercase tracking-wider">The Pastel World</div>  
                </div>  
              </Link>  
            </div>

            {/* Premium Toggle */}
            <div className="mb-8 flex p-1.5 rounded-2xl bg-[#f4e3d7]/50 border border-[#ead8cd]/30">
              <button 
                onClick={() => setMode('email')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${mode === 'email' ? 'bg-white shadow-sm text-[#4b3b33]' : 'text-[#a07d68]'}`}
              >
                Magic Link
              </button>
              <button 
                onClick={() => setMode('coming-soon')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${mode === 'coming-soon' ? 'bg-white shadow-sm text-[#4b3b33]' : 'text-[#a07d68]'}`}
              >
                Phone Login
              </button>
            </div>

            <AnimatePresence mode="wait">  
              {mode === 'email' ? (  
                <motion.div key="email" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>  
                  <h1 className="text-2xl font-serif font-bold mb-2">Welcome Back</h1>  
                  <p className="text-sm text-[#7c675b] mb-8">No passwords needed. Just your email.</p>

                  <button  
                    onClick={handleGoogleSignIn}  
                    disabled={loading}  
                    className="group mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#ead8cd] bg-white px-4 py-3.5 text-sm font-bold text-[#4b3b33] transition-all hover:bg-[#fdf7f2] hover:border-[#d9b9a0] active:scale-[0.98] disabled:opacity-50"  
                  >  
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative mb-6 flex items-center">
                    <div className="h-px flex-1 bg-[#ead8cd]/50" />
                    <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-[#a07d68]">Or Email link</span>
                    <div className="h-px flex-1 bg-[#ead8cd]/50" />
                  </div>

                  <form onSubmit={handleSendEmailLink} className="space-y-4">  
                    <div className="space-y-1.5">  
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#a07d68] ml-1">Email Address</label>  
                      <input  
                        type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}  
                        className="w-full rounded-2xl border border-[#ead8cd] bg-white px-4 py-4 text-sm text-[#4b3b33] outline-none transition-all focus:ring-2 focus:ring-[#f4e3d7] focus:border-[#d9b9a0]"  
                      />  
                    </div>  
                    <button  
                      type="submit" disabled={loading}  
                      className="w-full rounded-2xl bg-[#4b3b33] py-4 text-sm font-bold text-white shadow-lg shadow-[#4b3b33]/10 transition-all hover:bg-[#3a2e29] active:scale-[0.98] disabled:opacity-50"  
                    >  
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          Sending...
                        </div>
                      ) : 'Send Magic Link'}  
                    </button>  
                  </form>
                </motion.div>  
              ) : (
                <motion.div key="phone" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                   <div className="text-center py-8">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#fdf7f2] text-2xl mb-4">📱</div>
                      <h2 className="text-xl font-bold mb-2">Phone OTP</h2>
                      <p className="text-sm text-[#7c675b] px-6">We're fine-tuning phone logins to keep your data extra safe. Back soon!</p>
                      <button onClick={() => setMode('email')} className="mt-8 text-xs font-bold uppercase tracking-widest text-[#4b3b33] underline underline-offset-4">Return to Email</button>
                   </div>
                </motion.div>
              )}  
            </AnimatePresence>

            {/* Error/Success Feedback */}
            <div className="mt-6 min-h-[40px]">
              {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500 text-center font-medium">⚠️ {error}</motion.p>}
              {message && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-600 text-center font-bold">{message}</motion.p>}
            </div>
          </motion.div>  
        </div>  
      </div>  
    </main>  
  );  
}