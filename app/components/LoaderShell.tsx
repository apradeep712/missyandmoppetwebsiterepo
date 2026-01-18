'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoaderShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoader, setShowLoader] = useState(true);
  const [particles, setParticles] = useState<{ x: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // 1. Generate random values ONLY on the client to avoid hydration error
    const generatedParticles = [...Array(6)].map(() => ({
      x: Math.random() * 100 - 50 + "%",
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
    setParticles(generatedParticles);

    // 2. Set the 5-second timer
    const timer = setTimeout(() => setShowLoader(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-white"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.1,
              filter: "blur(40px)",
              transition: { duration: 1.5, ease: [0.7, 0, 0.3, 1] } 
            }}
          >
            {/* EXTRAVAGANT MESH GRADIENT */}
            <div className="absolute inset-0 z-0">
              <motion.div 
                className="absolute inset-0 opacity-40"
                animate={{ 
                  background: [
                    "radial-gradient(circle at 20% 20%, #ffeef4 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 80%, #e0f2fe 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 80%, #ffeef4 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 20%, #e0f2fe 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 20%, #ffeef4 0%, transparent 50%)",
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {/* LOGO SECTION */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                transition={{ duration: 4, times: [0, 0.5, 1], ease: "easeInOut" }}
                className="relative"
              >
                <div className="relative group">
  {/* 1. AMBIENT GLOW: Soft pulsing light that breaks the square boundary */}
  <motion.div
    className="absolute -inset-8 rounded-full bg-gradient-to-r from-blue-50 via-pink-50 to-sky-50 opacity-60 blur-3xl"
    animate={{
      scale: [1, 1.2, 1],
      rotate: [0, 90, 180, 270, 360],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    }}
  />

  {/* 2. THE IMAGE CONTAINER: Using mask-mode to hide the square corners */}
  <div className="relative h-48 w-48 md:h-72 md:w-72 flex items-center justify-center">
    
    {/* SVG Mask to create a soft, high-end "Organic" shape */}
    <div className="relative w-full h-full overflow-hidden [mask-image:radial-gradient(circle,white_60%,transparent_100%)]">
      
      <img 
        src="/hero/logoai.png" 
        alt="Logo" 
        className="h-full w-full object-contain transform group-hover:scale-110 transition-transform duration-700 ease-out" 
      />

      {/* 3. REFLECTIVE SWEEP: High-end "Glass" shine */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"
        initial={{ x: '-100%', skewX: -20 }}
        animate={{ x: '200%' }}
        transition={{ 
          delay: 2.5, 
          duration: 1.8, 
          repeat: Infinity, 
          repeatDelay: 4,
          ease: "easeInOut" 
        }}
      />
    </div>

    {/* 4. FLOATING BORDER: A thin, elegant ring around the logo */}
    <div className="absolute inset-0 rounded-full border border-[#fdf2f8]/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.8)] pointer-events-none" />
  </div>
</div>
              </motion.div>

              {/* TEXT SECTION */}
              <div className="mt-16 overflow-hidden text-center">
                <motion.h1 
                  className="text-[12px] font-bold tracking-[1em] text-[#4b3b33] uppercase"
                  initial={{ letterSpacing: "0.2em", opacity: 0 }}
                  animate={{ letterSpacing: "1em", opacity: 1 }}
                  transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
                >
                  Missy & Moppet
                </motion.h1>
                <motion.p className="mt-4 font-serif italic text-lg text-[#a07d68]">
                  Curating Childhood Elegance
                </motion.p>
              </div>

              {/* PROGRESS BAR */}
              <div className="absolute bottom-[-120px] w-48">
                <div className="h-[1px] w-full bg-[#ead8cd]/30 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-200 via-pink-200 to-sky-200"
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                </div>
              </div>
            </div>

            {/* FLOATING PARTICLES - Map from state, not from new Array */}
            {particles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-white shadow-lg"
                initial={{ x: p.x, y: "110%", opacity: 0 }}
                animate={{ y: "-10%", opacity: [0, 1, 0] }}
                transition={{ 
                  duration: p.duration, 
                  repeat: Infinity, 
                  delay: p.delay 
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ 
          opacity: showLoader ? 0 : 1,
          scale: showLoader ? 0.98 : 1,
          y: showLoader ? 20 : 0
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}