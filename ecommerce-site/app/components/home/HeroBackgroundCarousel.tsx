'use client';
  
import { useEffect, useState } from 'react';  
import { motion, AnimatePresence } from 'framer-motion';
  
type Slide = {  
  type: 'image' | 'video';  
  src: string;  
};
  
const slides: Slide[] = [  
  { type: 'image', src: '/hero/hero-1.jpg' },  
  { type: 'image', src: '/hero/hero-2.jpg' },  
  { type: 'image', src: '/hero/hero-3.jpg' },  
];
  
const SLIDE_DURATION_MS = 4500;
  
export default function HeroBackgroundCarousel() {  
  const [index, setIndex] = useState(0);
  
  useEffect(() => {  
    if (slides.length <= 1) return;  
    const id = setInterval(  
      () => setIndex((prev) => (prev + 1) % slides.length),  
      SLIDE_DURATION_MS  
    );  
    return () => clearInterval(id);  
  }, []);
  
  const current = slides[index];
  
  return (  
    <div className="absolute inset-0">  
      <AnimatePresence mode="wait">  
        <motion.div  
          key={current.src}  
          className="absolute inset-0"  
          initial={{ opacity: 0, scale: 1.02 }}  
          animate={{ opacity: 1, scale: 1 }}  
          exit={{ opacity: 0, scale: 0.98 }}  
          transition={{ duration: 0.9, ease: 'easeInOut' }}  
        >  
          {current.type === 'image' ? (  
            // eslint-disable-next-line @next/next/no-img-element  
            <img  
              src={current.src}  
              alt=""  
              className="h-full w-full object-cover"  
            />  
          ) : (  
            <video  
              className="h-full w-full object-cover"  
              src={current.src}  
              autoPlay  
              loop  
              muted  
              playsInline  
            />  
          )}  
        </motion.div>  
      </AnimatePresence>  
    </div>  
  );  
}  