export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

type StorefrontCollection =
  | 'clothing'
  | 'newborn'
  | 'partywear'
  | 'accessories'
  | 'footwear';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  currency: string;
  image_url: string | null;
  created_at: string;
  age_months: number[] | null;
  gender: string[] | null;
  product_type: string | null;
  is_partywear: boolean;
  is_bestseller: boolean;
  collection: StorefrontCollection | null;
};

type SortOption = 'newest' | 'price_low' | 'price_high';
type AgeGroupFilter = 'baby' | 'toddler' | 'kid' | undefined;

type ShopSearchParams = {
  sort?: string;
  ageGroup?: string;
  gender?: string;
  type?: string;
  partywear?: string;
  bestseller?: string;
  collection?: string;
};

function monthsInRangeInclusive(min: number, max: number) {
  const out: number[] = [];

  for (let m = min; m <= max; m++) {
    out.push(m);
  }

  return out;
}

function monthsForAgeGroup(ageGroup: Exclude<AgeGroupFilter, undefined>) {
  if (ageGroup === 'baby') return monthsInRangeInclusive(0, 11);
  if (ageGroup === 'toddler') return monthsInRangeInclusive(12, 47);

  return monthsInRangeInclusive(48, 191);
}

function isValidCollection(value: string | undefined): value is StorefrontCollection {
  return (
    value === 'clothing' ||
    value === 'newborn' ||
    value === 'partywear' ||
    value === 'accessories' ||
    value === 'footwear'
  );
}

function getCollectionLabel(collection: StorefrontCollection | null | undefined) {
  switch (collection) {
    case 'clothing':
      return 'Clothing';
    case 'newborn':
      return 'Newborn';
    case 'partywear':
      return 'Partywear';
    case 'accessories':
      return 'Accessories';
    case 'footwear':
      return 'Footwear';
    default:
      return 'Collection';
  }
}

function getCollectionBadgeClass(collection: StorefrontCollection | null | undefined) {
  switch (collection) {
    case 'newborn':
      return 'bg-[#f9d7df] text-[#7a3d4b]';
    case 'partywear':
      return 'bg-[#4b3b33] text-white';
    case 'accessories':
      return 'bg-[#f3d8a7] text-[#6f4f1d]';
    case 'footwear':
      return 'bg-[#d8eaf5] text-[#31596b]';
    case 'clothing':
    default:
      return 'bg-white/90 text-[#4b3b33]';
  }
}

async function getProducts(
  sort: SortOption,
  ageGroup?: AgeGroupFilter,
  gender?: string,
  productType?: string,
  collection?: StorefrontCollection,
  bestsellerOnly?: boolean
): Promise<Product[]> {
  const supabase = await getSupabaseServerClient();

  let query = supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      description,
      price_cents,
      currency,
      image_url,
      created_at,
      age_months,
      gender,
      product_type,
      is_partywear,
      is_bestseller,
      collection
    `
    )
    .eq('is_active', true);

  // COLLECTION FILTER
  if (collection) {
    query = query.eq('collection', collection);
  }

  // HIGHLIGHT FILTER
  if (bestsellerOnly) {
    query = query.eq('is_bestseller', true);
  }

  // AGE FILTER
  if (ageGroup) {
    const months = monthsForAgeGroup(ageGroup);

    // Supabase/Postgres array overlap
    query = query.overlaps('age_months', months);
  }

  // GENDER FILTER
  if (gender) {
    query = query.overlaps('gender', [gender]);
  }

  // PRODUCT TYPE FILTER
  if (productType) {
    query = query.eq('product_type', productType);
  }

  // SORTING
  // Bestsellers always float to the top.
  query = query.order('is_bestseller', { ascending: false });

  if (sort === 'price_low') {
    query = query.order('price_cents', { ascending: true });
  } else if (sort === 'price_high') {
    query = query.order('price_cents', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error loading products:', error.message);
    return [];
  }

  return (data || []) as Product[];
}

function formatPrice(price_cents: number, currency: string) {
  const amount = price_cents / 100;

  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  return `${amount.toFixed(2)} ${currency}`;
}

function getPageHeading(collection: StorefrontCollection | undefined) {
  switch (collection) {
    case 'clothing':
      return 'Clothing';
    case 'newborn':
      return 'Newborn pieces';
    case 'partywear':
      return 'Partywear';
    case 'accessories':
      return 'Accessories';
    case 'footwear':
      return 'Footwear';
    default:
      return 'Shop all pieces';
  }
}

function getPageSubheading(collection: StorefrontCollection | undefined) {
  switch (collection) {
    case 'clothing':
      return 'Everyday outfits and essentials for little wardrobes.';
    case 'newborn':
      return 'Soft, gentle pieces for the tiniest milestones.';
    case 'partywear':
      return 'Curated celebration outfits for special moments.';
    case 'accessories':
      return 'Finishing touches to complete every look.';
    case 'footwear':
      return 'Shoes, sandals and booties for little steps.';
    default:
      return 'Curated elegance for every milestone.';
  }
}

export default async function ShopPage(props: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const sp = await props.searchParams;

  /**
   * New preferred URL:
   * /shop?collection=partywear
   *
   * Old supported URL:
   * /shop?partywear=true
   */
  const collection = isValidCollection(sp.collection)
    ? sp.collection
    : sp.partywear === 'true'
      ? 'partywear'
      : undefined;

  return (
    <div className="py-2">
      <div className="mb-8">
        <h1 className="text-3xl font-serif italic text-[#4b3b33] sm:text-4xl">
          {getPageHeading(collection)}
        </h1>

        <p className="mt-2 text-sm text-[#7c675b] font-light tracking-wide">
          {getPageSubheading(collection)}
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-8 opacity-50 sm:grid-cols-2 lg:grid-cols-3">
            Loading collection...
          </div>
        }
      >
        <ShopList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function ShopList({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const sp = await searchParams;

  const sortParam = (sp.sort as SortOption) || 'newest';
  const ageGroup = (sp.ageGroup as AgeGroupFilter) || undefined;
  const gender = sp.gender || undefined;
  const type = sp.type || undefined;
  const isBestsellerOnly = sp.bestseller === 'true';

  /**
   * Collection handling:
   * - Prefer ?collection=...
   * - Keep old ?partywear=true support
   */
  const collection = isValidCollection(sp.collection)
    ? sp.collection
    : sp.partywear === 'true'
      ? 'partywear'
      : undefined;

  const products = await getProducts(
    sortParam,
    ageGroup,
    gender,
    type,
    collection,
    isBestsellerOnly
  );

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-serif italic text-[#4b3b33]">
          No pieces match these filters yet.
        </p>

        <p className="text-sm text-[#a27b6a]">
          Try clearing your selection to see more.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article key={product.id} className="group flex flex-col">
          <Link href={`/product/${product.slug}`} className="flex flex-col space-y-4">
            <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#ead8cd]/50 bg-[#f4e3d7]/30 transition-all duration-700 group-hover:shadow-xl group-hover:shadow-[#947460]/10">
              {product.collection && (
                <div
                  className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${getCollectionBadgeClass(
                    product.collection
                  )}`}
                >
                  {getCollectionLabel(product.collection)}
                </div>
              )}

              {product.is_bestseller && (
                <div className="absolute right-3 top-3 z-10 rounded-full bg-[#d28b9c] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                  Favorite
                </div>
              )}

              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-[10px] uppercase tracking-widest text-[#7c675b]/50">
                  Coming Soon
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-medium text-[#4b3b33] transition-colors group-hover:text-[#a27b6a]">
                {product.name}
              </h2>

              <p className="text-sm font-light text-[#a27b6a]">
                {formatPrice(product.price_cents, product.currency)}
              </p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}