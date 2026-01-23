'use client';

import Link from 'next/link';
import Image from 'next/image';
import HeroCarousel from './home/HeroCarousel';

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f9efe7] via-[#f5e5dd] to-[#e9d7cc]">
      {/* Soft radial glow behind the glass window */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute left-[15%] top-[20%] h-64 w-64 rounded-full bg-[#ffd7bf]/40 blur-3xl" />
        <div className="absolute right-[10%] bottom-[10%] h-64 w-64 rounded-full bg-[#c3d8ff]/35 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center px-4 pb-20 pt-10 md:flex-row md:items-center md:justify-between md:pt-16">
        
        {/* Left: About + Instagram */}
        <div className="z-10 mb-10 max-w-xs md:mb-0 md:w-1/4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#b18b74]">
            About Missy &amp; Mopet
          </p>
          <h2 className="mt-3 text-sm font-medium leading-relaxed text-[#6b5245]">
            Soft, breathable pieces for little humans – designed to move through naps,
            playdates and everything in between.
          </h2>
          <p className="mt-3 text-xs text-[#8d6e5c]">
            Thoughtful fabrics, calm pastels and details that feel like a hug.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="https://instagram.com/missyandmoppet"
              target="_blank"
              className="group inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/30 px-4 py-2 text-xs font-medium text-[#4b3b33] shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur-lg transition hover:bg-white/70"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/60 text-[11px] text-[#e1306c]">
                IG
              </span>
              <span>View our Instagram</span>
            </Link>
          </div>
        </div>

        {/* Center: Glass "window" - UPDATED FOR LANDSCAPE */}
        <div className="z-20 mb-16 w-full md:mb-0 md:w-2/5 px-2">
          {/* Changed fixed height to aspect-video (16:9) or custom aspect ratio 
              Added w-full to ensure it uses the landscape width effectively
          */}
          <div className="relative mx-auto aspect-[4/3] sm:aspect-video w-full max-w-lg flex items-center justify-center rounded-[32px] sm:rounded-[42px] border border-white/70 bg-white/20 shadow-[0_28px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_38px_120px_rgba(0,0,0,0.35)]">
            
            {/* Inner image container: matches landscape aspect */}
            <div className="relative h-[88%] w-[90%] overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/60 bg-gradient-to-b from-[#f8f0ea] to-[#e8d8ce]">
              <HeroCarousel />
            </div>

            {/* Bottom pill with main CTA - Positioned correctly relative to landscape height */}
            <div className="absolute -bottom-6 flex w-full items-center justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-6 py-2.5 text-xs font-semibold text-[#4b3b33] shadow-[0_18px_45px_rgba(0,0,0,0.20)] transition hover:bg-white whitespace-nowrap"
              >
                <span>Shop collection</span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#4b3b33] text-[11px] text-[#fdf7f2]">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Large hero text */}
        <div className="z-10 max-w-xs text-center md:text-right md:w-1/4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#b18b74]">
            We are softness
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.1] text-[#3b2c24] sm:text-5xl lg:text-6xl">
            Missy & Moppet
          </h1>
          <p className="mt-4 text-[11px] text-[#8d6e5c] leading-relaxed">
            Everyday clothes that feel like a hug – gentle on skin, easy to tumble in, and pretty enough for every photo.
          </p>
        </div>
      </div>
    </section>
  );
}