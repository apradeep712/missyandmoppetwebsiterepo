'use client';
  
import Link from 'next/link';  
import { motion } from 'framer-motion';
  
export default function AboutSection() {  
  return (  
    <section className="bg-white px-4 py-14">  
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-center">  
        {/* Left: founder / studio visual */}  
        <motion.div  
          className="flex-1"  
          initial={{ opacity: 0, y: 24 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          viewport={{ once: true, amount: 0.5 }}  
          transition={{ duration: 0.45, ease: 'easeOut' }}  
        >  
          <div className="h-60 rounded-3xl bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:h-72">  
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-amber-900/80">  
              Founder photo / studio image goes here  
            </div>  
          </div>  
        </motion.div>
  
        {/* Right: story */}  
        <motion.div  
          className="flex-1 space-y-4"  
          initial={{ opacity: 0, y: 24 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          viewport={{ once: true, amount: 0.5 }}  
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}  
        >  
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">  
            About Missy &amp; Mopet  
          </p>  
          <h2 className="text-2xl font-semibold text-amber-900 sm:text-3xl">  
            A kidswear brand that started with one tiny wardrobe.  
          </h2>  
          <p className="text-sm text-stone-700">  
            Missy &amp; Mopet was born when a parent couldn&apos;t find clothes  
            that were soft enough for baby skin and sweet enough for everyday  
            photos. So we started designing pieces that feel like a hug, in  
            colours that look dreamy on every child.  
          </p>  
          <p className="text-sm text-stone-700">  
            Today, every collection is still built the same way: tested on the  
            kids in our lives first, using fabrics we&apos;d put on our own  
            little ones, and made in small, thoughtful batches.  
          </p>  
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">  
            <span className="rounded-full bg-slate-100 px-3 py-1">  
              Parent-founded  
            </span>  
            <span className="rounded-full bg-slate-100 px-3 py-1">  
              Made in India  
            </span>  
            <span className="rounded-full bg-slate-100 px-3 py-1">  
              Pastel-first design  
            </span>  
          </div>  
          <div>  
            <Link  
              href="/about"  
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-slate-50 hover:bg-slate-800"  
            >  
              Read our story  
            </Link>  
          </div>  
        </motion.div>  
      </div>  
    </section>  
  );  
}  