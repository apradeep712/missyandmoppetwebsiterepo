"use client";

import React from "react";

const testimonials = [
  { name: "Ananya R.", text: "The softest cotton I've found in India. Perfect for my son's sensitive skin." },
  { name: "Priya M.", text: "Finally! Boys' clothes that aren't just trucks and dinosaurs. So chic." },
  { name: "Sarah J.", text: "The colors stay dreamy even after ten washes. Exceptional quality." },
  { name: "Karan T.", text: "Used these for our family photoshoot. The textures look amazing on camera." },
  { name: "Megha S.", text: "It feels like a hug. My toddler actually asks to wear his 'soft shirt'." },
  { name: "Rohan V.", text: "Thoughtful designs. Love the focus on organic dyes and sustainability." },
  { name: "Sneha W.", text: "The premium finish is visible. It's world-class quality, locally made." },
  { name: "Aditi G.", text: "Fast shipping and the packaging felt like receiving a gift." },
  { name: "Ishani P.", text: "Perfect fit for active play. Doesn't restrict movement at all." },
  { name: "Tanya B.", text: "The pastel palette is so refreshing compared to mall brands." },
  { name: "Arjun K.", text: "Robust enough for playground dirt, soft enough for a nap." },
  { name: "Nisha L.", text: "A parent-led brand that clearly understands what babies need." },
  { name: "Zoya F.", text: "The organic cotton is a game changer for summer months." },
  { name: "Ritu H.", text: "Every piece feels like it was made with so much love." },
  { name: "Vicky D.", text: "Best boutique find this year. My go-to for gifting now." },
];

export default function AestheticBrandStory() {
  // We double the array to ensure the loop never shows a gap
  const doubledTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="group/section w-full bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        
        {/* Header Section */}
        <div className="mb-20 text-center">
          <span className="inline-block rounded-full bg-zinc-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 border border-zinc-100">
            Our Philosophy
          </span>
          <h2 className="mt-8 text-5xl font-light leading-[1.15] text-zinc-900 md:text-7xl">
            Designed for <span className="transition-colors duration-700 group-hover/section:text-[#F8BBD0]">play</span>, <br />
            made for <span className="transition-colors duration-700 group-hover/section:text-[#BBDEFB]">memories</span>.
          </h2>
        </div>

        {/* Bento-Style Story Grid */}
        <div className="grid gap-8 md:grid-cols-12">
          {/* Main Story Box */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-50 p-10 transition-all duration-700 hover:shadow-xl hover:shadow-pink-100/50 md:col-span-8">
            <div className="relative z-10">
              <h3 className="text-2xl font-medium text-zinc-900">The Missy & Moppet Story</h3>
              <p className="mt-6 text-xl leading-relaxed text-zinc-600 max-w-2xl">
                Missy & Moppet was born when we realized that boys' fashion lacked the soul and softness our little ones deserved. 
                We bridge the gap between India’s world-class textile heritage and the everyday wardrobe.
              </p>
            </div>
            {/* Subtle background glow on hover */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FCE4EC] blur-[100px] transition-opacity duration-700 opacity-0 group-hover/section:opacity-100" />
          </div>

          {/* Small Quality Box */}
          <div className="flex flex-col justify-center rounded-[2.5rem] border border-zinc-100 p-10 transition-all duration-700 hover:bg-[#BBDEFB]/10 md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">The Quality</h4>
            <p className="mt-4 text-lg text-zinc-700 leading-snug">Small batches. Organic dyes. Fabrics that feel like a second skin.</p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-32">
          <div className="mb-12 flex items-center justify-between">
            <div className="h-[1px] flex-1 bg-zinc-100"></div>
            <h3 className="mx-8 text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 shrink-0">
              What Parents Feel
            </h3>
            <div className="h-[1px] flex-1 bg-zinc-100"></div>
          </div>
          
          {/* The Scroller */}
          <div className="relative w-full overflow-hidden">
            {/* Fade Gradient Masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent"></div>

            <div className="flex w-max animate-scroll">
              {doubledTestimonials.map((t, i) => (
                <div 
                  key={i} 
                  className="mx-4 w-[350px] shrink-0 rounded-3xl border border-zinc-50 bg-zinc-50/50 p-8 backdrop-blur-sm transition-all duration-500 hover:border-pink-100 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-1 w-1 rounded-full bg-pink-200" />
                    ))}
                  </div>
                  <p className="text-base leading-relaxed text-zinc-600 font-light italic">
                    "{t.text}"
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#FCE4EC] to-[#E3F2FD]" />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                      {t.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50%)); }
        }
        .animate-scroll {
          animation: scroll 80s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}