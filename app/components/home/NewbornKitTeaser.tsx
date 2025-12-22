'use client';
  
import Link from 'next/link';  
import { motion } from 'framer-motion';
  
export default function NewbornKitTeaser() {  
  return (  
    <section className="relative flex min-h-[90vh] items-center bg-white px-4 py-14">  
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">  
        <motion.div  
          className="flex-1 space-y-3"  
          initial={{ opacity: 0, y: 24 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          viewport={{ once: true, amount: 0.5 }}  
          transition={{ duration: 0.45, ease: 'easeOut' }}  
        >  
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-400">  
            Newborn special  
          </p>  
          <h2 className="text-3xl font-semibold text-amber-900 sm:text-4xl">  
            The Newborn Welcome Kit.  
          </h2>  
          <p className="mt-2 max-w-md text-sm text-stone-700 sm:text-base">  
            A curated set of ultra-soft, pre‑cleaned essentials for the first  
            days at home — outfits, snuggly layers, and pastel details made just  
            for your baby.  
          </p>  
          <ul className="mt-3 flex flex-wrap gap-2 text-xs text-stone-600">  
            <li className="rounded-full bg-rose-50 px-3 py-1">0–3 months</li>  
            <li className="rounded-full bg-sky-50 px-3 py-1">  
              Pre‑washed &amp; sterilised  
            </li>  
            <li className="rounded-full bg-emerald-50 px-3 py-1">  
              Customised on request  
            </li>  
          </ul>
  
          <div className="mt-5 flex flex-wrap gap-3">  
            <Link  
              href="/newborn-kit"  
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-slate-50 hover:bg-slate-800"  
            >  
              Explore newborn kit  
            </Link>  
           
          </div>  
        </motion.div>
  
        <motion.div  
          className="flex-1"  
          initial={{ opacity: 0, y: 24 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          viewport={{ once: true, amount: 0.5 }}  
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}  
        >  
          <motion.div  
            className="relative mx-auto h-[320px] w-full max-w-md overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-100 to-pink-50 shadow-[0_26px_70px_rgba(15,23,42,0.4)]"  
            whileHover={{ scale: 1.02 }}  
            transition={{ duration: 0.25 }}  
          >  
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-pink-200/70 blur-3xl" />  
            <div className="absolute -right-8 bottom-0 h-28 w-28 rounded-full bg-rose-200/70 blur-3xl" />
  
            <div className="relative z-10 flex h-full items-center justify-center px-6 text-center text-sm text-rose-700">  
              <div className="absolute inset-0">  
        {/* eslint-disable-next-line @next/next/no-img-element */}  
        <img  
          src="/hero/hero-3.jpg" // put your real image path here  
          alt="Customize Missy & Mopet outfit"  
          className="h-full w-full object-cover"  
        />  
      </div>
            </div>  
          </motion.div>  
        </motion.div>  
      </div>  
    </section>  
  );  
}  