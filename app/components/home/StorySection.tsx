'use client';
  
import { motion } from 'framer-motion';
  
export default function StorySection() {  
  const blocks = [  
    {  
      title: 'Soft on skin',  
      text: 'Gentle fabrics and flat seams so little ones stay comfy from first crawl to last cuddle.',  
      color: 'bg-sky-50',  
    },  
    {  
      title: 'Built for play',  
      text: 'Stretchy fits and easy fastenings mean less fuss when they want to run, jump, and spin.',  
      color: 'bg-pink-50',  
    },  
    {  
      title: 'Pastel moments',  
      text: 'A palette of soft whites, blush pinks, and cloudy blues that look dreamy in every photo.',  
      color: 'bg-indigo-50',  
    },  
  ];
  
  return (  
    <section className="bg-white px-4 py-14">  
      <div className="mx-auto max-w-5xl">  
        <motion.header  
          className="mb-8 text-center"  
          initial={{ opacity: 0, y: 16 }}  
          whileInView={{ opacity: 1, y: 0 }}  
          viewport={{ once: true, amount: 0.6 }}  
          transition={{ duration: 0.4, ease: 'easeOut' }}  
        >  
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">  
            Why parents pick us  
          </p>  
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">  
            Made for play, naps, and every pastel moment.  
          </h2>  
        </motion.header>
  
        <div className="grid gap-5 md:grid-cols-3">  
          {blocks.map((b, idx) => (  
            <motion.article  
              key={b.title}  
              className={`${b.color} rounded-2xl p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]`}  
              initial={{ opacity: 0, y: 24 }}  
              whileInView={{ opacity: 1, y: 0 }}  
              viewport={{ once: true, amount: 0.4 }}  
              transition={{  
                duration: 0.45,  
                ease: 'easeOut',  
                delay: 0.1 * idx,  
              }}  
            >  
              <h3 className="mb-2 text-lg font-semibold text-slate-900">  
                {b.title}  
              </h3>  
              <p className="text-sm text-slate-600">{b.text}</p>  
            </motion.article>  
          ))}  
        </div>  
      </div>  
    </section>  
  );  
}  