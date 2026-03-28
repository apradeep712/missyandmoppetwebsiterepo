'use client';

import { useState, useEffect, Suspense } from 'react';  
import { useRouter, useSearchParams } from 'next/navigation';  
import { useSupabaseBrowserClient } from '../providers';  
import { motion, AnimatePresence } from 'framer-motion';  
import Link from 'next/link';

type Mode = 'email' | 'whatsapp';

// Internal component to safely use useSearchParams
function AuthContent() {
  const supabase = useSupabaseBrowserClient();  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the 'next' destination from the URL (e.g., /about) or default to /account
  const nextPath = searchParams.get('next') || '/account';

  const [mode, setMode] = useState<Mode>('email');  
  const [email, setEmail] = useState('');  
  const [loading, setLoading] = useState(false);  
  const [message, setMessage] = useState<string | null>(null);  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {  
    const checkUser = async () => {  
      const { data } = await supabase.auth.getUser();  
      if (data.user) {  
        router.push(nextPath); // Use dynamic path here
      }  
    };  
    checkUser();
  }, [supabase, router, nextPath]);

  // --- HELPER: GET CLEAN REDIRECT URL ---
  const getRedirectUrl = () => {
    if (typeof window === 'undefined') return '';
    const siteUrl = window.location.origin;
    
    // Append the 'next' path as a query param to our callback handler
    return `${siteUrl.replace(/\/$/, '')}/auth/callback?next=${encodeURIComponent(nextPath)}`;
  };

  // --- HANDLERS ---
  const handleSendEmailLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { 
          emailRedirectTo: getRedirectUrl(),
        },
      });
      if (error) throw error;
      setMessage("Magic link sent to your inbox!");
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
        options: { 
          redirectTo: getRedirectUrl(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (error) throw error;
    } catch (err: any) {  
      setError(err.message || 'Unexpected error');  
      setLoading(false);  
    }  
  };

  return (
    <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">  
      {/* Left Side: Branding */}
      <div className="hidden flex-1 lg:block pr-16">  
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <h2 className="text-5xl font-serif font-medium text-[#4b3b33] mb-6 leading-tight">
            Every little moment <br /> 
            <span className="text-[#a07d68]">is a memory.</span>
          </h2>
          <p className="text-lg text-[#7c675b] max-w-md mb-8 leading-relaxed">
            Join our community of parents and discover a world of soft colors and quality fabrics for your little ones.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Auth Card */}  
      <div className="flex w-full justify-center lg:flex-1 lg:justify-end">  
        <motion.div className="w-full max-w-md rounded-[2.5rem] border border-white/60 bg-white/70 backdrop-blur-xl p-8 shadow-[0_32px_64px_-16px_rgba(148,116,96,0.2)]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>  
          <div className="mb-10 text-center lg:text-left">  
            <Link href="/" className="inline-flex items-center gap-3">  
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#fbc2eb] to-[#a6c1ee] rotate-12" />  
              <div className="text-left">  
                <div className="text-lg font-bold tracking-tight">Missy & Moppet</div>  
                <div className="text-[11px] font-medium text-[#a07d68] uppercase tracking-wider">The Pastel World</div>  
              </div>  
            </Link>  
          </div>

          <div className="mb-8 flex p-1.5 rounded-2xl bg-[#f4e3d7]/50 border border-[#ead8cd]/30">
            <button onClick={() => setMode('email')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${mode === 'email' ? 'bg-white shadow-sm text-[#4b3b33]' : 'text-[#a07d68]'}`}>Email</button>
            <button onClick={() => setMode('whatsapp')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${mode === 'whatsapp' ? 'bg-white shadow-sm text-[#4b3b33]' : 'text-[#a07d68]'}`}>WhatsApp</button>
          </div>

          <AnimatePresence mode="wait">  
            {mode === 'email' ? (  
              <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>  
                <h1 className="text-2xl font-serif font-bold mb-2">Welcome Back</h1>  
                <p className="text-sm text-[#7c675b] mb-8">Fast, secure login via Magic Link or Google.</p>

                <button onClick={handleGoogleSignIn} disabled={loading} className="group mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#ead8cd] bg-white px-4 py-3.5 text-sm font-bold text-[#4b3b33] transition-all hover:bg-[#fdf7f2]">  
                  <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#ead8cd]"></span></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-[#a07d68]">Or Email</span></div>
                </div>

                <form onSubmit={handleSendEmailLink} className="space-y-4">  
                  <input type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-[#ead8cd] bg-white px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-[#f4e3d7]" />  
                  <button type="submit" disabled={loading} className="w-full rounded-2xl bg-[#4b3b33] py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98]">  
                    {loading ? 'Sending...' : 'Send Magic Link'}  
                  </button>  
                </form>
              </motion.div>  
            ) : (
              <motion.div key="whatsapp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-4">
                 <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f4e3d7]/30 text-[#a07d68] text-2xl mb-4">
                   <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                 </div>
                 <h2 className="text-xl font-bold mb-2">WhatsApp Login</h2>
                 <p className="text-sm text-[#7c675b] mb-8 px-4 font-medium italic">We're preparing the nursery. <br/> Coming Soon!</p>
                 <button disabled className="w-full rounded-2xl bg-[#ead8cd] py-4 text-sm font-bold text-white cursor-not-allowed">
                   Notify Me on Launch
                 </button>
              </motion.div>
            )}  
          </AnimatePresence>

          <div className="mt-6 min-h-[40px] text-center">
            {error && <p className="text-xs text-red-500 font-medium animate-shake">⚠️ {error}</p>}
            {message && <p className="text-xs text-emerald-600 font-bold">✓ {message}</p>}
          </div>
        </motion.div>  
      </div>  
    </div>
  );
}

export default function AuthPage() { 
  return (  
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33] overflow-hidden font-sans">   
      <div className="fixed inset-0 pointer-events-none">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-pink-100/50 blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-sky-100/50 blur-[120px]" />
      </div>

      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-[#a07d68]">Warming up...</div>}>
        <AuthContent />
      </Suspense>
    </main>  
  );  
}