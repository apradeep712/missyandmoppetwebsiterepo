'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

/**
 * MISSY MOPPET: REIMAGINED ABOUT PAGE (PASTEL EDITION)
 */
export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // Carousel Logic
  const [currentImg, setCurrentImg] = useState(0);
  const images = [
    "/about/founder.PNG",
    "/about/founder2.jpg", 
    "/about/founder.PNG", // Adding a 3rd image as requested (placeholder)
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  // Parallax for the "Floating" feel
  const yMove = useTransform(smoothProgress, [0, 1], [0, -100]);
  const rotateVar = useTransform(smoothProgress, [0, 1], [0, 10]);

  return (
    <main ref={containerRef} className="bg-[#FAFAF5] text-[#4A4238] min-h-screen selection:bg-[#FFD1DC] selection:text-[#4A4238] overflow-hidden">
      
      {/* 0. GLOBAL GRAIN OVERLAY */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] mix-blend-multiply"></div>

      {/* =========================================
          1. HERO: EDITORIAL TYPOGRAPHY
      ========================================= */}
      <section className="relative pt-32 pb-20 px-6 min-h-[80vh] flex flex-col justify-center items-center text-center">
        
        <motion.div 
          style={{ rotate: rotateVar, y: yMove }}
          className="absolute top-20 right-[10%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#FFE4E1] blur-3xl opacity-80 -z-10" 
        />
        <motion.div 
          style={{ y: useTransform(smoothProgress, [0, 1], [0, 50]) }}
          className="absolute bottom-20 left-[10%] w-40 h-40 rounded-full bg-[#E0F7FA] blur-3xl opacity-80 -z-10" 
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl"
        >
          <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-6 text-[#9A8C7D]">
            Est. 2024 — The Studio
          </p>
          <h1 className="text-6xl md:text-9xl font-serif leading-[0.95] tracking-tight text-[#4A4238]">
            Small sizes. <br />
            <span className="italic text-[#D4C5B0]">Grand</span> stories.
          </h1>
        </motion.div>

        <motion.div 
          initial={{ clipPath: 'inset(20% 40% 20% 40% round 200px)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 relative w-full max-w-2xl aspect-[16/9] shadow-xl"
        >
          <img src="/about/aboutbanner.png" className="w-full h-full object-cover" alt="Artistic collage of kids clothing" />
          
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#E0F7FA] text-[#4A4238] rounded-full flex items-center justify-center animate-spin-slow shadow-sm">
            <svg viewBox="0 0 100 100" className="w-24 h-24 fill-current">
              <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent"/>
              <text fontSize="13">
                <textPath href="#curve">HANDMADE</textPath>
              </text>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* =========================================
          2. THE BENTO GRID STORY
      ========================================= */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">
          
          <div className="md:col-span-8 bg-white p-10 md:p-14 rounded-[2rem] shadow-sm flex flex-col justify-center border border-[#F0F0F0]">
            <h2 className="text-3xl md:text-5xl font-serif leading-tight text-[#4A4238]">
              "When I held my first baby, the world became softer. <span className="text-[#D4C5B0] italic">My standards didn't.</span>"
            </h2>
            <p className="mt-6 text-lg text-[#9A8C7D] font-medium">— Anushree Nambiar, Founder</p>
          </div>

          {/* CELL 2: VISUAL (Fixed Carousel) */}
          <div className="md:col-span-4 relative rounded-[2rem] overflow-hidden group grid items-stretch">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={currentImg}
                src={images[currentImg]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                loading="eager"
                // Using grid-area to stack images and prevent layout collapse
                className="col-start-1 row-start-1 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt="Anushree and baby" 
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-[#4A4238]/10 group-hover:bg-transparent transition-colors pointer-events-none" />
            <div className="absolute bottom-6 left-6 text-white font-bold uppercase tracking-widest text-xs pointer-events-none">The Catalyst</div>
          </div>

          <div className="md:col-span-4 bg-[#FFF0F5] p-10 rounded-[2rem] flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6 text-xl shadow-sm text-[#4A4238]">☁️</div>
              <h3 className="text-2xl font-serif mb-2 text-[#4A4238]">The Fabric Gap</h3>
              <p className="text-sm text-[#6D6359] leading-relaxed">
                Market clothes were cute but scratchy. We needed fabric that felt like a second skin.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/40 rounded-full blur-2xl" />
          </div>

          <div className="md:col-span-8 bg-[#E6F2FF] text-[#4A4238] p-10 md:p-14 rounded-[2rem] flex flex-col md:flex-row gap-10 items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex-1 space-y-6 relative z-10">
              <h3 className="text-3xl font-serif italic">Infinite Customization</h3>
              <p className="opacity-80 leading-relaxed text-[#5D534A]">
                We realized boys were left behind in the fashion game. We changed that.
                Top-notch quality, bespoke fits, and equal creative attention for every child.
              </p>
              <ul className="grid grid-cols-2 gap-4 mt-4 text-sm font-bold uppercase tracking-wider text-[#8B7D6F]">
                <li>• Bespoke Fits</li>
                <li>• Gender Neutral</li>
                <li>• Pure Cotton</li>
                <li>• No Nasties</li>
              </ul>
            </div>
            <div className="w-full md:w-48 aspect-square bg-white rounded-xl rotate-3 hover:rotate-0 transition-transform duration-300 p-2 shadow-sm">
              <img src="/hero/hero-1.jpg" className="w-full h-full object-cover rounded-lg opacity-90" alt="Sketch" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          3. PHILOSOPHY & MOTHERHOOD
      ========================================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#9A8C7D]">Our Philosophy</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 text-[#4A4238]">
            Designed by a Mother, <br />
            <span className="italic text-[#D4C5B0]">Approved by Toddlers.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div whileHover={{ y: -10 }} className="bg-[#F0F8FF] p-8 rounded-t-[10rem] rounded-b-[2rem] text-center px-6 pt-20">
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-2xl shadow-sm mb-6">🌿</div>
            <h3 className="text-2xl font-serif mb-4 text-[#4A4238]">Breathable Luxury</h3>
            <p className="text-[#6D6359] leading-relaxed text-sm">
              We strictly use natural fibers. No synthetics that trap heat. Just pure, breathable cottons and linens.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} className="bg-[#FFF0F5] p-8 rounded-[2rem] text-center flex flex-col justify-center order-first md:order-none border border-pink-100">
            <h3 className="text-3xl font-serif mb-6 text-[#4A4238] italic">"The days are long, but the years are short."</h3>
            <p className="text-[#6D6359] leading-relaxed mb-6">
              We create pieces worthy of your photo albums, capturing moments before they outgrow them.
            </p>
            <div className="w-full h-px bg-[#D4C5B0]/50 my-4" />
            <p className="text-xs font-bold tracking-widest uppercase text-[#9A8C7D]">Heirloom Quality</p>
          </motion.div>

          <motion.div whileHover={{ y: -10 }} className="bg-white border border-[#EBEBEB] p-8 rounded-t-[10rem] rounded-b-[2rem] text-center px-6 pt-20">
             <div className="w-16 h-16 mx-auto bg-[#FAFAF5] rounded-full flex items-center justify-center text-2xl shadow-sm mb-6">✨</div>
            <h3 className="text-2xl font-serif mb-4 text-[#4A4238]">Sensory Friendly</h3>
            <p className="text-[#6D6359] leading-relaxed text-sm">
              No itchy tags. No pinching elastics. A comfortable child is a happy child.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          4. FOOTER CTA
      ========================================= */}
      <section className="py-40 px-6 text-center bg-[#E0F7FA] text-[#4A4238] rounded-t-[4rem] relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#B2EBF2] rounded-full blur-[100px] opacity-50 -z-1" />
         <div className="relative z-10">
           <h2 className="text-5xl md:text-8xl font-serif mb-12">
             Let's dress them <br />
             <span className="italic text-[#98B6C9]">Better.</span>
           </h2>
           <Link href="/shop" className="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-[#4A4238] rounded-full overflow-hidden transition-all shadow-lg hover:shadow-xl hover:scale-105">
             <span className="relative z-10 font-bold uppercase tracking-widest text-sm">Shop Collection</span>
             <span className="absolute right-4 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">→</span>
           </Link>
         </div>
      </section>
    </main>
  );
}