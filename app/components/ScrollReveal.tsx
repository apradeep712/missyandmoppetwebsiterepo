'use client';
  
import { useEffect, useRef, useState } from 'react';  
import type { ReactNode } from 'react';
  
type ScrollRevealProps = {  
  children: ReactNode;  
  delay?: number; // ms  
  once?: boolean;  
  className?: string;  
};
  
export default function ScrollReveal({  
  children,  
  delay = 0,  
  once = true,  
  className = '',  
}: ScrollRevealProps) {  
  const ref = useRef<HTMLDivElement | null>(null);  
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {  
    if (!ref.current) return;
  
    const observer = new IntersectionObserver(  
      (entries) => {  
        entries.forEach((entry) => {  
          if (entry.isIntersecting) {  
            setVisible(true);  
            if (once && ref.current) observer.unobserve(ref.current);  
          } else if (!once) {  
            setVisible(false);  
          }  
        });  
      },  
      { threshold: 0.15 }  
    );
  
    observer.observe(ref.current);
  
    return () => observer.disconnect();  
  }, [once]);
  
  return (  
    <div  
      ref={ref}  
      style={{ transitionDelay: `${delay}ms` }}  
      className={[  
        'transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]',  
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',  
        className,  
      ].join(' ')}  
    >  
      {children}  
    </div>  
  );  
}  