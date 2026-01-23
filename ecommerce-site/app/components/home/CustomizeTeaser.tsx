'use client';
  
import Link from 'next/link';  
import { motion } from 'framer-motion';
  
export default function CustomizeTeaser() {  
  return (  
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-[#000]">  
      {/* Background image */}  
      <div className="absolute inset-0">  
        {/* eslint-disable-next-line @next/next/no-img-element */}  
        <img  
          src="/hero/hero-4.jpg" // put your real image path here  
          alt="Customize Missy & Mopet outfit"  
          className="h-full w-full object-cover"  
        />  
      </div>
  
      {/* Soft overlay so text stays readable */}  
      <div className="absolute inset-0 bg-black/35" />
  
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 text-center text-white">  
        <motion.p  
          className="text-xs font-medium uppercase tracking-[0.25em] text-pink-200"  
          initial={{ opacity: 0, y: 16 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          viewport={{ once: true, amount: 0.5 }}  
          transition={{ duration: 0.4, ease: 'easeOut' }}  
        >  
          Customize  
        </motion.p>
  
        <motion.h2  
          className="text-2xl font-semibold sm:text-3xl md:text-4xl"  
          initial={{ opacity: 0, y: 24 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          viewport={{ once: true, amount: 0.5 }}  
          transition={{ duration: 0.5, ease: 'easeOut' }}  
        >  
          Have a pastel story in mind?  
        </motion.h2>
  
        <motion.p  
          className="max-w-md text-sm text-white/85 sm:text-base"  
          initial={{ opacity: 0, y: 24 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          viewport={{ once: true, amount: 0.5 }}  
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}  
        >  
          Turn your idea into a custom outfit or newborn set, made softly and  
          slowly just for your little one.  
        </motion.p>
  
        <motion.div  
          className="mt-4"  
          initial={{ opacity: 0, y: 24 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          viewport={{ once: true, amount: 0.5 }}  
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}  
        >  
          <Link  
            href="/customize"  
            className="inline-flex items-center rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-[#4b3b33] shadow-[0_18px_45px_rgba(0,0,0,0.35)] hover:bg-[#fdf7f2]"  
          >  
            Customize an outfit  
          </Link>  
        </motion.div>  
      </div>  
    </section>  
  );  
}  