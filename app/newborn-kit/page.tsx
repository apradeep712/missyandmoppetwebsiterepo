// app/about/page.tsx  
import Link from 'next/link';
  
export const metadata = {  
  title: 'About • Missy & Moppet',  
  description:  
    'Soft pastels for little humans — thoughtful essentials made with comfort, care, and love.',  
};
  
function SoftCard({  
  children,  
  className = '',  
}: {  
  children: React.ReactNode;  
  className?: string;  
}) {  
  return (  
    <section  
      className={[  
        'rounded-[32px] border border-[#ead8cd]/70 bg-white/80 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl',  
        'p-6 sm:p-8',  
        className,  
      ].join(' ')}  
    >  
      {children}  
    </section>  
  );  
}
  
function Pill({ children }: { children: React.ReactNode }) {  
  return (  
    <span className="inline-flex items-center rounded-full border border-[#ead8cd] bg-white/70 px-3 py-1 text-[11px] font-medium text-[#7c675b]">  
      {children}  
    </span>  
  );  
}
  
export default function AboutPage() {  
  return (  
    <main className="min-h-screen bg-[#f9efe7] text-[#4b3b33]">  
      {/* Top bar */}  
      <header className="sticky top-0 z-40 border-b border-[#ead8cd] bg-[#fdf7f2]/95 backdrop-blur-sm">  
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">  
          <Link href="/" className="flex items-center gap-2">  
            <div className="h-8 w-8 rounded-full bg-[#f3d8c3]" />  
            <div className="leading-tight">  
              <div className="text-sm font-semibold tracking-[0.18em] uppercase">  
                Missy &amp; Moppet  
              </div>  
              <div className="text-[11px] text-[#a07d68]">Soft pastels for little humans</div>  
            </div>  
          </Link>
  
          <div className="flex items-center gap-2">  
            <Link  
              href="/shop"  
              className="rounded-full border border-[#ead8cd] bg-white/70 px-4 py-2 text-[12px] font-medium text-[#7c675b] transition-colors hover:bg-white hover:text-[#4b3b33]"  
            >  
              Shop  
            </Link>  
            <Link  
              href="/try-at-home"  
              className="rounded-full border border-[#ead8cd] bg-white/70 px-4 py-2 text-[12px] font-medium text-[#7c675b] transition-colors hover:bg-white hover:text-[#4b3b33]"  
            >  
              Try at home  
            </Link>  
          </div>  
        </div>  
      </header>
  
      {/* Page container */}  
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:pt-14">  
        {/* Hero */}  
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">  
          <div>  
            <div className="flex flex-wrap gap-2">  
              <Pill>Thoughtful essentials</Pill>  
              <Pill>Soft pastels</Pill>  
              <Pill>Comfort-first</Pill>  
            </div>
  
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">  
              Moments filled with warmth, wonder, and love.  
            </h1>
  
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#7c675b]">  
              The first few days with your little one are tender, unforgettable, and full of tiny  
              firsts. At Missy &amp; Moppet, we've woven that feeling into pieces designed to be  
              gentle on delicate skin — and calming to hold, wear, and keep close.  
            </p>
  
            <div className="mt-6 flex flex-wrap gap-3">  
              <Link  
                href="/newborn-kit"  
                className="rounded-full bg-[#4b3b33] px-5 py-3 text-sm font-semibold text-[#fdf7f2] transition-colors hover:bg-[#3f312b]"  
              >  
                Explore the Sterilized Hospital Kit  
              </Link>  
              <Link  
                href="/customize"  
                className="rounded-full border border-[#ead8cd] bg-white/80 px-5 py-3 text-sm font-semibold text-[#4b3b33] transition-colors hover:bg-white"  
              >  
                Customize a set  
              </Link>  
            </div>  
          </div>
  
          {/* Warm hero visual (pure CSS; swap for image/video later if you want) */}  
          <div className="relative overflow-hidden rounded-[32px] border border-[#ead8cd]/70 bg-white/70 shadow-[0_22px_60px_rgba(0,0,0,0.14)]">  
            <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_20%,rgba(244,227,215,0.95),transparent_60%),radial-gradient(70%_60%_at_80%_30%,rgba(255,255,255,0.9),transparent_55%),radial-gradient(80%_70%_at_40%_90%,rgba(243,216,195,0.9),transparent_60%)]" />  
            <div className="relative p-7 sm:p-10">  
              <div className="text-xs font-semibold tracking-[0.18em] text-[#a07d68] uppercase">  
                Our promise  
              </div>  
              <div className="mt-3 text-2xl font-semibold leading-snug">  
                Pure softness. Comfort. Care.  
              </div>  
              <p className="mt-3 text-sm leading-relaxed text-[#7c675b]">  
                From that very first cuddle to your journey home, our pieces are designed to feel  
                simple, safe, and soothing — for baby and parent.  
              </p>
  
              <div className="mt-6 grid gap-3 sm:grid-cols-2">  
                <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                  <div className="text-[11px] font-semibold tracking-[0.14em] text-[#a07d68] uppercase">  
                    Baby-first materials  
                  </div>  
                  <div className="mt-2 text-sm text-[#4b3b33]">  
                    Light, breathable, quick‑drying.  
                  </div>  
                </div>  
                <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                  <div className="text-[11px] font-semibold tracking-[0.14em] text-[#a07d68] uppercase">  
                    Thoughtful details  
                  </div>  
                  <div className="mt-2 text-sm text-[#4b3b33]">  
                    Tiny finishing touches that feel special.  
                  </div>  
                </div>  
              </div>  
            </div>  
          </div>  
        </div>
  
        {/* Story + Values */}  
        <div className="grid gap-6 lg:grid-cols-2">  
          <SoftCard>  
            <div className="text-xs font-semibold tracking-[0.18em] text-[#a07d68] uppercase">  
              Brand story  
            </div>  
            <h2 className="mt-3 text-2xl font-semibold">Soft pastels for little humans.</h2>  
            <p className="mt-3 text-sm leading-relaxed text-[#7c675b]">  
              Missy &amp; Moppet began with a simple idea: newborn essentials should feel as gentle  
              as the moments they're made for. We focus on calm colours, soft textures, and  
              comfort‑first design — so your baby's first wardrobe feels reassuring from day one.  
            </p>
  
            <div className="mt-6 flex flex-wrap gap-2">  
              <Pill>Gentle on skin</Pill>  
              <Pill>Comfort-led design</Pill>  
              <Pill>Made with care</Pill>  
            </div>  
          </SoftCard>
  
          <SoftCard>  
            <div className="text-xs font-semibold tracking-[0.18em] text-[#a07d68] uppercase">  
              What we stand for  
            </div>
  
            <div className="mt-5 grid gap-4">  
              <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                <div className="text-sm font-semibold">Comfort, always</div>  
                <div className="mt-1 text-sm text-[#7c675b]">  
                  Babywear should be soft, breathable, and easy for parents to use every day.  
                </div>  
              </div>
  
              <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                <div className="text-sm font-semibold">Thoughtful simplicity</div>  
                <div className="mt-1 text-sm text-[#7c675b]">  
                  We keep the experience calm and clean — minimal fuss, maximum ease.  
                </div>  
              </div>
  
              <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                <div className="text-sm font-semibold">A little charm</div>  
                <div className="mt-1 text-sm text-[#7c675b]">  
                  Small details can make everyday moments feel extra special.  
                </div>  
              </div>  
            </div>  
          </SoftCard>  
        </div>
  
        {/* Sterilized Hospital Kit feature */}  
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">  
          <SoftCard className="p-0 overflow-hidden">  
            {/* Visual block (CSS background; replace with your images/video later) */}  
            <div className="relative h-[280px] w-full sm:h-[340px]">  
              <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_20%,rgba(255,255,255,0.95),transparent_55%),radial-gradient(70%_70%_at_70%_40%,rgba(244,227,215,0.95),transparent_60%),linear-gradient(180deg,rgba(249,239,231,1),rgba(255,255,255,0.65))]" />  
              <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(160,125,104,0.28)_1px,transparent_1px)] [background-size:18px_18px]" />  
              <div className="relative flex h-full items-end p-6 sm:p-8">  
                <div className="max-w-sm">  
                  <div className="text-xs font-semibold tracking-[0.18em] text-[#a07d68] uppercase">  
                    Signature offering  
                  </div>  
                  <div className="mt-2 text-2xl font-semibold leading-snug">  
                    The Sterilized Hospital Kit  
                  </div>  
                  <p className="mt-2 text-sm text-[#7c675b]">  
                    A bundle of pure softness, comfort, and love — curated for those first precious  
                    days.  
                  </p>  
                </div>  
              </div>  
            </div>  
          </SoftCard>
  
          <SoftCard>  
            <div className="text-xs font-semibold tracking-[0.18em] text-[#a07d68] uppercase">  
              What's inside  
            </div>
  
            <p className="mt-3 text-sm leading-relaxed text-[#7c675b]">  
              Each kit includes thoughtfully selected essentials — soft jablas, cozy swaddles, tiny  
              mittens, caps, burp and bath towels — everything your newborn needs in those first  
              gentle days.  
            </p>
  
            <div className="mt-5 grid gap-3 sm:grid-cols-2">  
              <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                <div className="text-sm font-semibold">Baby-safe fabrics</div>  
                <div className="mt-1 text-sm text-[#7c675b]">  
                  100% organic, undyed, and chemical‑free — made to be kind to delicate skin.  
                </div>  
              </div>
  
              <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                <div className="text-sm font-semibold">Built for real life</div>  
                <div className="mt-1 text-sm text-[#7c675b]">  
                  Light, breathable, and quick‑drying — because parents deserve ease too.  
                </div>  
              </div>
  
              <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                <div className="text-sm font-semibold">Tiny finishing touches</div>  
                <div className="mt-1 text-sm text-[#7c675b]">  
                  Each jabla is finished with small hand‑done details for extra charm.  
                </div>  
              </div>
  
              <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                <div className="text-sm font-semibold">A baby's first buddy</div>  
                <div className="mt-1 text-sm text-[#7c675b]">  
                  To make it even more special — a soft little toy for snuggles and giggles.  
                </div>  
              </div>  
            </div>
  
            <div className="mt-6 rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
              <div className="text-xs font-semibold tracking-[0.14em] text-[#a07d68] uppercase">  
                Sterilized for peace of mind  
              </div>  
              <p className="mt-2 text-sm leading-relaxed text-[#7c675b]">  
                Every Missy &amp; Moppet Hospital Kit is sterilized using a specialized technique  
                designed for baby products — ensuring every piece is clean, safe, and  
                chemical‑free for your newborn.  
              </p>  
            </div>
  
            <div className="mt-6 grid gap-3 sm:grid-cols-2">  
              <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                <div className="text-sm font-semibold">Premium kit</div>  
                <div className="mt-1 text-sm text-[#7c675b]">  
                  Includes a pashmina blanket designed to wrap your baby in warmth and love.  
                </div>  
              </div>  
              <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                <div className="text-sm font-semibold">Normal kit</div>  
                <div className="mt-1 text-sm text-[#7c675b]">  
                  Includes a cozy woolen crochet blanket designed to wrap your baby in warmth and  
                  love.  
                </div>  
              </div>  
            </div>
  
            <div className="mt-6 flex flex-wrap gap-3">  
              <Link  
                href="/newborn-kit"  
                className="rounded-full bg-[#4b3b33] px-5 py-3 text-sm font-semibold text-[#fdf7f2] transition-colors hover:bg-[#3f312b]"  
              >  
                Request the kit  
              </Link>  
              <Link  
                href="/shop"  
                className="rounded-full border border-[#ead8cd] bg-white/80 px-5 py-3 text-sm font-semibold text-[#4b3b33] transition-colors hover:bg-white"  
              >  
                Explore the shop  
              </Link>  
            </div>  
          </SoftCard>  
        </div>
  
        {/* How we make it */}  
        <div className="mt-6">  
          <SoftCard>  
            <div className="text-xs font-semibold tracking-[0.18em] text-[#a07d68] uppercase">  
              How we make it  
            </div>  
            <h2 className="mt-3 text-2xl font-semibold">Care in every step.</h2>
  
            <div className="mt-6 grid gap-4 md:grid-cols-3">  
              <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-5">  
                <div className="text-xs font-semibold tracking-[0.14em] text-[#a07d68] uppercase">  
                  01 • Materials  
                </div>  
                <div className="mt-2 text-sm font-semibold">Gentle, breathable fabric</div>  
                <p className="mt-2 text-sm leading-relaxed text-[#7c675b]">  
                  We prioritize softness and comfort so everyday essentials feel calm and cozy.  
                </p>  
              </div>
  
              <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-5">  
                <div className="text-xs font-semibold tracking-[0.14em] text-[#a07d68] uppercase">  
                  02 • Finishing  
                </div>  
                <div className="mt-2 text-sm font-semibold">Details that feel special</div>  
                <p className="mt-2 text-sm leading-relaxed text-[#7c675b]">  
                  Subtle touches add charm without sacrificing comfort or ease of use.  
                </p>  
              </div>
  
              <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-5">  
                <div className="text-xs font-semibold tracking-[0.14em] text-[#a07d68] uppercase">  
                  03 • Peace of mind  
                </div>  
                <div className="mt-2 text-sm font-semibold">Sterilized for newborn use</div>  
                <p className="mt-2 text-sm leading-relaxed text-[#7c675b]">  
                  Our newborn kit is prepared with extra care so you can focus on the moments that  
                  matter.  
                </p>  
              </div>  
            </div>  
          </SoftCard>  
        </div>
  
        {/* Final CTA */}  
        <div className="mt-6">  
          <SoftCard className="bg-white/75">  
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">  
              <div>  
                <div className="text-xs font-semibold tracking-[0.18em] text-[#a07d68] uppercase">  
                  Ready when you are  
                </div>  
                <div className="mt-2 text-2xl font-semibold">  
                  From first cuddle to journey home.  
                </div>  
                <p className="mt-2 text-sm text-[#7c675b]">  
                  Explore essentials, request the sterilized newborn kit, or share a customization  
                  idea — we'll take it from there.  
                </p>  
              </div>
  
              <div className="flex flex-wrap gap-3">  
                <Link  
                  href="/newborn-kit"  
                  className="rounded-full bg-[#4b3b33] px-5 py-3 text-sm font-semibold text-[#fdf7f2] transition-colors hover:bg-[#3f312b]"  
                >  
                  Newborn kit  
                </Link>  
                <Link  
                  href="/customize"  
                  className="rounded-full border border-[#ead8cd] bg-white/80 px-5 py-3 text-sm font-semibold text-[#4b3b33] transition-colors hover:bg-white"  
                >  
                  Customize  
                </Link>  
              </div>  
            </div>  
          </SoftCard>  
        </div>
  
        {/* Footer note */}  
        <div className="mt-10 text-center text-[12px] text-[#a07d68]">  
          © {new Date().getFullYear()} Missy &amp; Moppet • Soft pastels for little humans  
        </div>  
      </div>  
    </main>  
  );  
}  