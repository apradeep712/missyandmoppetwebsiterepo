'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoaderShell({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    // Extended to 6 seconds for better viewing
    const timer = setTimeout(() => setShowLoader(false), 6000);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 20);
      setMouseY((e.clientY / window.innerHeight - 0.5) * 20);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#fdfcfb] overflow-hidden"
            exit={{ opacity: 0 }}
          >
            {/* Depth layers with parallax - Fixed: removed random values causing hydration errors */}
            <div className="absolute inset-0">
              {/* Far background layer */}
              <motion.div
                className="absolute inset-0"
                style={{
                  x: mouseX * 0.5,
                  y: mouseY * 0.5,
                }}
              >
                {/* Static positioned elements to avoid hydration mismatch */}
                <motion.div
                  className="absolute rounded-full w-1 h-1 bg-[#a07d68]/20"
                  style={{ left: '10%', top: '20%' }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute rounded-full w-2 h-2 bg-[#a07d68]/15"
                  style={{ left: '80%', top: '30%' }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    delay: 0.5,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute rounded-full w-1.5 h-1.5 bg-[#a07d68]/25"
                  style={{ left: '30%', top: '70%' }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    delay: 1,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute rounded-full w-2 h-2 bg-[#a07d68]/20"
                  style={{ left: '60%', top: '50%' }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    delay: 1.5,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute rounded-full w-1 h-1 bg-[#a07d68]/30"
                  style={{ left: '90%', top: '80%' }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 2,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>

              {/* Mid layer */}
              <motion.div
                className="absolute inset-0"
                style={{
                  x: mouseX * 1,
                  y: mouseY * 1,
                }}
              >
                <svg className="w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
                  {[...Array(8)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={`${12.5 + (i % 4) * 25}%`}
                      cy={`${25 + Math.floor(i / 4) * 50}%`}
                      r="80"
                      stroke="#4b3b33"
                      strokeWidth="1"
                      fill="none"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.2,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    />
                  ))}
                </svg>
              </motion.div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
              
              {/* Logo with cinematic entrance */}
              <motion.div
                style={{
                  x: mouseX * -1.5,
                  y: mouseY * -1.5,
                  perspective: '1500px',
                }}
                className="relative"
              >
                {/* Spotlight effect */}
                <motion.div
                  className="absolute inset-0 -z-10"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  transition={{ duration: 2.5, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-radial from-[#a07d68]/10 via-transparent to-transparent blur-3xl" />
                </motion.div>

                {/* Logo container with depth */}
                <motion.div
                  initial={{ 
                    opacity: 0,
                    scale: 0.3,
                    rotateY: -90,
                    z: -500
                  }}
                  animate={{ 
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                    z: 0
                  }}
                  transition={{ 
                    duration: 2.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.5
                  }}
                  style={{ 
                    transformStyle: 'preserve-3d',
                  }}
                  className="relative w-64 h-64 md:w-80 md:h-80"
                >
                  {/* Multiple shadow layers for depth */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(75,59,51,0.05) 0%, transparent 70%)',
                        transform: `translateZ(-${(i + 1) * 20}px) scale(${1 + i * 0.1})`,
                      }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeInOut"
                      }}
                    />
                  ))}

                  <motion.div
                    animate={{
                      rotateZ: [0, 1, -1, 0],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ 
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(0px)'
                    }}
                    className="relative w-full h-full"
                  >
                    <Image 
                      src="/hero/mainlogom.png" 
                      alt="Missy & Moppet Logo"
                      fill
                      className="object-contain drop-shadow-[0_25px_50px_rgba(75,59,51,0.2)]"
                      priority
                    />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Typography with cinematic reveal */}
              <motion.div
                style={{
                  x: mouseX * -1,
                  y: mouseY * -1,
                }}
                className="mt-24 text-center relative"
              >
                
                {/* Light rays effect */}
                <div className="absolute -inset-20 overflow-hidden pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-1 h-40 bg-gradient-to-b from-transparent via-[#a07d68]/10 to-transparent origin-top"
                      style={{
                        transform: `rotate(${i * 60}deg)`,
                      }}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ 
                        opacity: [0, 0.5, 0],
                        scaleY: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2.5,
                        delay: 2.5 + i * 0.15,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>

                <motion.div className="relative flex flex-col items-center space-y-8">
                  
                  {/* Premium Childrenswear with focus effect */}
                  <div className="relative">
                    {/* Blur layers behind */}
                    {[3, 2, 1].map((blur) => (
                      <motion.span
                        key={blur}
                        initial={{ opacity: 0, filter: `blur(${blur * 3}px)` }}
                        animate={{ opacity: 0.1, filter: `blur(${blur * 3}px)` }}
                        transition={{ delay: 2.8 + blur * 0.2, duration: 1.2 }}
                        className="absolute inset-0 text-[10px] tracking-[1.2em] text-[#4b3b33] uppercase font-light pl-[1.2em]"
                        style={{ transform: `translateZ(-${blur * 10}px) scale(${1 + blur * 0.05})` }}
                      >
                        Premium Childrenswear
                      </motion.span>
                    ))}
                    
                    {/* Main text */}
                    <motion.span
                      initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      transition={{ 
                        delay: 3.2,
                        duration: 1.8,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="relative block text-[10px] tracking-[1.2em] text-[#4b3b33] uppercase font-light pl-[1.2em]"
                    >
                      Premium Childrenswear
                    </motion.span>
                  </div>
                  
                  {/* Animated ornament */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 4, duration: 1.2 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="relative w-8 h-8"
                    >
                      <svg viewBox="0 0 32 32" className="w-full h-full">
                        <motion.path
                          d="M 16 4 L 18 14 L 28 16 L 18 18 L 16 28 L 14 18 L 4 16 L 14 14 Z"
                          stroke="#a07d68"
                          strokeWidth="0.5"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 4.2, duration: 1.8 }}
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                  
                  {/* Tagline with depth */}
                  <div className="relative">
                    {/* Blur layer behind */}
                    <motion.p
                      initial={{ opacity: 0, filter: 'blur(8px)' }}
                      animate={{ opacity: 0.15, filter: 'blur(8px)' }}
                      transition={{ delay: 4.2, duration: 1.2 }}
                      className="absolute inset-0 font-serif italic text-[#a07d68] text-lg"
                      style={{ transform: 'translateZ(-20px) scale(1.1)' }}
                    >
                      Curating Childhood Elegance
                    </motion.p>
                    
                    {/* Main text */}
                    <motion.p
                      initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      transition={{ 
                        delay: 4.5,
                        duration: 1.8,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="relative font-serif italic text-[#a07d68] text-lg"
                    >
                      Curating Childhood Elegance
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Cinematic fade to black exit - smoother transition */}
            <motion.div
              className="absolute inset-0 bg-black"
              initial={{ opacity: 0 }}
              exit={{ 
                opacity: [0, 1, 0],
                transition: { 
                  duration: 2,
                  times: [0, 0.4, 1],
                  ease: "easeInOut"
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smooth fade-in for main content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showLoader ? 0 : 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}