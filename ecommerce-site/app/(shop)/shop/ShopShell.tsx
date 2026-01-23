'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AgeGroupFilter = 'baby' | 'toddler' | 'kid';
type GenderFilter = 'boys' | 'girls';
type SortOption = 'newest' | 'price_low' | 'price_high';

function buildHref(pathname: string, sp: URLSearchParams, patch: Record<string, string | null>) {
  const next = new URLSearchParams(sp.toString());
  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === '') next.delete(k);
    else next.set(k, v);
  }
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

// LUXURY COMPONENT: Refined Chip with spring animation
function ChipLink({ 
  href, 
  active, 
  children, 
  disabled 
}: { 
  href: string; 
  active: boolean; 
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Link 
      href={disabled ? '#' : href} 
      className={`relative group ${disabled ? 'cursor-not-allowed' : ''}`}
      onClick={(e) => disabled && e.preventDefault()}
    >
      <motion.div
        whileTap={disabled ? {} : { scale: 0.96 }}
        className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-[13px] tracking-wide transition-all duration-300 border
          ${active 
            ? 'border-[#4b3b33] bg-[#4b3b33] text-[#fdf7f2] shadow-md' 
            : 'border-[#ead8cd] bg-transparent text-[#7c675b] hover:border-[#4b3b33] hover:text-[#4b3b33]'}
          ${disabled ? 'opacity-30 border-[#ead8cd] grayscale' : ''}`}
      >
        {children}
      </motion.div>
    </Link>
  );
}

export default function ShopShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sp = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  const sort = (sp.get('sort') as SortOption) || 'newest';
  const ageGroup = (sp.get('ageGroup') as AgeGroupFilter | null) || null;
  const gender = (sp.get('gender') as GenderFilter | null) || null;
  const type = sp.get('type') || null;
  const isPartywear = sp.get('partywear') === 'true';

  const productTypes = [
    { label: 'T-Shirts', value: 't-shirt' }, { label: 'Pants', value: 'pants' },
    { label: 'Shorts', value: 'shorts' }, { label: 'Shirts', value: 'shirt' },
    { label: 'Dresses', value: 'dress' }, { label: 'Sets', value: 'set' },
    { label: 'Polo', value: 'polo' }, { label: 'Top', value: 'top' },
    { label: 'Vest', value: 'vest' }, { label: 'Onesie', value: 'onesie' },
    { label: 'Jumpsuit', value: 'jumpsuit' }, { label: 'Coat', value: 'coat' },
  ];

  const activeFiltersCount = (ageGroup ? 1 : 0) + (gender ? 1 : 0) + (type ? 1 : 0) + (isPartywear ? 1 : 0);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [open]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* --- TOP NAVIGATION BAR --- */}
      <div className="mb-10 flex items-center justify-between border-b border-[#ead8cd]/40 pb-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-[#4b3b33]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ead8cd] bg-white transition-all group-hover:border-[#4b3b33] group-hover:bg-[#4b3b33] group-hover:text-white">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 1H18M0 6H18M0 11H18" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </div>
          Refine Selection
          {activeFiltersCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d28b9c] text-[10px] text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <Link
          href={buildHref(pathname, sp, { ageGroup: null, gender: null, type: null, partywear: null })}
          className="group relative text-xs font-bold uppercase tracking-widest text-[#a27b6a] transition-colors hover:text-[#4b3b33]"
        >
          Clear Filters
          <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#4b3b33] transition-all group-hover:w-full" />
        </Link>
      </div>

      {/* --- DRAWER SYSTEM --- */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-[#3f2f28]/40 backdrop-blur-[2px]"
            />
            
            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-[70] h-full w-[min(400px,100vw)] bg-[#fdf7f2] shadow-[20px_0_60px_rgba(0,0,0,0.1)]"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-[#ead8cd] px-8 py-8">
                  <div>
                    <h2 className="font-serif text-2xl italic text-[#4b3b33]">Bespoke Filters</h2>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-[#a27b6a]">Curate your Missy & Moppet view</p>
                  </div>
                  <button 
                    onClick={() => setOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ead8cd] text-[#4b3b33] hover:bg-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 custom-scrollbar">
                  
                  {/* --- PARTYWEAR (Main Feature) --- */}
                  <section>
                    <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a27b6a]">Featured Collection</h3>
                    <Link 
                      href={buildHref(pathname, sp, { 
                        partywear: isPartywear ? null : 'true',
                        // Clear specific filters when entering Partywear mode to focus results
                        ageGroup: isPartywear ? ageGroup : null, 
                        gender: isPartywear ? gender : null,
                        type: isPartywear ? type : null
                      })}
                      className={`flex items-center justify-between w-full p-5 rounded-2xl border transition-all duration-300 group
                        ${isPartywear 
                          ? 'bg-[#4b3b33] border-[#4b3b33] text-[#fdf7f2] shadow-lg shadow-[#4b3b33]/10' 
                          : 'bg-white border-[#ead8cd] text-[#4b3b33] hover:border-[#4b3b33]'}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xl">✨</span>
                        <div className="text-left">
                          <p className="text-[13px] font-bold uppercase tracking-wider">Partywear</p>
                          <p className={`text-[10px] leading-tight ${isPartywear ? 'text-[#ead8cd]' : 'text-[#a27b6a]'}`}>Outfits for celebrations</p>
                        </div>
                      </div>
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors 
                        ${isPartywear ? 'bg-white border-white text-[#4b3b33]' : 'border-[#ead8cd] text-transparent group-hover:border-[#4b3b33]'}`}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 4.5L3.5 7L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </Link>
                  </section>

                  {/* --- OTHER FILTERS (Blurred when Partywear is active) --- */}
                  <div className={`space-y-10 transition-all duration-500 ${isPartywear ? 'opacity-40 pointer-events-none filter blur-[1px]' : 'opacity-100'}`}>
                    {/* Category Sections */}
                    {[
                      { title: 'Gender', param: 'gender', options: [['All', null], ['Boys', 'boys'], ['Girls', 'girls']] },
                      { title: 'Age Group', param: 'ageGroup', options: [['All', null], ['Baby', 'baby'], ['Toddler', 'toddler'], ['Kids', 'kid']] },
                    ].map((section) => (
                      <section key={section.title}>
                        <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a27b6a]">{section.title}</h3>
                        <div className="flex flex-wrap gap-3">
                          {section.options.map(([label, val]) => (
                            <ChipLink 
                              key={label as string}
                              href={buildHref(pathname, sp, { [section.param]: val as string })} 
                              active={(section.param === 'gender' ? gender : ageGroup) === val}
                              disabled={isPartywear}
                            >
                              {label}
                            </ChipLink>
                          ))}
                        </div>
                      </section>
                    ))}

                    {/* Product Type */}
                    <section>
                      <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a27b6a]">Product Type</h3>
                      <div className="flex flex-wrap gap-2">
                        <ChipLink href={buildHref(pathname, sp, { type: null })} active={!type} disabled={isPartywear}>All Pieces</ChipLink>
                        {productTypes.map((t) => (
                          <ChipLink key={t.value} href={buildHref(pathname, sp, { type: t.value })} active={type === t.value} disabled={isPartywear}>
                            {t.label}
                          </ChipLink>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Sort (Always available) */}
                  <section className="pb-6">
                    <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a27b6a]">Sort By</h3>
                    <div className="flex flex-wrap gap-3">
                      {[['Newest', 'newest'], ['Price ↑', 'price_low'], ['Price ↓', 'price_high']].map(([label, value]) => (
                        <ChipLink key={value as string} href={buildHref(pathname, sp, { sort: value as SortOption })} active={sort === value}>
                          {label}
                        </ChipLink>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="border-t border-[#ead8cd] p-8 bg-white/30">
                  <button 
                    onClick={() => setOpen(false)}
                    className="w-full rounded-full bg-[#4b3b33] py-4 text-sm font-bold tracking-widest text-[#fdf7f2] shadow-xl shadow-[#4b3b33]/20 transition-transform active:scale-95"
                  >
                    SHOW RESULTS
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page content */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}