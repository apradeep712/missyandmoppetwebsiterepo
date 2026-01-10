'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * MISSY MOPPET: REIMAGINED ABOUT PAGE
 * Style: Luxe Editorial meets Playful Bento Grid
 */
export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // Parallax for the "Floating" feel
  const yMove = useTransform(smoothProgress, [0, 1], [0, -100]);
  const rotateVar = useTransform(smoothProgress, [0, 1], [0, 10]);

  return (
    <main ref={containerRef} className="bg-[#FAFAF5] text-[#1A1A1A] min-h-screen selection:bg-[#D4C5B0] selection:text-white overflow-hidden">
      
      {/* 0. GLOBAL GRAIN OVERLAY (For that tactile paper feel) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')] mix-blend-multiply"></div>

      {/* =========================================
          1. HERO: EDITORIAL TYPOGRAPHY
      ========================================= */}
      <section className="relative pt-32 pb-20 px-6 min-h-[80vh] flex flex-col justify-center items-center text-center">
        
        {/* Floating Abstract Shape */}
        <motion.div 
          style={{ rotate: rotateVar, y: yMove }}
          className="absolute top-20 right-[10%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-[#E6DCD0] blur-3xl opacity-60 -z-10" 
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl"
        >
          <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-6 text-[#8A8A8A]">
            Est. 202X — The Studio
          </p>
          <h1 className="text-6xl md:text-9xl font-serif leading-[0.95] tracking-tight text-[#2C2C2C]">
            Small sizes. <br />
            <span className="italic text-[#BFA68F]">Grand</span> stories.
          </h1>
        </motion.div>

        {/* Hero Image - Reveals from center */}
        <motion.div 
          initial={{ clipPath: 'inset(20% 40% 20% 40% round 200px)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 relative w-full max-w-2xl aspect-[16/9] shadow-2xl"
        >
          <img src="/about/hero-collage.jpg" className="w-full h-full object-cover" alt="Artistic collage of kids clothing" />
          
          {/* A playful 'Sticker' element */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#2C2C2C] text-[#FAFAF5] rounded-full flex items-center justify-center animate-spin-slow">
            <svg viewBox="0 0 100 100" className="w-24 h-24 fill-current">
              <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent"/>
              <text fontSize="13">
                <textPath href="#curve">
                  HANDMADE • WITH • LOVE •
                </textPath>
              </text>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* =========================================
          2. THE BENTO GRID STORY (Trends: Grids + Glassmorphism)
      ========================================= */}
      <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">
          
          {/* CELL 1: THE HOOK (Large Text) */}
          <div className="md:col-span-8 bg-white p-10 md:p-14 rounded-[2rem] shadow-sm flex flex-col justify-center border border-gray-100">
            <h2 className="text-3xl md:text-5xl font-serif leading-tight text-[#2C2C2C]">
              "When I held my first baby, the world became softer. <span className="text-[#BFA68F] italic">My standards didn't.</span>"
            </h2>
            <p className="mt-6 text-lg text-gray-500 font-medium">— Anushree, Founder</p>
          </div>

          {/* CELL 2: VISUAL (Founder Photo) */}
          <div className="md:col-span-4 relative rounded-[2rem] overflow-hidden group">
            <img src="/about/founder-baby.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Anushree and baby" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-6 left-6 text-white font-bold uppercase tracking-widest text-xs">The Catalyst</div>
          </div>

          {/* CELL 3: THE FABRIC PROBLEM */}
          <div className="md:col-span-4 bg-[#EBE9E4] p-10 rounded-[2rem] flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6 text-xl shadow-sm">☁️</div>
              <h3 className="text-2xl font-serif mb-2">The Fabric Gap</h3>
              <p className="text-sm opacity-70 leading-relaxed">
                Market clothes were cute but scratchy. We needed fabric that felt like a second skin.
              </p>
            </div>
            {/* Artistic Blob Background */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/30 rounded-full blur-2xl" />
          </div>

          {/* CELL 4: CUSTOMIZATION & BOYS (The Solution) */}
          <div className="md:col-span-8 bg-[#2C2C2C] text-[#FAFAF5] p-10 md:p-14 rounded-[2rem] flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl font-serif italic">Infinite Customization</h3>
              <p className="opacity-80 leading-relaxed">
                We realized boys were left behind in the fashion game. We changed that.
                Top-notch quality, bespoke fits, and equal creative attention for every child.
              </p>
              <ul className="grid grid-cols-2 gap-4 mt-4 text-sm font-bold uppercase tracking-wider text-[#BFA68F]">
                <li>• Bespoke Fits</li>
                <li>• Gender Neutral</li>
                <li>• Pure Cotton</li>
                <li>• No Nasties</li>
              </ul>
            </div>
            <div className="w-full md:w-48 aspect-square bg-[#3D3D3D] rounded-xl rotate-3 hover:rotate-0 transition-transform duration-300 border-2 border-dashed border-[#555] p-2">
              <img src="/about/custom-sketch.jpg" className="w-full h-full object-cover rounded-lg opacity-80" alt="Sketch" />
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
          3. PROCESS SCROLL (Horizontal Vibe)
      ========================================= */}
      <section className="py-20 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
          <h2 className="text-5xl font-serif">The <span className="italic text-[#BFA68F]">Atelier</span></h2>
          <p className="hidden md:block text-xs uppercase tracking-widest text-gray-400">From Sketch to Stitch</p>
        </div>

        <div className="flex gap-8 px-6 overflow-x-auto pb-10 scrollbar-hide snap-x">
          {[
            { num: '01', title: 'Sourcing', desc: 'Hand-picking fibers that breathe.' },
            { num: '02', title: 'Designing', desc: 'Drawing prints that spark joy.' },
            { num: '03', title: 'Crafting', desc: 'Stitching with patience, not speed.' },
            { num: '04', title: 'Delivering', desc: 'Packaging love for your doorstep.' },
          ].map((step, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="min-w-[300px] md:min-w-[350px] aspect-[4/5] bg-[#FAFAF5] border border-gray-100 p-8 rounded-3xl flex flex-col justify-between snap-center"
            >
              <div className="text-6xl font-serif text-[#EBE9E4]">{step.num}</div>
              <div>
                <h4 className="text-2xl font-serif mb-2">{step.title}</h4>
                <p className="text-gray-500">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================
          4. MINIMAL TEAM SECTION
      ========================================= */}
      <section className="py-32 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] mb-20 text-[#C68E68]">The Architects of Softness</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {TEAM.map((member, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative w-full aspect-[3/4] mb-6 overflow-hidden rounded-full md:rounded-2xl">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out" 
                />
              </div>
              <h3 className="text-xl font-serif">{member.name}</h3>
              <p className="text-xs uppercase tracking-widest text-gray-400 mt-1 mb-3">{member.role}</p>
              <p className="text-sm text-gray-600 px-4">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          5. FOOTER CTA
      ========================================= */}
      <section className="py-40 px-6 text-center bg-[#2C2C2C] text-[#FAFAF5] rounded-t-[3rem] relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#363636] rounded-full blur-[100px] -z-1" />
         
         <div className="relative z-10">
           <h2 className="text-5xl md:text-8xl font-serif mb-12">
             Let's dress them <br />
             <span className="italic text-[#BFA68F]">Better.</span>
           </h2>
           
           <Link href="/shop" className="group relative inline-flex items-center gap-4 px-10 py-5 bg-[#FAFAF5] text-[#2C2C2C] rounded-full overflow-hidden transition-all hover:pr-14">
             <span className="relative z-10 font-bold uppercase tracking-widest text-sm">Shop Collection</span>
             <span className="absolute right-4 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">→</span>
           </Link>
         </div>
      </section>
    </main>
  );
}

const TEAM = [
  { 
    name: "Anushree", 
    role: "Founder", 
    bio: "Founding the brand while holding her firstborn, she ensures every thread passes the 'mom test'.", 
    image: "/team/anushree.jpg" 
  },
  { 
    name: "Saravanan", 
    role: "Operations", 
    bio: "The backbone of the brand. He ensures that 'custom' doesn't mean 'complicated' logistics.", 
    image: "/team/saravanan.jpg" 
  },
  { 
    name: "David Joyel", 
    role: "Design Lead", 
    bio: "Breaking the stereotype that boys' fashion has to be boring. Master of prints and patterns.", 
    image: "/team/david.jpg" 
  }
];