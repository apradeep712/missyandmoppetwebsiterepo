'use client';
  
import { useEffect, useState } from 'react';  
import { motion, AnimatePresence } from 'framer-motion';  
import { useSupabaseBrowserClient } from '@/app/providers';
  
type Flyer = {  
  id: string;  
  title: string | null;  
  image_url: string;  
  link_url: string | null;  
};
  
const SLIDE_DURATION_MS = 4500;
  
export default function HeroCarousel() {  
  const supabase = useSupabaseBrowserClient();  
  const [flyers, setFlyers] = useState<Flyer[]>([]);  
  const [index, setIndex] = useState(0);
  
  useEffect(() => {  
    const load = async () => {  
      const { data, error } = await supabase  
        .from('homepage_flyers')  
        .select('id, title, image_url, link_url')  
        .eq('is_active', true)  
        .order('sort_order', { ascending: true });
  
      if (!error && data) {  
        setFlyers(data as Flyer[]);  
      }  
    };
  
    load();  
  }, [supabase]);
  
  useEffect(() => {  
    if (flyers.length <= 1) return;  
    const id = setInterval(  
      () => setIndex((prev) => (prev + 1) % flyers.length),  
      SLIDE_DURATION_MS  
    );  
    return () => clearInterval(id);  
  }, [flyers]);
  
  if (flyers.length === 0) {  
    // Fallback: simple pastel placeholder  
    return (  
      <div className="flex h-full items-center justify-center px-5 text-center text-sm text-[#8a4b5a]">  
        Large hero image / video of kids wearing Missy &amp; Mopet  
      </div>  
    );  
  }
  
  const current = flyers[index];
  
  const content = (  
    // eslint-disable-next-line @next/next/no-img-element  
    <img  
      src={current.image_url}  
      alt={current.title || 'Missy & Mopet hero'}  
      className="h-full w-full object-cover"  
    />  
  );
  
  return (  
    <AnimatePresence mode="wait">  
      <motion.div  
        key={current.id}  
        className="h-full w-full"  
        initial={{ opacity: 0, scale: 1.02 }}  
        animate={{ opacity: 1, scale: 1 }}  
        exit={{ opacity: 0, scale: 0.98 }}  
        transition={{ duration: 0.9, ease: 'easeInOut' }}  
      >  
        {current.link_url ? (  
          <a href={current.link_url} className="block h-full w-full">  
            {content}  
          </a>  
        ) : (  
          content  
        )}  
      </motion.div>  
    </AnimatePresence>  
  );  
}  