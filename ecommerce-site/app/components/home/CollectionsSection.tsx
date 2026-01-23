'use client';
  
import Link from 'next/link';  
import { motion } from 'framer-motion';
  
const collections = [  
  {  
    key: 'newborn',  
    label: 'Newborn snuggles',  
    age: '0 – 2 years',  
    color: 'from-pink-50 to-rose-100',  
    blurb: 'Wrap them in cloud-soft onesies and sets.',  
  },  
  {  
    key: 'toddler',  
    label: 'Toddler adventures',  
    age: '2 – 5 years',  
    color: 'from-sky-50 to-cyan-100',  
    blurb: 'Easy, tumble-proof fits for busy mornings.',  
  },  
  {  
    key: 'big-kid',  
    label: 'Big kid stories',  
    age: '5 – 10 years',  
    color: 'from-indigo-50 to-violet-100',  
    blurb: 'Pastel sets that keep up with every plan.',  
  },  
];
  
export default function CollectionsSection() {  
  return (  
    <section  
      id="collections"  
      className="relative flex min-h-[90vh] items-center bg-gradient-to-b from-white to-slate-50 px-4 py-14"  
    >  
      {/* wavy divider from hero */}  
      <div className="pointer-events-none absolute -top-12 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-white" />
  
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">  
        <motion.div  
          className="flex-1 space-y-3"  
          initial={{ opacity: 0, y: 24 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          viewport={{ once: true, amount: 0.5 }}  
          transition={{ duration: 0.45, ease: 'easeOut' }}  
        >  
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">  
            Collections  
          </p>  
          <h2 className="text-3xl font-semibold text-amber-900 sm:text-4xl">  
            Pick their world by age.  
          </h2>  
          <p className="mt-2 max-w-md text-sm text-stone-700 sm:text-base">  
            Whether it&apos;s first steps or school stories, there&apos;s a  
            pastel-perfect outfit waiting in their size.  
          </p>  
        </motion.div>
  
        <div className="flex-1">  
          <div className="grid gap-5 md:grid-cols-3">  
            {collections.map((col, idx) => (  
              <motion.div  
                key={col.key}  
                initial={{ opacity: 0, y: 30 }}  
                whileInView={{ opacity: 1, y: 0 }}  
                viewport={{ once: true, amount: 0.4 }}  
                transition={{  
                  duration: 0.45,  
                  ease: 'easeOut',  
                  delay: 0.08 * idx,  
                }}  
              >  
                <Link  
                  href={`/shop?collection=${col.key}`}  
                  className="group relative block h-full overflow-hidden rounded-3xl bg-gradient-to-br p-5 shadow-[0_18px_45px_rgba(15,23,42,0.09)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.18)]"  
                >  
                  <div  
                    className={`absolute inset-0 bg-gradient-to-br ${col.color} opacity-90`}  
                  />  
                  <div className="relative z-10 flex h-full flex-col justify-between">  
                    <div>  
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500/80">  
                        {col.age}  
                      </p>  
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">  
                        {col.label}  
                      </h3>  
                      <p className="mt-2 max-w-xs text-sm text-slate-700">  
                        {col.blurb}  
                      </p>  
                    </div>  
                    <div className="mt-6 flex items-center justify-between text-xs font-medium text-slate-900">  
                      <span>Shop this collection</span>  
                      <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] text-slate-700 group-hover:bg-white">  
                        View outfits →  
                      </span>  
                    </div>  
                  </div>  
                </Link>  
              </motion.div>  
            ))}  
          </div>  
        </div>  
      </div>  
    </section>  
  );  
}  