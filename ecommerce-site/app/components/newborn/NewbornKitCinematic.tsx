"use client";

import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useMemo } from "react";

const WORDS = [
  { text: "WARMTH", color: "#fdf2f2" },
  { text: "WONDER", color: "#f0f7ff" },
  { text: "LOVE", color: "#f2faf5" },
] as const;

export default function NewbornKitCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. High-Performance Scroll Handling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the progress for the bar to feel more organic
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate active word without triggering state on every pixel
  scrollYProgress.on("change", (latest) => {
    const segment = 1 / WORDS.length;
    const index = Math.min(Math.floor(latest * WORDS.length), WORDS.length - 1);
    if (index !== activeIndex) setActiveIndex(index);
  });

  return (
    <div className="relative bg-[#faf9f6] selection:bg-neutral-200">
      {/* Dynamic Background Overlay */}
      <motion.div 
        className="fixed inset-0 pointer-events-none transition-colors duration-1000 ease-in-out -z-10"
        style={{ backgroundColor: WORDS[activeIndex].color }}
      />

      {/* Modern Minimal Navigation */}
      <nav className="fixed top-0 w-full z-50 mix-blend-difference">
        <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center text-white">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Missy & Moppet</span>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-medium">
            <a href="#collection" className="hover:opacity-50 transition-opacity">Collection</a>
            <a href="#about" className="hover:opacity-50 transition-opacity">Philosophy</a>
          </div>
        </div>
      </nav>

      {/* HERO SCROLL SECTION */}
      <section ref={containerRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          
          {/* Subtle Decorative Background Element */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-white/30 blur-[120px]" 
          />

          <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-8">
              <header className="space-y-4">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="block text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-semibold"
                >
                  The Newborn Kit
                </motion.span>
                
                <div className="relative h-[1.2em] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.h1
                      key={activeIndex}
                      initial={{ y: 60, opacity: 0, rotateX: -45 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      exit={{ y: -60, opacity: 0, rotateX: 45 }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="text-[12vw] lg:text-[9rem] font-light leading-none tracking-tighter text-neutral-900"
                    >
                      {WORDS[activeIndex].text}
                    </motion.h1>
                  </AnimatePresence>
                </div>
              </header>

              <motion.p className="mt-12 max-w-md text-lg text-neutral-600 leading-relaxed font-light">
                Moments that define a lifetime. Our kit is a curation of softness, designed to cradle your little one in the purest cotton.
              </motion.p>

              {/* Enhanced Progress Indicator */}
              <div className="mt-16 flex items-center gap-6">
                <div className="h-[1px] w-48 bg-neutral-200 relative overflow-hidden">
                  <motion.div 
                    style={{ scaleX: smoothProgress, transformOrigin: "left" }}
                    className="absolute inset-0 bg-neutral-900" 
                  />
                </div>
                <span className="font-mono text-[10px] text-neutral-400">
                  0{activeIndex + 1} / 0{WORDS.length}
                </span>
              </div>
            </div>

            {/* Floating Product Card */}
            <motion.div 
              className="hidden lg:block lg:col-span-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="backdrop-blur-xl bg-white/40 border border-white/20 p-8 rounded-[2rem] shadow-2xl shadow-neutral-200/50">
                <div className="aspect-[4/5] bg-neutral-100 rounded-2xl mb-6 overflow-hidden">
                   {/* Placeholder for high-end product photography */}
                   <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale-[20%] opacity-80" />
                </div>
                <h4 className="text-sm font-medium text-neutral-800">Organic Cotton Onesie</h4>
                <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">Natural Dye — $48</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTENT SECTIONS */}
      <ChapterSection 
        number="01"
        title="Pure Origin"
        description="Crafted from 100% GOTS certified organic cotton, harvested by hand to ensure the fibers remain long and incredibly soft."
        image="https://images.unsplash.com/photo-1544126592-807daa2b565b?auto=format&fit=crop&q=80"
      />
      
      <ChapterSection 
        number="02"
        title="Human Touch"
        description="Every seam is flat-locked to prevent irritation. No tags, no harsh dyes, just the gentle embrace of nature."
        image="https://images.unsplash.com/photo-1515488487122-458537db1b27?auto=format&fit=crop&q=80"
        reverse
      />
    </div>
  );
}

function ChapterSection({ number, title, description, image, reverse = false }: any) {
  return (
    <section className="py-32 px-6">
      <div className={`max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className={reverse ? "md:order-2" : ""}
        >
          <span className="font-mono text-xs text-neutral-400 mb-4 block tracking-widest">{number} — PHILOSOPHY</span>
          <h2 className="text-5xl font-light tracking-tight text-neutral-900 mb-6">{title}</h2>
          <p className="text-lg text-neutral-600 leading-relaxed font-light">{description}</p>
          <button className="mt-10 px-8 py-4 bg-neutral-900 text-white rounded-full text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors">
            Discover the kit
          </button>
        </motion.div>
        
        <motion.div 
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className={`aspect-[4/5] rounded-[3rem] overflow-hidden bg-neutral-100 ${reverse ? "md:order-1" : ""}`}
        >
          <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
        </motion.div>
      </div>
    </section>
  );
}