'use client';
  
import Link from 'next/link';  
import { motion } from 'framer-motion';  
import HeroCarousel from './HeroCarousel';
  
export default function HeroSection() {  
  return (  
    <section className="relative overflow-hidden bg-[#fdf7f2]">  
      {/* Background area – replace with real image/video later if you want */}  
      <div className="absolute inset-0">  
        <div className="h-full w-full bg-gradient-to-br from-pink-100 via-sky-50 to-[#fdf7f2]" />  
      </div>
  
      {/* Soft veil */}  
      <div className="absolute inset-0 bg-[#fdf7f2]/70 backdrop-blur-sm" />
  
      <div className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col items-center gap-10 px-4 py-14 lg:flex-row lg:items-center">  
        {/* Left: big wordmark / copy */}  
        <motion.div  
          className="flex-1 space-y-7 text-center lg:text-left"  
          initial={{ opacity: 0, y: 40 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.7, ease: 'easeOut' }}  
        >  
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-pink-400">  
            New • Play-ready pastel collection  
          </p>
  
          <div className="space-y-2">  
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-[#4b3b33] sm:text-6xl lg:text-7xl">  
              Missy &amp; Mopet  
            </h1>  
            <p className="text-balance text-lg font-medium text-[#6b594f] sm:text-xl">  
              Soft, pastel outfits for little explorers.  
            </p>  
          </div>
  
          <p className="mx-auto max-w-xl text-sm text-[#7c675b] sm:text-base">  
            Everyday clothes that feel like a hug – gentle on skin, easy to  
            tumble in, and pretty enough for every photo.  
          </p>
  
          {/* Single big CTA */}  
          <div className="mt-4 flex justify-center lg:justify-start">  
            <motion.div  
              whileHover={{  
                scale: 1.03,  
                boxShadow: '0 20px 60px rgba(75,59,51,0.35)',  
              }}  
              whileTap={{ scale: 0.97 }}  
              className="inline-flex rounded-full bg-[#4b3b33] px-10 py-3.5 text-base font-semibold text-[#fdf7f2]"  
            >  
              <Link href="/shop">Shop collection</Link>  
            </motion.div>  
          </div>
  
          {/* Micro trust row */}  
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-[#7c675b] lg:justify-start">  
            <span>Ultra-soft cotton</span>  
            <span>•</span>  
            <span>Pastel colour stories</span>  
            <span>•</span>  
            <span>Made for messy play</span>  
          </div>  
        </motion.div>
  
        {/* Right: hero visual with carousel inside */}  
        <motion.div  
          className="flex-1"  
          initial={{ opacity: 0, y: 40 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}  
        >  
          <motion.div  
            className="relative mx-auto h-[320px] w-[260px] max-w-full sm:h-[380px] sm:w-[300px] lg:h-[420px] lg:w-[320px]"  
            initial={{ rotate: 4, y: 20 }}  
            animate={{ rotate: 0, y: 0 }}  
            transition={{ duration: 0.7, ease: 'easeOut' }}  
          >  
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-pink-200/70 blur-3xl" />  
            <div className="absolute -right-6 bottom-0 h-32 w-32 rounded-full bg-sky-200/70 blur-3xl" />
  
            <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-pink-100 shadow-[0_26px_70px_rgba(75,59,51,0.55)]">  
              <HeroCarousel />  
            </div>  
          </motion.div>  
        </motion.div>  
      </div>  
    </section>  
  );  
}  