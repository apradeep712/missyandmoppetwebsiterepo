// app/newborn-kit/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, easeOut } from 'framer-motion';
import { X } from 'lucide-react';
import NewbornKitInterestedButtonClient from '../components/NewbornKitInterestedButtonClient';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: easeOut }
};

type KitItem = {
  src: string;
  name: string;
  note: string;
  qty?: string;
};

const KIT_ITEMS: KitItem[] = [
  { src: '/newborn/kit-quilted-blanket.png', name: 'Quilted Blanket', note: 'Soft diamond-quilted cotton for the first cuddle.' },
  { src: '/newborn/kit-muslin-swaddle.png', name: 'Muslin Swaddle', note: 'Breathable, airy layers that drape gently.' },
  { src: '/newborn/kit-muslin-swaddle-roll.png', name: 'Swaddle Wrap', note: 'Rolled and ready for a snug, secure wrap.' },
  { src: '/newborn/kit-kimono-bodysuit.png', name: 'Kimono Bodysuit', note: 'Wrap-front design, no pulling over tiny heads.' },
  { src: '/newborn/kit-zip-sleepsuit.png', name: 'Zip Sleepsuit', note: 'Easy two-way zip for quick night changes.' },
  { src: '/newborn/kit-caps.png', name: 'Ribbed Caps', note: 'Keeps little heads warm in the first days.', qty: '×2' },
  { src: '/newborn/kit-mittens.png', name: 'Scratch Mittens', note: 'Gentle cuffs that protect delicate skin.', qty: '×2 pairs' },
  { src: '/newborn/kit-booties.png', name: 'Booties', note: 'Ribbed cuffs that stay on tiny feet.', qty: '×2 pairs' },
  { src: '/newborn/kit-washcloths.png', name: 'Muslin Washcloths', note: 'Printed, absorbent and soft for daily care.', qty: '×2' },
  { src: '/newborn/kit-bear-rattle.png', name: 'Crochet Bear Rattle', note: 'Hand-crocheted friend on a wooden ring.' },
];

export default function NewbornKitPage() {
  const [active, setActive] = useState<KitItem | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  return (
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33] selection:bg-[#f3d8c3]">
      {/* Top bar */}
    <header className="sticky top-0 z-50 border-b border-[#ead8cd]/50 bg-white/70 backdrop-blur-md">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    <Link href="/" className="group flex items-center gap-3">
      {/* --- LOGO START --- */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative h-12 w-12 flex items-center justify-center"
      >
        <img 
          src="/hero/logomain.png" // Replace with your actual logo path (e.g., /logo.svg or /logo.png)
          alt="Missy & Moppet Logo"
          className="h-full w-full object-contain"
        />
      </motion.div>
      {/* --- LOGO END --- */}

      <div className="leading-tight">
        <div className="text-sm font-bold tracking-[0.2em] uppercase transition-colors group-hover:text-[#a07d68]">
          Missy & Moppet
        </div>
        <div className="text-[10px] italic text-[#a07d68]">Curated for first breaths</div>
      </div>
    </Link>

    <nav className="hidden items-center gap-8 md:flex">
      {['Shop'].map((item) => (
        <Link 
          key={item} 
          href={`/${item.toLowerCase().replace(/ /g, '-')}`} 
          className="text-xs font-semibold uppercase tracking-widest hover:text-[#a07d68] transition-colors"
        >
          {item}
        </Link>
      ))}
    </nav>
  </div>
</header>

      {/* --- HERO SECTION --- */}
      <section className="relative px-6 pt-16 pb-24 overflow-hidden">
        <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div {...fadeIn}>
            <span className="inline-block rounded-full bg-[#ffeef4] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[#d28b9c] mb-6">
              The First Wardrobe
            </span>
            <h1 className="text-5xl font-serif italic leading-[1.1] sm:text-7xl">
              Moments woven with <span className="text-[#a07d68]">pure love.</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-[#7c675b]">
              We believe the very first fabric to touch your baby's skin should be as gentle as a mother's embrace.
            </p>
            
          
          </motion.div>

          {/* IMAGE 1: THE HOSPITAL KIT BOX */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[4rem] shadow-2xl">
              <Image
                src="/newborn/kit-full.png"
                alt="The complete Missy & Moppet Newborn Kit with its quilted keepsake bag"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute -bottom-5 right-6 sm:right-10 rounded-full border border-[#ead8cd] bg-white/90 px-5 py-3 shadow-lg backdrop-blur-md"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a07d68]">
                10 essentials · 1 keepsake bag
              </span>
            </motion.div>
            {/* Decorative Element */}
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#f3d8c3]/30 blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* --- SIGNATURE VIDEO SECTION --- */}
      <motion.section {...fadeIn} className="px-6 py-20">
        <div className="mx-auto max-w-7xl relative overflow-hidden rounded-[3rem] bg-[#3f2f28] shadow-2xl group">
          <div className="aspect-video w-full relative">
            
             <video 
              className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
              autoPlay muted loop playsInline
            >
              <source src="/newborn/newbornkitvideo.mp4" type="video/mp4" />
            </video>
 
              
                        
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-transparent to-[#3f2f28]/80">
              <h2 className="text-white text-3xl md:text-5xl font-serif italic mb-4">The Sterilized Hospital Kit</h2>
              <p className="text-[#fdf7f2]/80 max-w-md text-sm md:text-base tracking-wide">
                Prepared in a medical-grade environment. Ready for the first cuddle.
              </p>
              
            </div>
            
          </div>
          
        </div>
      </motion.section>
      {/* --- NEW: LARGE ADAPTIVE BUTTON STRIP --- */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-[#ead8cd] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-serif italic text-[#4b3b33]">Reserve your bundle of joy.</h3>
              <p className="text-[#7c675b] text-sm mt-2">Limited sterilized kits prepared weekly for expectant parents.</p>
            </div>
            
            {/* The Button Component - Now wrapped for massive impact */}
           <div className="w-full flex justify-center items-center py-4">
  <div className="w-full max-w-[400px] flex justify-center">
     <NewbornKitInterestedButtonClient />
  </div>
</div>
          </div>
        </div>
      </motion.section>
      

      {/* --- WHAT'S INSIDE: IMAGE 3 (Graphic) --- */}
      <section className="px-6 py-20 bg-[#f9efe7]/50">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a07d68] mb-4">Inside the Suitcase</h3>
          <h2 className="text-4xl font-semibold">Everything they need, thoughtfully packed.</h2>
        </div>
        
        {/* Item grid */}
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {KIT_ITEMS.map((item, i) => (
            <motion.button
              key={item.src}
              type="button"
              onClick={() => setActive(item)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 5) * 0.08, ease: easeOut }}
              className="group text-left rounded-[2rem] bg-white p-2.5 shadow-sm ring-1 ring-[#ead8cd]/60 transition-shadow hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a07d68]"
              aria-label={`View ${item.name}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem] bg-[#f9efe7]">
                <Image
                  src={item.src}
                  alt={item.name}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {item.qty && (
                  <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#a07d68] shadow-sm backdrop-blur">
                    {item.qty}
                  </span>
                )}
              </div>
              <div className="px-2 pt-4 pb-3">
                <h4 className="font-serif italic text-lg leading-snug text-[#4b3b33]">{item.name}</h4>
                <p className="mt-1 text-xs leading-relaxed text-[#7c675b]">{item.note}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3f2f28]/80 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={active.name}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: easeOut }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
            >
              <div className="relative aspect-[3/4] w-full max-h-[70vh]">
                <Image src={active.src} alt={active.name} fill sizes="(min-width: 640px) 512px, 100vw" className="object-cover" />
              </div>
              <div className="px-6 py-5">
                <h4 className="font-serif italic text-2xl text-[#4b3b33]">
                  {active.name}
                  {active.qty && <span className="ml-2 text-sm not-italic font-sans text-[#a07d68]">{active.qty}</span>}
                </h4>
                <p className="mt-1 text-sm text-[#7c675b]">{active.note}</p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#4b3b33] shadow-md hover:bg-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BRAND STORY: IMAGE 4 & 2 --- */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-24 items-center">
          <motion.div {...fadeIn} className="relative order-2 lg:order-1">
             <div className="grid grid-cols-2 gap-4">
                {/* IMAGE 4 */}
                <img src="/newborn/newborndetails1.jpg" className="rounded-3xl shadow-lg mt-12" alt="Soft Jablas" />
                {/* IMAGE 2 */}
                <img src="/newborn/newborndetails2.jpg" className="rounded-3xl shadow-lg" alt="Care Details" />
             </div>
          </motion.div>

          <motion.div {...fadeIn} className="order-1 lg:order-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a07d68] mb-6">Our Philosophy</h3>
            <h2 className="text-4xl font-serif italic mb-8">Soft pastels for little humans.</h2>
            <div className="space-y-6 text-lg text-[#7c675b] leading-relaxed">
              <p>Missy & Moppet began with a simple realization: newborns don't need fashion. They need comfort that feels like home.</p>
              <p>We sterilized every garment, removed every scratchy tag, and chose colors that soothe the nervous system of both baby and parent.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FINAL CONCIERGE CTA --- */}
      <motion.section {...fadeIn} className="px-6 pb-32">
        <div className="mx-auto max-w-7xl rounded-[4rem] bg-[#4b3b33] p-12 md:p-20 text-center relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 right-0 p-10 opacity-20 hidden md:block">
             <img src="/image_3adfe8.png" className="w-32 invert" alt="Product tag detail" />
          </div>
          
          <h2 className="text-white text-4xl md:text-6xl font-serif italic mb-8">Ready for the journey home?</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-12 text-lg">Whether you're packing your hospital bag or looking for the perfect gift, we are here to help you choose.</p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/shop" className="px-10 py-5 bg-[#f3d8c3] text-[#4b3b33] rounded-full font-bold uppercase tracking-widest hover:bg-white transition-all hover:scale-105 shadow-xl">
              Explore Collection
            </Link>
            
          </div>
        </div>
      </motion.section>

      <footer className="py-12 border-t border-[#ead8cd]/30 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#a07d68]">
          © {new Date().getFullYear()} Missy & Moppet • Luxury Baby Essentials
        </p>
      </footer>
    </main>
  );
}