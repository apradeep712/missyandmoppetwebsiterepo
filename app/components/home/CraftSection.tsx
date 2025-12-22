'use client';
  
import { motion } from 'framer-motion';
  
// 8–10 craft cards; add or remove as you like  
const craftCards = [  
  {  
    key: 'fabric',  
    label: 'Fabric',  
    step: 'Step 1',  
    title: 'Cloud-soft on tiny skin.',  
    body:  
      'We start with light, breathable cotton blends in calm pastels—chosen to feel gentle on newborn skin and sturdy enough for everyday tumbles.',  
    badge: 'Baby‑safe, premium weaves',  
    footerRight: 'FABRIC',  
    image: '/hero/hero-4.jpg',  
  },  
  {  
    key: 'clean',  
    label: 'Clean & ready',  
    step: 'Step 2',  
    title: 'Fresh from first cuddle.',  
    body:  
      'Every piece is pre‑washed and checked so it arrives soft, clean and ready for that first wear—no stiffness, no scratchy seams.',  
    badge: 'Pre‑washed & skin‑kind',  
    footerRight: 'CLEAN',  
    image: '/hero/hero-2.jpg',  
  },  
  {  
    key: 'fit',  
    label: 'Comfort fit',  
    step: 'Step 3',  
    title: 'Made for wriggles and naps.',  
    body:  
      'Flat seams, comfy waistbands and easy necklines mean less fidgeting and more free movement—from crib naps to playground adventures.',  
    badge: 'Comfort‑first design',  
    footerRight: 'FIT',  
    image: '/hero/hero-3.jpg',  
  },  
  {  
    key: 'sustain',  
    label: 'Thoughtful impact',  
    step: 'Step 4',  
    title: 'Kind to planet and hand‑me‑downs.',  
    body:  
      'We lean on durable stitching, versatile fits and considered quantities, so each piece can be washed, loved and passed along again.',  
    badge: 'Made to last & re‑love',  
    footerRight: 'SUSTAIN',  
    image: '/hero/hero-1.jpg',  
  },  
  // add more "playing cards"  
 
];
  
export default function CraftSection() {  
  return (  
    <section className="relative overflow-hidden bg-[#fdf7f2] px-4 pb-20 pt-16 text-[#4b3b33]">  
      {/* soft pastel wash */}  
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffeef4_0,_transparent_55%),radial-gradient(circle_at_bottom,_#e6f0ff_0,_transparent_55%)] opacity-60" />  
      <div className="pointer-events-none absolute inset-0 bg-[#fdf7f2]/80" />
  
      <div className="relative mx-auto flex max-w-6xl flex-col items-center">  
        {/* centred heading block */}  
        <div className="mb-10 max-w-2xl text-center">  
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b8927c]">  
            How we craft it  
          </p>  
          <h2 className="mt-3 text-3xl font-semibold text-[#4b3b33] sm:text-[2.2rem]">  
            Soft on kids, gentle on the planet.  
          </h2>  
          <p className="mt-3 text-sm text-[#7c675b] sm:text-base">  
            Each Missy &amp; Mopet piece starts with cloud‑soft fabrics, quiet pastels  
            and tiny details that make dressing easy and light—kind to delicate skin,  
            easy to wash, and designed to be loved, re‑loved and handed down.  
          </p>  
        </div>
  
       
  
        {/* layered "playing card" stack */}  
        <div className="relative mt-2 w-full max-w-6xl">  
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">  
            {craftCards.map((card, index) => {  
              // staggered "held like cards" layout  
              const baseRotations = ['-rotate-5', 'rotate-10', '-rotate-5', 'rotate-10'];  
              const baseTranslateY = ['md:translate-y-20', 'md:-translate-y-3', 'md:translate-y-5', 'md:-translate-y-1'];  
              const rotation = baseRotations[index % baseRotations.length];  
              const translateY = baseTranslateY[index % baseTranslateY.length];
  
              return (  
                <motion.article  
                  key={card.key}  
                  className={[  
                    'group relative cursor-pointer overflow-hidden rounded-[24px]',  
                    'border border-[#ead8cd]/80 bg-white/95 backdrop-blur',  
                    'shadow-[0_18px_55px_rgba(148,116,96,0.22)]',  
                    rotation,  
                    translateY,  
                    'transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]',  
                    'hover:z-20', // come above neighbours  
                  ].join(' ')}  
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}  
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}  
                  viewport={{ once: true, amount: 0.3 }}  
                  transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.04 }}  
                  whileHover={{  
                    y: -18,  
                    scale: 1.04,  
                    rotate: 0,  
                    boxShadow: '0 40px 120px rgba(0,0,0,0.28)',  
                  }}  
                >  
                  {/* hover glow */}  
                  <div className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.9)_0,_transparent_60%)]" />
  
                  {/* top image strip */}  
                  <div className="relative h-24 w-full overflow-hidden sm:h-28">  
                    {/* eslint-disable-next-line @next/next/no-img-element */}  
                    <img  
                      src={card.image}  
                      alt={card.title}  
                      className="h-full w-full object-cover"  
                    />  
                    <div className="absolute inset-0 bg-gradient-to-t from-[#fdf7f2]/90 via-[#fdf7f2]/45 to-transparent" />  
                    <div className="absolute left-4 top-3 flex items-center gap-2 text-[10px] font-medium text-[#7c675b]">  
                      <span className="uppercase tracking-[0.18em]">  
                        {card.label}  
                      </span>  
                      {card.step && (  
                        <span className="rounded-full bg-[#fdf7f2]/90 px-2 py-0.5 text-[10px] text-[#4b3b33]">  
                          {card.step}  
                        </span>  
                      )}  
                    </div>  
                  </div>
  
                  {/* text body */}  
                  <div className="relative px-5 pb-4 pt-3">  
                    <h3 className="mb-2 text-base font-semibold text-[#4b3b33] sm:text-[1.05rem]">  
                      {card.title}  
                    </h3>  
                    <p className="text-xs text-[#7c675b] sm:text-[0.8rem] leading-relaxed">  
                      {card.body}  
                    </p>
  
                    <div className="mt-3 inline-flex rounded-full bg-[#f4e3d7] px-3 py-1 text-[10px] font-medium text-[#4b3b33]">  
                      {card.badge}  
                    </div>
  
                    <div className="mt-3 flex items-center justify-between text-[10px] text-[#a48777]">  
                      <span>Missy &amp; Mopet • Craft series</span>  
                      <span>{card.footerRight}</span>  
                    </div>  
                  </div>  
                </motion.article>  
              );  
            })}  
          </div>  
        </div>  
      </div>  
    </section>  
  );  
}  