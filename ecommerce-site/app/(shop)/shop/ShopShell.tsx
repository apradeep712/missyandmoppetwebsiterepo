'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AgeGroupFilter = 'baby' | 'toddler' | 'kid';
type GenderFilter = 'boys' | 'girls';
type SortOption = 'newest' | 'price_low' | 'price_high';

type StorefrontCollection =
  | 'clothing'
  | 'newborn'
  | 'partywear'
  | 'accessories'
  | 'footwear';

function buildHref(pathname: string, sp: URLSearchParams, patch: Record<string, string | null>) {
  const next = new URLSearchParams(sp.toString());

  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === '') next.delete(k);
    else next.set(k, v);
  }

  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function ChipLink({
  href,
  active,
  children,
  disabled,
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
          ${
            active
              ? 'border-[#4b3b33] bg-[#4b3b33] text-[#fdf7f2] shadow-md'
              : 'border-[#ead8cd] bg-transparent text-[#7c675b] hover:border-[#4b3b33] hover:text-[#4b3b33]'
          }
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
  const collection = (sp.get('collection') as StorefrontCollection | null) || null;
  const isBestseller = sp.get('bestseller') === 'true';

  /**
   * Backward compatibility:
   * If an old URL still has ?partywear=true, treat it as partywear active in UI.
   * The new preferred URL is ?collection=partywear.
   */
  const legacyPartywear = sp.get('partywear') === 'true';
  const activeCollection: StorefrontCollection | null = collection || (legacyPartywear ? 'partywear' : null);

  const productTypes = [
    { label: 'T-Shirts', value: 't-shirt' },
    { label: 'Pants', value: 'pants' },
    { label: 'Shorts', value: 'shorts' },
    { label: 'Shirts', value: 'shirt' },
    { label: 'Dresses', value: 'dress' },
    { label: 'Sets', value: 'set' },
    { label: 'Polo', value: 'polo' },
    { label: 'Top', value: 'top' },
    { label: 'Vest', value: 'vest' },
    { label: 'Onesie', value: 'onesie' },
    { label: 'Jumpsuit', value: 'jumpsuit' },
    { label: 'Coat', value: 'coat' },
    { label: 'Romper', value: 'romper' },
    { label: 'Night Suit', value: 'night-suit' },
    { label: 'Blazer', value: 'blazer' },
    { label: 'Hat', value: 'hat' },
    { label: 'Cap', value: 'cap' },
    { label: 'Hair Accessory', value: 'hair-accessory' },
    { label: 'Bag', value: 'bag' },
    { label: 'Socks', value: 'socks' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Sandals', value: 'sandals' },
    { label: 'Booties', value: 'booties' },
  ];

  const storefrontCollections: Array<{
    label: string;
    value: StorefrontCollection;
    description: string;
    icon: string;
  }> = [
    {
      label: 'Clothing',
      value: 'clothing',
      description: 'Everyday outfits and essentials',
      icon: '👕',
    },
    {
      label: 'Newborn',
      value: 'newborn',
      description: 'Soft picks for little babies',
      icon: '🍼',
    },
    {
      label: 'Partywear',
      value: 'partywear',
      description: 'Outfits for celebrations',
      icon: '✨',
    },
    {
      label: 'Accessories',
      value: 'accessories',
      description: 'Finishing touches and extras',
      icon: '🎀',
    },
    {
      label: 'Footwear',
      value: 'footwear',
      description: 'Shoes, sandals and booties',
      icon: '👟',
    },
  ];

  const activeFiltersCount =
    (activeCollection ? 1 : 0) +
    (ageGroup ? 1 : 0) +
    (gender ? 1 : 0) +
    (type ? 1 : 0) +
    (isBestseller ? 1 : 0);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* TOP NAVIGATION BAR */}
      <div className="mb-10 flex items-center justify-between border-b border-[#ead8cd]/40 pb-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-[#4b3b33]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ead8cd] bg-white transition-all group-hover:border-[#4b3b33] group-hover:bg-[#4b3b33] group-hover:text-white">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H18M0 6H18M0 11H18" stroke="currentColor" strokeWidth="1.5" />
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
          href={buildHref(pathname, sp, {
            collection: null,
            partywear: null,
            ageGroup: null,
            gender: null,
            type: null,
            bestseller: null,
          })}
          className="group relative text-xs font-bold uppercase tracking-widest text-[#a27b6a] transition-colors hover:text-[#4b3b33]"
        >
          Clear Filters
          <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#4b3b33] transition-all group-hover:w-full" />
        </Link>
      </div>

      {/* DRAWER SYSTEM */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-[#3f2f28]/40 backdrop-blur-[2px]"
            />

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
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-[#a27b6a]">
                      Curate your Missy & Moppet view
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ead8cd] text-[#4b3b33] transition-colors hover:bg-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="custom-scrollbar flex-1 space-y-10 overflow-y-auto px-8 py-10">
                  {/* STOREFRONT COLLECTION */}
                  <section>
                    <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a27b6a]">
                      Storefront Collection
                    </h3>

                    <div className="space-y-3">
                      <Link
                        href={buildHref(pathname, sp, {
                          collection: null,
                          partywear: null,
                        })}
                        className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all duration-300 group
                          ${
                            !activeCollection
                              ? 'border-[#4b3b33] bg-[#4b3b33] text-[#fdf7f2] shadow-lg shadow-[#4b3b33]/10'
                              : 'border-[#ead8cd] bg-white text-[#4b3b33] hover:border-[#4b3b33]'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-xl">🛍️</span>
                          <div className="text-left">
                            <p className="text-[13px] font-bold uppercase tracking-wider">All Collections</p>
                            <p className={`text-[10px] leading-tight ${!activeCollection ? 'text-[#ead8cd]' : 'text-[#a27b6a]'}`}>
                              Browse the full catalog
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors
                          ${
                            !activeCollection
                              ? 'border-white bg-white text-[#4b3b33]'
                              : 'border-[#ead8cd] text-transparent group-hover:border-[#4b3b33]'
                          }`}
                        >
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M1 4.5L3.5 7L9 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </Link>

                      {storefrontCollections.map((c) => {
                        const active = activeCollection === c.value;

                        return (
                          <Link
                            key={c.value}
                            href={buildHref(pathname, sp, {
                              collection: active ? null : c.value,
                              partywear: null,
                            })}
                            className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all duration-300 group
                              ${
                                active
                                  ? 'border-[#4b3b33] bg-[#4b3b33] text-[#fdf7f2] shadow-lg shadow-[#4b3b33]/10'
                                  : 'border-[#ead8cd] bg-white text-[#4b3b33] hover:border-[#4b3b33]'
                              }`}
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-xl">{c.icon}</span>
                              <div className="text-left">
                                <p className="text-[13px] font-bold uppercase tracking-wider">{c.label}</p>
                                <p className={`text-[10px] leading-tight ${active ? 'text-[#ead8cd]' : 'text-[#a27b6a]'}`}>
                                  {c.description}
                                </p>
                              </div>
                            </div>

                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors
                              ${
                                active
                                  ? 'border-white bg-white text-[#4b3b33]'
                                  : 'border-[#ead8cd] text-transparent group-hover:border-[#4b3b33]'
                              }`}
                            >
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M1 4.5L3.5 7L9 1"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </section>

                  {/* GENDER */}
                  <section>
                    <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a27b6a]">
                      Gender
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      <ChipLink href={buildHref(pathname, sp, { gender: null })} active={!gender}>
                        All
                      </ChipLink>

                      <ChipLink href={buildHref(pathname, sp, { gender: 'boys' })} active={gender === 'boys'}>
                        Boys
                      </ChipLink>

                      <ChipLink href={buildHref(pathname, sp, { gender: 'girls' })} active={gender === 'girls'}>
                        Girls
                      </ChipLink>
                    </div>
                  </section>

                  {/* AGE GROUP */}
                  <section>
                    <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a27b6a]">
                      Age Group
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      <ChipLink href={buildHref(pathname, sp, { ageGroup: null })} active={!ageGroup}>
                        All
                      </ChipLink>

                      <ChipLink href={buildHref(pathname, sp, { ageGroup: 'baby' })} active={ageGroup === 'baby'}>
                        Baby
                      </ChipLink>

                      <ChipLink href={buildHref(pathname, sp, { ageGroup: 'toddler' })} active={ageGroup === 'toddler'}>
                        Toddler
                      </ChipLink>

                      <ChipLink href={buildHref(pathname, sp, { ageGroup: 'kid' })} active={ageGroup === 'kid'}>
                        Kids
                      </ChipLink>
                    </div>
                  </section>

                  {/* PRODUCT TYPE */}
                  <section>
                    <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a27b6a]">
                      Product Type
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      <ChipLink href={buildHref(pathname, sp, { type: null })} active={!type}>
                        All Pieces
                      </ChipLink>

                      {productTypes.map((t) => (
                        <ChipLink
                          key={t.value}
                          href={buildHref(pathname, sp, { type: t.value })}
                          active={type === t.value}
                        >
                          {t.label}
                        </ChipLink>
                      ))}
                    </div>
                  </section>

                  {/* BESTSELLER */}
                  <section>
                    <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a27b6a]">
                      Highlights
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      <ChipLink
                        href={buildHref(pathname, sp, {
                          bestseller: isBestseller ? null : 'true',
                        })}
                        active={isBestseller}
                      >
                        Community Favorites
                      </ChipLink>
                    </div>
                  </section>

                  {/* SORT */}
                  <section className="pb-6">
                    <h3 className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#a27b6a]">
                      Sort By
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {[
                        ['Newest', 'newest'],
                        ['Price ↑', 'price_low'],
                        ['Price ↓', 'price_high'],
                      ].map(([label, value]) => (
                        <ChipLink
                          key={value}
                          href={buildHref(pathname, sp, { sort: value as SortOption })}
                          active={sort === value}
                        >
                          {label}
                        </ChipLink>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="border-t border-[#ead8cd] bg-white/30 p-8">
                  <button
                    type="button"
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

      {/* PAGE CONTENT */}
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