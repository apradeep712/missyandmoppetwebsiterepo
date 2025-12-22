'use client';
  
import Link from 'next/link';  
import { usePathname } from 'next/navigation';  
import { useCartStore } from '@/app/store/cartStore';  
import { useTryAtHomeStore } from '@/app/store/tryAtHomeStore';  
import { useMemo, useState } from 'react';
  
function MenuIcon({ open }: { open: boolean }) {  
  // Simple animated hamburger -> X  
  return (  
    <div className="relative h-4 w-5">  
      <span  
        className={[  
          'absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current transition-all duration-200 ease-out',  
          open ? 'translate-y-[7px] rotate-45' : '',  
        ].join(' ')}  
      />  
      <span  
        className={[  
          'absolute left-0 top-[7px] h-[2px] w-5 rounded-full bg-current transition-all duration-200 ease-out',  
          open ? 'opacity-0' : 'opacity-100',  
        ].join(' ')}  
      />  
      <span  
        className={[  
          'absolute left-0 top-[14px] h-[2px] w-5 rounded-full bg-current transition-all duration-200 ease-out',  
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
  
  const isOnTryPage = pathname === '/try-at-home';  
  const isOnCartPage = pathname === '/cart';
  
  // Hover/focus driven menu (works on desktop hover + keyboard focus),  
  // and also toggles on click for touch devices.  
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (  
    <header className="sticky top-0 z-50 border-b border-[#ead8cd] bg-[#fdf7f2]/95 backdrop-blur-sm">  
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">  
        {/* Logo / brand */}  
        <Link href="/" className="flex items-center gap-2">  
          <div className="h-8 w-8 rounded-full bg-[#f3d8c3]" />  
          <div className="leading-tight">  
            <div className="text-sm font-semibold tracking-[0.18em] text-[#4b3b33] uppercase">  
              Missy &amp; Mopet  
            </div>  
            <div className="text-[11px] text-[#a07d68]">  
              Soft pastels for little humans  
            </div>  
          </div>  
        </Link>
  
        {/* Right side: menu button + flyout */}  
        <div  
          className="relative"  
          onMouseEnter={() => setMenuOpen(true)}  
          onMouseLeave={() => setMenuOpen(false)}  
        >  
          {/* Menu button (top-right icon) */}  
          <button  
            type="button"  
            aria-label="Open menu"  
            aria-haspopup="menu"  
            aria-expanded={menuOpen}  
            onClick={() => setMenuOpen((v) => !v)}  
            onBlur={(e) => {  
              // close only when focus leaves the whole menu region  
              if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {  
                setMenuOpen(false);  
              }  
            }}  
            className={[  
              'inline-flex items-center justify-center rounded-full border px-3 py-2 text-[11px] font-medium',  
              'transition-colors duration-200',  
              menuOpen  
                ? 'border-[#b8927c] bg-white text-[#4b3b33]'  
                : 'border-[#ead8cd] bg-white/80 text-[#7c675b] hover:bg-white hover:text-[#4b3b33]',  
              'focus:outline-none focus:ring-2 focus:ring-[#ead8cd] focus:ring-offset-2 focus:ring-offset-[#fdf7f2]',  
            ].join(' ')}  
          >  
            <span className="mr-2 hidden sm:inline">Menu</span>  
            <MenuIcon open={menuOpen} />  
          </button>
  
          {/* Flyout panel */}  
          <div  
            role="menu"  
            aria-label="Header menu"  
            className={[  
              'absolute right-0 mt-3 w-[280px] origin-top-right',  
              'rounded-[20px] border border-[#ead8cd]/70 bg-white/85 shadow-[0_22px_60px_rgba(0,0,0,0.16)]',  
              'backdrop-blur-xl',  
              'transition-all duration-200 ease-out',  
              menuOpen  
                ? 'pointer-events-auto translate-y-0 opacity-100'  
                : 'pointer-events-none -translate-y-2 opacity-0',  
            ].join(' ')}  
          >  
            <div className="p-3">  
              {/* Top links */}  
              <div className="grid gap-1">  
                <Link  
                  role="menuitem"  
                  href="/shop"  
                  onClick={() => setMenuOpen(false)}  
                  className={[  
                    'rounded-2xl px-3 py-2 text-sm transition-colors',  
                    pathname?.startsWith('/shop')  
                      ? 'bg-[#f4e3d7] text-[#4b3b33]'  
                      : 'text-[#7c675b] hover:bg-[#f7eee7] hover:text-[#4b3b33]',  
                  ].join(' ')}  
                >  
                  <div className="flex items-center justify-between">  
                    <span className="font-medium">Shop</span>  
                    <span className="text-xs text-[#a07d68]">Browse</span>  
                  </div>  
                </Link>
  
                <Link  
                  role="menuitem"  
                  href="/try-at-home"  
                  onClick={() => setMenuOpen(false)}  
                  className={[  
                    'rounded-2xl px-3 py-2 text-sm transition-colors',  
                    isOnTryPage  
                      ? 'bg-[#f4e3d7] text-[#4b3b33]'  
                      : 'text-[#7c675b] hover:bg-[#f7eee7] hover:text-[#4b3b33]',  
                  ].join(' ')}  
                >  
                  <div className="flex items-center justify-between">  
                    <span className="font-medium">Try at home</span>  
                    <span className="inline-flex items-center gap-2">  
                      <span className="text-xs text-[#a07d68]">Selected</span>  
                      <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#f4e3d7] px-1 text-[10px] text-[#4b3b33]">  
                        {tryCount}  
                      </span>  
                    </span>  
                  </div>  
                </Link>  
              </div>
  
              {/* Divider */}  
              <div className="my-3 h-px w-full bg-[#ead8cd]/70" />
  
              {/* Action pills */}  
              <div className="flex items-center gap-2">  
                <Link  
                  role="menuitem"  
                  href="/try-at-home"  
                  onClick={() => setMenuOpen(false)}  
                  className={[  
                    'flex flex-1 items-center justify-between rounded-full border px-3 py-2 text-[11px] transition-colors',  
                    isOnTryPage  
                      ? 'border-[#b8927c] bg-white text-[#4b3b33]'  
                      : 'border-[#ead8cd] bg-white/80 text-[#7c675b] hover:bg-white hover:text-[#4b3b33]',  
                  ].join(' ')}  
                >  
                  <span>Try</span>  
                  <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#f4e3d7] px-1 text-[10px] text-[#4b3b33]">  
                    {tryCount}  
                  </span>  
                </Link>
  
                <Link  
                  role="menuitem"  
                  href="/cart"  
                  onClick={() => setMenuOpen(false)}  
                  className={[  
                    'flex flex-1 items-center justify-between rounded-full border px-3 py-2 text-[11px] transition-colors',  
                    isOnCartPage  
                      ? 'border-[#b8927c] bg-white text-[#4b3b33]'  
                      : 'border-[#ead8cd] bg-white/80 text-[#7c675b] hover:bg-white hover:text-[#4b3b33]',  
                  ].join(' ')}  
                >  
                  <span>Cart</span>  
                  <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#4b3b33] px-1 text-[10px] text-[#fdf7f2]">  
                    {cartCount}  
                  </span>  
                </Link>  
              </div>
  
              {/* Optional tiny helper text */}  
              <div className="mt-3 text-[11px] text-[#a07d68]">  
                Smooth pastels, thoughtfully made.  
              </div>  
            </div>  
          </div>  
        </div>  
      </div>  
    </header>  
  );  
}  