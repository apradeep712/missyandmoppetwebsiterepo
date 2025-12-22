'use client';
  
import Link from 'next/link';  
import { motion } from 'framer-motion';
  
const items = [  
  { id: 1, label: 'Social photo / reel 1' },  
  { id: 2, label: 'Social photo / reel 2' },  
  { id: 3, label: 'Social photo / reel 3' },  
  { id: 4, label: 'Social photo / reel 4' },  
  { id: 5, label: 'Social photo / reel 5' },  
];
  
export default function SocialStrip() {  
  return (  
    <section className="bg-white px-4 py-14">  
      <div className="mx-auto max-w-6xl">  
        {/* Header row */}  
        <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">  
          <div>  
            <h3 className="text-2xl font-semibold text-amber-900 sm:text-3xl">  
              Little moments, big smiles.  
            </h3>  
            <p className="mt-1 text-sm text-stone-700">  
              Peeks from real days in Missy &amp; Mopet — playdates, naps,  
              celebrations and all the in‑betweens.  
            </p>  
          </div>  
          <div className="flex flex-col items-start gap-1 text-xs text-stone-600 sm:items-end sm:text-sm">  
            <Link  
              href="https://instagram.com/missyandmopet"  
              target="_blank"  
              className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-400"  
            >  
              <span className="h-6 w-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" />  
              <span className="font-medium">@missyandmopet</span>  
            </Link>  
            <p className="text-[11px] text-stone-500 sm:text-xs">  
              Tap to see more pastel stories on Instagram.  
            </p>  
          </div>  
        </div>
  
        {/* Horizontal carousel of vertical cards */}  
        <div className="-mx-4 overflow-x-auto pb-2">  
          <div className="flex gap-4 px-4">  
            {items.map((item, idx) => (  
              <motion.div  
                key={item.id}  
                className="relative h-[260px] w-[150px] flex-shrink-0 overflow-hidden rounded-3xl bg-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.12)] sm:h-[320px] sm:w-[180px]"  
                initial={{ opacity: 0, y: 24 }}  
                whileInView={{ opacity: 1, y: 0 }}  
                viewport={{ once: true, amount: 0.4 }}  
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 * idx }}  
                whileHover={{ y: -6, rotate: -1.5 }}  
              >  
                {/* Placeholder background – replace with real image */}  
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-sky-100" />
  
                {/* Story label at bottom */}  
                <div className="absolute inset-x-0 bottom-0 p-3">  
                  <div className="rounded-2xl bg-white/85 px-3 py-2 text-[11px] text-slate-900 shadow">  
                    {item.label}  
                  </div>  
                </div>
  
                {/* IG-style ring & dot */}  
                <div className="absolute left-2 top-2 flex items-center gap-2">  
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">  
                    <div className="h-full w-full rounded-full bg-white/95" />  
                  </div>  
                  <div className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white">  
                    Story  
                  </div>  
                </div>  
              </motion.div>  
            ))}  
          </div>  
        </div>  
      </div>  
    </section>  
  );  
}  