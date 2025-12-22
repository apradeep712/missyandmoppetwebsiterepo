'use client';
  
import { useState } from 'react';  
import Link from 'next/link';  
import { useRouter } from 'next/navigation';  
import { motion } from 'framer-motion';  
import { useSupabaseBrowserClient } from '../providers';
  
export default function SubscriptionPage() {  
  const supabase = useSupabaseBrowserClient();  
  const router = useRouter();
  
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>(  
    'idle'  
  );  
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
        const body = await res.json().catch(() => ({}));  
        console.error('Subscription interest error:', body);  
        setStatus('error');  
        setMessage('Something went wrong. Please try again in a moment.');  
        return;  
      }
  
      setStatus('done');  
      setMessage(  
        'Thanks for your interest! We will reach out with subscription details.'  
      );  
    } catch (err) {  
      console.error(err);  
      setStatus('error');  
      setMessage('Network error. Please try again.');  
    }  
  };
  
  return (  
    <main  
      className="  
        min-h-screen  
        bg-[radial-gradient(circle_at_top,_#ffeef4_0,_#fdf7f2_35%,_#e1f0ff_70%,_#fdf7f2_100%)]  
        text-[#3f2f28]  
      "  
    >  
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-20">  
        {/* breadcrumb */}  
        <div className="mb-6 text-xs text-[#a27b6a]">  
          <Link href="/" className="hover:underline">  
            Home  
          </Link>  
          <span className="mx-1">/</span>  
          <span>Subscription</span>  
        </div>
  
        {/* BIG HERO COPY */}  
        <section className="mb-16">  
          <motion.p  
            className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#d28b9c]"  
            initial={{ opacity: 0, y: 16 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.4, ease: 'easeOut' }}  
          >  
            Subscription  
          </motion.p>
  
          <motion.h1  
            className="text-4xl font-semibold leading-tight text-[#3f2f28] sm:text-5xl md:text-[3.8rem] md:leading-[1.05]"  
            initial={{ opacity: 0, y: 18 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.5, ease: 'easeOut' }}  
          >  
            Soft pastel pieces  
            <span className="block">on a gentle schedule.</span>  
          </motion.h1>
  
          <motion.p  
            className="mt-6 max-w-2xl text-sm leading-relaxed text-[#6f5a4e] sm:text-base"  
            initial={{ opacity: 0, y: 18 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}  
          >  
            Our upcoming subscription will let you receive curated Missy &amp; Mopet  
            outfits for your child&apos;s age—without having to think about every tiny  
            growth spurt.  
          </motion.p>  
        </section>
  
        {/* BIG CARDS */}  
        <section className="grid gap-8 md:grid-cols-3">  
          {/* Age-based boxes */}  
          <motion.article  
            className="group flex flex-col justify-between rounded-3xl bg-[#fff7f1]/90 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"  
            initial={{ opacity: 0, y: 18 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.45, ease: 'easeOut' }}  
          >  
            <div>  
              <h2 className="text-lg font-semibold text-[#3f2f28] sm:text-xl">  
                Age-based boxes  
              </h2>  
              <p className="mt-3 text-sm leading-relaxed text-[#7e6657]">  
                Choose Newborn, Toddler or Big kid and we&apos;ll build boxes around soft,  
                comfy fits for that stage.  
              </p>  
            </div>  
            <div className="mt-6">  
              
            </div>  
          </motion.article>
  
          {/* Gentle cadence */}  
          <motion.article  
            className="group flex flex-col justify-between rounded-3xl bg-[#fef9ff]/90 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"  
            initial={{ opacity: 0, y: 18 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.03 }}  
          >  
            <div>  
              <h2 className="text-lg font-semibold text-[#3f2f28] sm:text-xl">  
                Gentle cadence  
              </h2>  
              <p className="mt-3 text-sm leading-relaxed text-[#7e6657]">  
                You pick the rhythm—e.g. every 2 months—so wardrobes refresh without piles  
                of unused clothes.  
              </p>  
            </div>  
            <div className="mt-6">  
             
            </div>  
          </motion.article>
  
          {/* Gift-ready */}  
          <motion.article  
            className="group flex flex-col justify-between rounded-3xl bg-[#fdf7ff]/90 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"  
            initial={{ opacity: 0, y: 18 }}  
            animate={{ opacity: 1, y: 0 }}  
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.06 }}  
          >  
            <div>  
              <h2 className="text-lg font-semibold text-[#3f2f28] sm:text-xl">  
                Gift-ready  
              </h2>  
              <p className="mt-3 text-sm leading-relaxed text-[#7e6657]">  
                Optional gift wrapping, cards and special notes so boxes can go directly  
                to loved ones.  
              </p>  
            </div>  
            <div className="mt-6">  
             
            </div>  
          </motion.article>  
        </section>
  
        {/* I'M INTERESTED BLOCK */}  
        <section className="mt-16 max-w-3xl rounded-3xl bg-[#fff8f4]/95 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl mx-auto">  
          <h3 className="text-base font-semibold text-[#3f2f28] sm:text-lg text-center">  
            I&apos;m interested  
          </h3>  
          <p className="mt-3 text-sm leading-relaxed text-[#7e6657] text-center">  
            If you&apos;re signed in, we&apos;ll save your interest with your profile and  
            reach out when it launches.  
          </p>
  
          <div className="mt-7 flex flex-col items-center gap-3">  
            <button  
              type="button"  
              onClick={handleInterested}  
              disabled={status === 'working' || status === 'done'}  
              className="  
                inline-flex items-center justify-center  
                rounded-full  
                bg-[#f3b5c8]  
                px-10 py-3.5  
                text-sm sm:text-base  
                font-semibold  
                text-[#3f1d2a]  
                shadow-lg shadow-[#f3b5c8]/70  
                disabled:opacity-65  
              "  
            >  
              {status === 'working'  
                ? 'Sending your interest...'  
                : status === 'done'  
                ? 'You are on the list ✓'  
                : "I'm interested"}  
            </button>
  
            <p className="text-[11px] text-[#a48777] sm:text-xs text-center">  
              We&apos;ll keep this gentle—no spam, just a note when it&apos;s ready.  
            </p>  
          </div>
  
          {message && (  
            <p  
              className={`mt-4 text-xs text-center ${  
                status === 'done' ? 'text-emerald-600' : 'text-red-500'  
              }`}  
            >  
              {message}  
            </p>  
          )}  
        </section>  
      </div>  
    </main>  
  );  
}  