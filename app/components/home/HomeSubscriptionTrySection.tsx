'use client';
  
import Link from 'next/link';  
import { motion } from 'framer-motion';
  
export default function HomeSubscriptionTrySection() {  
  return (  
    <section className="bg-[#fdf7f2] px-4 py-14">  
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">  
        {/* Subscription block */}  
        <motion.div  
          className="flex-1 rounded-3xl bg-white/95 p-6 shadow-[0_22px_55px_rgba(148,116,96,0.20)] border border-[#ead8cd]"  
          initial={{ opacity: 0, y: 24 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          viewport={{ once: true, amount: 0.5 }}  
          transition={{ duration: 0.5, ease: 'easeOut' }}  
        >  
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8927c]">  
            Subscription  
          </p>  
          <h2 className="mt-2 text-2xl font-semibold text-[#4b3b33] sm:text-3xl">  
            A pastel subscription for their little seasons.  
          </h2>  
          <p className="mt-2 text-sm text-[#7c675b]">  
            Choose an age group and let us send curated outfits at a gentle  
            rhythm—ideal for growth spurts, first photos and gifting.  
          </p>
  
          <ul className="mt-4 space-y-2 text-sm text-[#7c675b]">  
            <li>• Age-based picks: Newborn, Toddler, Big kids.</li>  
            <li>• Soft, pre-cleaned outfits with matching pastels.</li>  
            <li>• Optional gift‑ready wrapping and cards.</li>  
          </ul>
  
          <div className="mt-6 flex flex-wrap gap-3 text-xs">  
            <Link  
              href="/subscription"  
              className="inline-flex items-center rounded-full bg-[#4b3b33] px-5 py-2 text-sm font-medium text-[#fdf7f2] hover:bg-[#3a2e29]"  
            >  
              View subscription details  
            </Link>  
            <p className="text-[11px] text-[#a07d68]">  
              You&apos;ll be able to subscribe based on age and number of sets  
              you want.  
            </p>  
          </div>  
        </motion.div>
  
        {/* Try-at-home block */}  
        <motion.div  
          className="flex-1 rounded-3xl bg-gradient-to-br from-pink-100 via-rose-50 to-sky-50 p-[1px] shadow-[0_22px_55px_rgba(148,116,96,0.25)]"  
          initial={{ opacity: 0, y: 24 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          viewport={{ once: true, amount: 0.5 }}  
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}  
        >  
          <div className="flex h-full flex-col justify-between rounded-[1.4rem] bg-[#fdf7f2]/95 p-5">  
            <div className="space-y-2">  
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8927c]">  
                Try at home  
              </p>  
              <h2 className="text-lg font-semibold text-[#4b3b33] sm:text-xl">  
                Feel the softness at your doorstep.  
              </h2>  
              <p className="text-sm text-[#7c675b]">  
                For selected areas, we can bring pieces home so you can feel the  
                fabric, see the pastel shades and check fits before you commit.  
              </p>  
            </div>
  
            {/* Visual placeholder for image */}  
            <div className="mt-4 flex-1 rounded-2xl bg-[#f4e3d7] flex items-center justify-center text-xs text-[#8a4b5a]">  
              {/* Replace this with a real try-at-home image when you have it */}  
              
               <img 
                src="/try/trial2.png" 
                alt="Styling and fabrics"
                className="h-full w-full object-cover"
              />
            </div>
  
            <div className="mt-4 flex justify-between items-center text-xs text-[#7c675b]">  
              <button  
                type="button"  
                className="inline-flex items-center rounded-full bg-white px-4 py-2 font-medium text-[#4b3b33] hover:bg-[#fdf2e9] border border-[#ead8cd]"  
              >  
                <Link href="/try-at-home">Try at home</Link>  
              </button>  
              <span className="text-[11px] text-[#a07d68]">  
                Softness &amp; fit checked before you buy.  
              </span>  
            </div>  
          </div>  
        </motion.div>  
      </div>  
    </section>  
  );  
}  