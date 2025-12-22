'use client';
  
import { useEffect, useState } from 'react';  
import { motion, AnimatePresence } from 'framer-motion';
  
export default function LoaderShell({  
  children,  
}: {  
  children: React.ReactNode;  
}) {  
  const [showLoader, setShowLoader] = useState(true);
  
  useEffect(() => {  
    const timer = setTimeout(() => setShowLoader(false), 1500);  
    return () => clearTimeout(timer);  
  }, []);
  
  return (  
    <>  
      <AnimatePresence>  
        {showLoader && (  
          <motion.div  
            className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-pink-50"  
            initial={{ opacity: 1 }}  
            exit={{ opacity: 0 }}  
            transition={{ duration: 0.4 }}  
          >  
            <div className="flex flex-col items-center gap-4">  
              <div className="relative h-20 w-20">  
                <motion.div  
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-400 to-sky-400"  
                  initial={{ scale: 0.7, borderRadius: '999px' }}  
                  animate={{ scale: [0.85, 1, 0.85], borderRadius: ['999px', '1.5rem', '999px'] }}  
                  transition={{  
                    duration: 1.6,  
                    repeat: Infinity,  
                    ease: 'easeInOut',  
                  }}  
                />  
                <motion.div  
                  className="absolute inset-3 rounded-2xl bg-white/90"  
                  initial={{ opacity: 0, y: 6 }}  
                  animate={{ opacity: 1, y: 0 }}  
                  transition={{ delay: 0.2 }}  
                >  
                  <div className="flex h-full flex-col items-center justify-center text-[10px] font-medium text-slate-700">  
                    <span>getting</span>  
                    <span>dressed...</span>  
                  </div>  
                </motion.div>  
              </div>  
              <div className="space-y-1 text-center">  
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">  
                  Missy &amp; Mopet  
                </p>  
                <p className="text-sm text-slate-600">  
                  Loading their next pastel adventure  
                </p>  
              </div>  
            </div>  
          </motion.div>  
        )}  
      </AnimatePresence>
  
      {/* Page content underneath */}  
      <div className={showLoader ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>  
        {children}  
      </div>  
    </>  
  );  
}  