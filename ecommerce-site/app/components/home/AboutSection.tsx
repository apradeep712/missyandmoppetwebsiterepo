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
        <div className="relative group">
    

  {/* Main Image Container */}
  <div className="relative h-60 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:h-72 transform transition-all duration-500 group-hover:-rotate-1 group-hover:scale-[1.02]">
    
    <img 
      src="/about/aboutheader.png" 
      alt="Missy & Mopet Studio" 
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
    />

    {/* Soft Overlay for a professional "Shoot" look */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
    
    {/* Subtle Label */}
    <div className="absolute bottom-4 left-6">
      <p className="text-xs font-medium text-white/90 tracking-widest uppercase">
        Behind the Scenes • 2024
      </p>
    </div>
  </div>

  {/* Decorative Background Element (The "Shadow" Frame) */}
  <div className="absolute inset-0 -z-10 translate-x-3 translate-y-3 rounded-3xl border-2 border-dashed border-rose-100"></div>
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
    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-orange-50 px-8 py-3 text-sm font-semibold text-orange-900 transition-all duration-300 ease-out hover:scale-105 hover:bg-orange-100 hover:shadow-lg active:scale-95"
  >
    {/* Decorative soft glow background */}
    <span className="absolute inset-0 z-0 bg-gradient-to-r from-pink-100/50 to-orange-100/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
    
    <span className="relative z-10 flex items-center gap-2">
      Read our story
      <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </span>
  </Link>
</div>
        </motion.div>  
      </div>  
    </section>  
  );  
}  