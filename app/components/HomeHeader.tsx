'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/app/store/cartStore';
import { useTryAtHomeStore } from '@/app/store/tryAtHomeStore';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';

function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="relative h-4 w-5">
      <span
        className={[
          'absolute left-0 top-0 h-[1.5px] w-5 rounded-full bg-current transition-all duration-300 ease-in-out',
          open ? 'translate-y-[7px] rotate-45' : '',
        ].join(' ')}
      />
      <span
        className={[
          'absolute left-0 top-[7px] h-[1.5px] w-5 rounded-full bg-current transition-all duration-300 ease-in-out',
          open ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      />
      <span
        className={[
          'absolute left-0 top-[14px] h-[1.5px] w-5 rounded-full bg-current transition-all duration-300 ease-in-out',
          open ? '-translate-y-[7px] -rotate-45' : '',
        ].join(' ')}
      />
    </div>
  );
}

export default function HomeHeader() {
  const pathname = usePathname();
  const cartItems = useCartStore((s) => s.items);
  const tryItems = useTryAtHomeStore((s) => s.items);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  const tryCount = tryItems.length;

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 py-4 sm:px-10 pointer-events-none">
      <div className="mx-auto flex max-w-7xl items-center justify-between pointer-events-auto rounded-full border border-white/20 bg-white/60 backdrop-blur-xl px-6 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] transition-all duration-500">
        
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-[#f3d8c3] shadow-inner transition-transform duration-500 group-hover:scale-110">
            <img 
              src="/hero/logo.png" 
              alt="Missy & Moppet Logo" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <div className="text-[12px] font-bold tracking-[0.25em] text-[#4b3b33] uppercase">
              Missy &amp; Moppet
            </div>
            <div className="text-[10px] text-[#a07d68] font-medium tracking-wide">
              Soft pastels for little humans
            </div>
          </div>
        </Link>

        {/* Right side Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/account"
            className={`p-2.5 rounded-full border transition-all duration-300 ${
              pathname === '/account'
                ? 'bg-neutral-900 border-neutral-900 text-white'
                : 'border-[#ead8cd] text-[#7c675b] hover:border-neutral-900 hover:text-neutral-900 bg-white/50'
            }`}
          >
            <User size={18} strokeWidth={1.5} />
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className={[
                'inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-[11px] font-bold tracking-widest uppercase transition-all duration-300',
                menuOpen
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-[#ead8cd] bg-white/50 text-[#7c675b] hover:border-neutral-900 hover:text-neutral-900',
              ].join(' ')}
            >
              <span className="mr-3 hidden sm:inline">Menu</span>
              <MenuIcon open={menuOpen} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-[280px] origin-top-right rounded-[24px] border border-white/40 bg-white/95 backdrop-blur-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                >
                  <div className="grid gap-2">
                    <MenuLink
                      href="/shop"
                      label="Shop"
                      sub="Browse"
                      active={!!pathname?.startsWith('/shop')}
                      onClick={() => setMenuOpen(false)}
                    />
                    <MenuLink
                      href="/try-at-home"
                      label="Try at home"
                      sub="Selected"
                      count={tryCount}
                      active={pathname === '/try-at-home'}
                      onClick={() => setMenuOpen(false)}
                    />
                    <MenuLink
                      href="/account"
                      label="Account"
                      sub="Your Profile"
                      active={pathname === '/account'}
                      onClick={() => setMenuOpen(false)}
                    />
                  </div>

                  <div className="my-4 h-px w-full bg-[#ead8cd]/40" />

                  <div className="flex gap-2">
                    <PillLink
                      href="/try-at-home"
                      label="Try"
                      count={tryCount}
                      active={pathname === '/try-at-home'}
                      onClick={() => setMenuOpen(false)}
                    />
                    <PillLink
                      href="/cart"
                      label="Cart"
                      count={cartCount}
                      active={pathname === '/cart'}
                      isDark
                      onClick={() => setMenuOpen(false)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuLink({ href, label, sub, count, active, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all ${
        active ? 'bg-[#f4e3d7] text-[#4b3b33]' : 'hover:bg-neutral-50 text-[#7c675b]'
      }`}
    >
      <span className="font-semibold">{label}</span>
      <span className="text-[10px] opacity-60 uppercase tracking-tighter">
        {count !== undefined ? `${count} items` : sub}
      </span>
    </Link>
  );
}

function PillLink({ href, label, count, active, isDark, onClick }: any) {
  const base = 'flex flex-1 items-center justify-between rounded-full px-4 py-2.5 text-[11px] font-bold transition-all border';
  const theme = isDark ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-800 border-[#ead8cd]';
  const activeRing = active ? 'ring-2 ring-neutral-900/20' : '';

  return (
    <Link href={href} onClick={onClick} className={[base, theme, activeRing].join(' ')}>
      <span>{label}</span>
      <span className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full text-[10px] ${isDark ? 'bg-white/20' : 'bg-[#f4e3d7]'}`}>
        {count}
      </span>
    </Link>
  );
}