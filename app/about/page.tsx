'use client';
  
import { motion, useScroll, useTransform } from 'framer-motion';  
import { useRef } from 'react';
  
export default function AboutPage() {  
  const aboutRef = useRef<HTMLDivElement | null>(null);  
  const { scrollYProgress } = useScroll({  
    target: aboutRef,  
    offset: ['start center', 'end center'],  
  });
  
  const aboutOpacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);  
  const aboutY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  
  return (  
    <main className="bg-[#fdf7f2] text-[#3f342c]">  
      {/* HERO */}  
      <section className="relative flex min-h-screen items-center justify-center px-6 py-16 overflow-hidden">  
        {/* Background wash */}  
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffeef4_0,_transparent_55%),radial-gradient(circle_at_bottom,_#e6f0ff_0,_transparent_55%)] opacity-50" />  
        <div className="pointer-events-none absolute inset-0 bg-[#fdf7f2]/85" />
  
        <motion.div  
          initial={{ opacity: 0, y: 40 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.7, ease: 'easeOut' }}  
          className="relative max-w-5xl text-center"  
        >  
          <div className="space-y-2 text-[2.5rem] leading-none font-semibold tracking-tight sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem]">  
            <p className="uppercase text-[#c39b7a] text-xs tracking-[0.35em]">  
              Missy &amp; Moppet  
            </p>  
            <p className="mt-4">JUST SOFT</p>  
            <p>MADE TO LAST</p>  
          </div>
  
          <p className="mx-auto mt-6 max-w-xl text-sm sm:text-base text-[#7c675b]">  
            We design calm, beautiful clothes for little humans and the big feelings they carry—  
            pieces that feel as gentle as your touch and stand up to the stories they'll live through.  
          </p>  
        </motion.div>  
      </section>
  
      {/* ABOUT THE BRAND – SCROLL REACTIVE */}  
      <section  
        ref={aboutRef}  
        className="relative mx-auto max-w-6xl px-6 py-20 md:py-28"  
      >  
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">  
          {/* Left: reactive text */}  
          <motion.div  
            style={{ opacity: aboutOpacity, y: aboutY }}  
            className="space-y-6"  
          >  
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b8927c]">  
              About the brand  
            </p>
  
            <h2 className="text-3xl sm:text-4xl md:text-[2.6rem] leading-tight font-semibold">  
              We're not here to change the world. <br />  
              <span className="text-[#b37f5a]">Just their little corner of it.</span>  
            </h2>
  
            <p className="text-sm sm:text-base text-[#6f5b50] max-w-xl">  
              Missy &amp; Moppet was born from a simple frustration: children's clothes that looked  
              sweet but felt scratchy, faded fast, or lived only for one photo.  
            </p>
  
            <p className="text-sm sm:text-base text-[#6f5b50] max-w-xl">  
              We wanted better. Softer. Kinder. Calmer. So we create everyday pieces that feel like  
              a deep breath: muted tones, cloud‑soft fabrics and silhouettes that move with them  
              —from first crawl to fearless cartwheel.  
            </p>
  
            <p className="text-sm sm:text-base text-[#6f5b50] max-w-xl">  
              We design for the in‑between moments: the car‑seat naps, the kitchen dances, the muddy  
              knees, and the hand‑me‑down stories that follow.  
            </p>  
          </motion.div>
  
          {/* Right: image / collage */}  
          <motion.div  
            initial={{ opacity: 0, x: 60 }}  
            whileInView={{ opacity: 1, x: 0 }}  
            viewport={{ once: true, amount: 0.3 }}  
            transition={{ duration: 0.7, ease: 'easeOut' }}  
            className="relative h-[320px] sm:h-[380px] md:h-[420px]"  
          >  
            <div className="absolute inset-0 rounded-[32px] bg-[#f0dfd0] shadow-[0_30px_120px_rgba(0,0,0,0.18)] overflow-hidden">  
              {/* eslint-disable-next-line @next/next/no-img-element */}  
              <img  
                src="/about/missy-moppet-studio.jpg"  
                alt="Soft, neutral Missy & Moppet pieces styled in studio"  
                className="h-full w-full object-cover"  
              />  
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10" />  
            </div>
  
            {/* floating mini card */}  
            <motion.div  
              initial={{ opacity: 0, y: 30, scale: 0.9 }}  
              whileInView={{ opacity: 1, y: 0, scale: 1 }}  
              viewport={{ once: true, amount: 0.4 }}  
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}  
              className="absolute -bottom-6 -left-2 sm:left-6 rounded-2xl bg-white/90 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.14)] backdrop-blur"  
            >  
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-[#b8927c]">  
                Everyday heirlooms  
              </p>  
              <p className="mt-1 text-xs text-[#6f5b50]">  
                Designed to be worn, loved and handed down—never just worn once.  
              </p>  
            </motion.div>  
          </motion.div>  
        </div>  
      </section>
  
      {/* BRAND VALUES */}  
      <section className="relative bg-[#f8efe7] px-6 py-18 md:py-24">  
        <div className="mx-auto max-w-6xl">  
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">  
            <div>  
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b8927c]">  
                Brand values  
              </p>  
              <h3 className="mt-3 text-2xl sm:text-3xl md:text-[2.1rem] font-semibold">  
                Gentle on skin. <br className="hidden sm:block" />  
                <span className="text-[#b37f5a]">Gentle on the planet.</span>  
              </h3>  
            </div>  
            <p className="max-w-md text-xs sm:text-sm text-[#7c675b]">  
              Every choice—from fabric to fit to finishing—is made with your child's comfort and the  
              planet's future in mind.  
            </p>  
          </div>
  
          <div className="grid gap-6 md:grid-cols-2">  
            {[  
              {  
                title: 'GENTLE ON SKIN',  
                text: 'We start with touch. Soft, breathable materials and thoughtful construction mean nothing digs, scratches or distracts them from being little.',  
              },  
              {  
                title: 'GENTLE ON THE PLANET',  
                text: 'Fewer pieces, loved more deeply. Timeless palettes and durable quality mean our clothes live many lives—not just one season.',  
              },  
              {  
                title: 'DESIGNED TO LIVE IN',  
                text: 'Elastic that moves, seams that dont itch, silhouettes that follow them from floor to playground—all day, every day.',  
              },  
              {  
                title: 'MADE TO HAND DOWN',  
                text: 'We build for siblings, cousins and friends yet to come, turning each piece into a story passed from one small set of hands to another.',  
              },  
            ].map((item, index) => (  
              <motion.div  
                key={item.title}  
                initial={{ opacity: 0, y: 24 }}  
                whileInView={{ opacity: 1, y: 0 }}  
                viewport={{ once: true, amount: 0.2 }}  
                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}  
                className="group rounded-3xl border border-[#e2d1c0] bg-white/80 p-5 sm:p-6 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-sm transition-transform duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_120px_rgba(0,0,0,0.10)]"  
              >  
                <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b8927c]">  
                  {item.title}  
                </h4>  
                <p className="mt-3 text-sm text-[#6f5b50]">{item.text}</p>  
              </motion.div>  
            ))}  
          </div>  
        </div>  
      </section>
  
      {/* MATERIALS & MAKING */}  
      <section className="relative mx-auto max-w-6xl px-6 py-20 md:py-26">  
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] md:items-start">  
          <motion.div  
            initial={{ opacity: 0, x: -50 }}  
            whileInView={{ opacity: 1, x: 0 }}  
            viewport={{ once: true, amount: 0.3 }}  
            transition={{ duration: 0.6, ease: 'easeOut' }}  
          >  
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b8927c]">  
              Materials &amp; making  
            </p>  
            <h3 className="mt-3 text-2xl sm:text-3xl md:text-[2.1rem] font-semibold leading-snug">  
              What their skin deserves. <br />  
              <span className="text-[#b37f5a]">What your values ask for.</span>  
            </h3>  
            <p className="mt-5 max-w-lg text-sm sm:text-base text-[#6f5b50]">  
              From organic‑leaning cotton blends to low‑impact dyes and nickel‑free trims, we  
              consider every element that touches their skin. Our pieces are tested for softness,  
              longevity and easy care—because real life is messy and beautiful.  
            </p>  
          </motion.div>
  
          <motion.div  
            initial={{ opacity: 0, x: 50 }}  
            whileInView={{ opacity: 1, x: 0 }}  
            viewport={{ once: true, amount: 0.3 }}  
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}  
            className="grid gap-4 sm:grid-cols-2"  
          >  
            {[  
              {  
                title: 'Cotton‑rich fabrics',  
                text: 'Soft, breathable bases that are kinder on sensitive skin than harsh synthetics.',  
              },  
              {  
                title: 'Low‑impact dyes',  
                text: 'Calm, considered palettes made with low‑impact dyes and carefully tested finishes.',  
              },  
              {  
                title: 'Thoughtful details',  
                text: 'Nickel‑free hardware, hidden comfort seams and labels placed where they wont itch.',  
              },  
              {  
                title: 'Responsible partners',  
                text: 'Mills and makers chosen for their commitment to quality, safety and fair conditions.',  
              },  
            ].map((material, index) => (  
              <div  
                key={material.title}  
                className="relative overflow-hidden rounded-2xl border border-[#edd9c6] bg-white/90 p-4 text-sm text-[#6f5b50] shadow-[0_16px_60px_rgba(0,0,0,0.05)]"  
              >  
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#b8927c]">  
                  {material.title}  
                </p>  
                <p className="mt-2 text-xs sm:text-sm">{material.text}</p>  
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#fdf7f2]/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 hover:opacity-80" />  
              </div>  
            ))}  
          </motion.div>  
        </div>  
      </section>
  
      {/* SOCIAL PROOF (SMALL, OPTIONAL) */}  
      <section className="bg-[#f8efe7] px-6 py-16 md:py-20">  
        <div className="mx-auto max-w-4xl text-center">  
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b8927c]">  
            Loved by parents  
          </p>  
          <h3 className="mt-3 text-2xl sm:text-3xl font-semibold">  
            "The first clothes they reach for. The last we're willing to give away."  
          </h3>  
          <p className="mt-4 text-sm sm:text-base text-[#6f5b50]">  
            From first steps to first days of school, Missy &amp; Moppet pieces quietly slip into  
            your family's story—soft enough for everyday, special enough to remember.  
          </p>  
        </div>  
      </section>
      
  
      {/* CONNECT WITH US */}  
      <section className="relative px-6 py-18 md:py-24">  
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffeef4_0,_transparent_55%),radial-gradient(circle_at_bottom,_#e6f0ff_0,_transparent_55%)] opacity-40" />  
        <div className="pointer-events-none absolute inset-0 bg-[#fdf7f2]/90" />
  
        <div className="relative mx-auto flex max-w-4xl flex-col gap-8 rounded-[32px] border border-[#ecd8c7] bg-white/90 p-6 sm:p-8 shadow-[0_26px_100px_rgba(0,0,0,0.12)] backdrop-blur-md md:flex-row">  
          <div className="md:w-[45%]">  
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#b8927c]">  
              Connect with us  
            </p>  
            <h3 className="mt-3 text-2xl sm:text-3xl font-semibold">  
              Invest in what they live in.  
            </h3>  
            <p className="mt-4 text-sm sm:text-base text-[#6f5b50]">  
              Tell us about your little one, what you're dreaming of, or any questions you have.  
              We're here to help you build a softer, calmer wardrobe—piece by piece.  
            </p>  
          </div>
  
          <form className="md:w-[55%] space-y-4">  
            <div className="grid gap-3 sm:grid-cols-2">  
              <FormField label="Your name" name="name" />  
              <FormField label="Your email" name="email" type="email" />  
            </div>  
            <div className="grid gap-3 sm:grid-cols-2">  
              <FormField label="Your child's age(s)" name="childAges" />  
              <div>  
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-[#9b7c63]">  
                  What are you looking for?  
                </label>  
                <select  
                  name="interest"  
                  className="w-full rounded-xl border border-[#e2d1c0] bg-white/80 px-3 py-2 text-xs text-[#3f342c] outline-none ring-0 transition focus:border-[#b8927c]"  
                >  
                  <option>Newborn essentials</option>  
                  <option>Everyday outfits</option>  
                  <option>Gifting</option>  
                  <option>Special occasion</option>  
                  <option>Other</option>  
                </select>  
              </div>  
            </div>  
            <div>  
              <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-[#9b7c63]">  
                Your message  
              </label>  
              <textarea  
                name="message"  
                rows={4}  
                className="w-full rounded-xl border border-[#e2d1c0] bg-white/80 px-3 py-2 text-xs text-[#3f342c] outline-none ring-0 transition focus:border-[#b8927c]"  
                placeholder="Share anything that will help us support you better."  
              />  
            </div>  
            <button  
              type="submit"  
              className="inline-flex items-center justify-center rounded-full bg-[#3f342c] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#fdf7f2] transition hover:bg-[#2b241f]"  
            >  
              Send this to Missy &amp; Moppet  
            </button>  
          </form>  
        </div>  
      </section>  
    </main>  
  );  
}
  
type FieldProps = {  
  label: string;  
  name: string;  
  type?: string;  
};
  
function FormField({ label, name, type = 'text' }: FieldProps) {  
  return (  
    <div>  
      <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-[#9b7c63]">  
        {label}  
      </label>  
      <input  
        type={type}  
        name={name}  
        className="w-full rounded-xl border border-[#e2d1c0] bg-white/80 px-3 py-2 text-xs text-[#3f342c] outline-none ring-0 transition focus:border-[#b8927c]"  
      />  
    </div>  
  );  
}  