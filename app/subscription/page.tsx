'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSupabaseBrowserClient } from '../providers';

export default function SubscriptionPage() {
  const supabase = useSupabaseBrowserClient();
  const router = useRouter();

  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleInterested = async () => {
    setMessage(null);
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      router.push('/auth?redirect=/subscription');
      return;
    }

    setStatus('working');
    try {
      const res = await fetch('/api/subscription-interest', {
        method: 'POST',
      });

      if (!res.ok) {
        setStatus('error');
        setMessage('Something went wrong. Please try again in a moment.');
        return;
      }

      setStatus('done');
      setMessage('Welcome to the inner circle! We will reach out to schedule your first stylist consultation.');
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffeef4_0,_#fdf7f2_35%,_#e1f0ff_70%,_#fdf7f2_100%)] text-[#3f2f28]">
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-20">
        
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs text-[#a27b6a] opacity-80">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>Subscription</span>
        </nav>

        {/* --- HERO SECTION WITH IMAGE --- */}
        <section className="mb-24 grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#d28b9c]">
              The Missy & Mopet Membership
            </p>
            <h1 className="text-4xl font-semibold leading-[1.1] text-[#3f2f28] sm:text-6xl">
              Couture for kids, <br />
              <span className="italic font-serif text-[#a27b6a]">delivered home.</span>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-[#6f5a4e]">
              A luxury concierge designed for the modern Indian parent. 
              From bespoke festive edits to quarterly growth refreshes—we bring the boutique to your doorstep.
            </p>
          </motion.div>

          {/* IMAGE 1: Lifestyle Hero */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl md:aspect-video lg:aspect-square"
          >
            <img 
              src="/sub/subsa.png" 
              alt="Child in soft pastel clothing"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3f2f28]/20 to-transparent" />
          </motion.div>
        </section>

        {/* --- SERVICE PILLARS --- */}
        <section className="mb-24 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div whileHover={{ y: -8 }} className="rounded-[2rem] bg-[#fff7f1]/80 p-10 border border-[#f3e5d8] backdrop-blur-md">
            <span className="inline-block mb-6 rounded-full bg-[#ffeef4] p-3 text-2xl">🗓️</span>
            <h3 className="text-xl font-bold">Planned Growth</h3>
            <p className="mt-4 text-sm leading-relaxed text-[#7e6657]">Annual or Seasonal delivery synced with growth spurts and India&apos;s changing weather.</p>
          </motion.div>

          <motion.div whileHover={{ y: -8 }} className="rounded-[2rem] bg-[#fef9ff]/80 p-10 border border-[#ecdff0] backdrop-blur-md">
            <span className="inline-block mb-6 rounded-full bg-[#f3f0ff] p-3 text-2xl">✨</span>
            <h3 className="text-xl font-bold">Festive Bespoke</h3>
            <p className="mt-4 text-sm leading-relaxed text-[#7e6657]">Hand-crafted designer outfits for Diwali, Holi, and weddings. Uniquely tailored for your child.</p>
          </motion.div>

          <motion.div whileHover={{ y: -8 }} className="rounded-[2rem] bg-[#fffcf9]/90 p-10 border border-[#f3b5c8]/30 ring-1 ring-[#f3b5c8]/20">
            <span className="inline-block mb-6 rounded-full bg-[#fff0f3] p-3 text-2xl">🏠</span>
            <h3 className="text-xl font-bold text-[#d28b9c]">At-Home Styling</h3>
            <p className="mt-4 text-sm leading-relaxed text-[#7e6657]">Our personal stylist visits for home-fittings and styling sessions. Luxury just a call away.</p>
          </motion.div>
        </section>

        {/* --- CONCIERGE CTA SECTION WITH IMAGE 2 --- */}
        <section className="relative overflow-hidden rounded-[3rem] bg-[#fff8f4] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)]">
          <div className="grid lg:grid-cols-2">
            
            {/* IMAGE 2: The Styling Experience */}
            <div className="relative h-64 lg:h-auto">
              <img 
                src="/sub/subs.png" 
                alt="Styling and fabrics"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[#f3b5c8]/10 mix-blend-multiply" />
            </div>

            <div className="p-10 md:p-16">
              <h3 className="text-3xl font-semibold text-[#3f2f28]">Ready to join the Coterie?</h3>
              <p className="mt-6 text-base leading-relaxed text-[#7e6657]">
                Experience the ease of a curated wardrobe. By clicking below, you&apos;re expressing interest in our premium subscription launch.
              </p>
              
              <ul className="mt-8 space-y-4">
                {['Seasonal Delivery Edits', 'Personal At-Home Stylist', 'Custom Designer Pieces'].map((item, i) => (
                  <li key={i} className="flex items-center text-sm font-medium text-[#6f5a4e]">
                    <span className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#f3b5c8] text-[10px] text-white">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-12">
                <button
                  type="button"
                  onClick={handleInterested}
                  disabled={status === 'working' || status === 'done'}
                  className="w-full inline-flex items-center justify-center rounded-full bg-[#f3b5c8] px-12 py-5 text-base font-bold text-[#3f1d2a] shadow-xl shadow-[#f3b5c8]/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                  {status === 'working' ? 'Processing...' : status === 'done' ? 'You’re on the list ✓' : 'Register Interest'}
                </button>
                
                {message && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`mt-6 text-center text-sm font-medium ${status === 'done' ? 'text-emerald-600' : 'text-red-500'}`}
                  >
                    {message}
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-16 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#a48777] opacity-60">
            Missy & Moppet • Luxury Kids Subscription • India
          </p>
        </footer>
      </div>
    </main>
  );
}