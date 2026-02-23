export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import Link from 'next/link';  
import { getSupabaseServerClient } from '@/lib/supabaseServer';
  
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
};
  
type SortOption = 'newest' | 'price_low' | 'price_high';  
type AgeGroupFilter = 'baby' | 'toddler' | 'kid' | undefined;
  
function monthsInRangeInclusive(min: number, max: number) {  
  const out: number[] = [];  
  for (let m = min; m <= max; m++) out.push(m);  
  return out;  
}
  
function monthsForAgeGroup(ageGroup: Exclude<AgeGroupFilter, undefined>) {  
  if (ageGroup === 'baby') return monthsInRangeInclusive(0, 11);  
  if (ageGroup === 'toddler') return monthsInRangeInclusive(12, 47);  
  return monthsInRangeInclusive(48, 191);  
}
  
async function getProducts(  
  sort: SortOption,  
  ageGroup?: AgeGroupFilter,  
  gender?: string,  
  productType?: string,
  partywear?: boolean,
  bestsellerOnly?: boolean // Add this param
): Promise<Product[]> {  
  const supabase = await getSupabaseServerClient();
  
  let query = supabase  
    .from('products')  
    .select('id, name, slug, description, price_cents, currency, image_url, created_at, age_months, gender, product_type, is_partywear, is_bestseller')  
    .eq('is_active', true);
  
  // --- 1. FILTERING ---
  if (partywear) query = query.eq('is_partywear', true);
  if (bestsellerOnly) query = query.eq('is_bestseller', true);

  if (ageGroup) {  
    const months = monthsForAgeGroup(ageGroup);  
    // @ts-ignore  
    query = query.overlaps('age_months', months);  
  }
  
  if (gender) {  
    // @ts-ignore  
    query = query.overlaps('gender', [gender]);  
  }
  
  if (productType) query = query.eq('product_type', productType);
  
  // --- 2. CRITICAL SORTING LOGIC ---
  // PRIORITY 1: Bestsellers always float to the top (Default behavior)
  query = query.order('is_bestseller', { ascending: false });

  // PRIORITY 2: Secondary Sort (Date or Price)
  if (sort === 'price_low') query = query.order('price_cents', { ascending: true });  
  else if (sort === 'price_high') query = query.order('price_cents', { ascending: false });  
  else query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {  
    console.error('Error loading products:', error.message);  
    return [];  
  }
  
  return (data || []) as unknown as Product[];  
}
  
function formatPrice(price_cents: number, currency: string) {  
  const amount = price_cents / 100;  
  if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`;  
  return `${amount.toFixed(2)} ${currency}`;  
}

export default function ShopPage(props: {  
  searchParams: Promise<{ sort?: string; ageGroup?: string; gender?: string; type?: string; partywear?: string }>;  
}) {  
  return (
    <div className="py-2">  
      <div className="mb-8">  
        <h1 className="text-3xl font-serif italic text-[#4b3b33] sm:text-4xl">  
          Shop all pieces  
        </h1>  
        <p className="mt-2 text-sm text-[#7c675b] font-light tracking-wide">  
          Curated elegance for every milestone.
        </p>  
      </div>

      <Suspense fallback={<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 opacity-50">Loading collection...</div>}>
        <ShopList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function ShopList({ searchParams }: { 
  searchParams: Promise<{ sort?: string; ageGroup?: string; gender?: string; type?: string; partywear?: string; bestseller?: string }> 
}) {
  const sp = await searchParams;
  
  const sortParam = (sp.sort as SortOption) || 'newest';  
  const ageGroup = (sp.ageGroup as AgeGroupFilter) || undefined;  
  const gender = sp.gender || undefined;  
  const type = sp.type || undefined;  
  const isPartywear = sp.partywear === 'true'; 
  const isBestsellerOnly = sp.bestseller === 'true'; // Add this
  
  // Pass the new argument here
  const products = await getProducts(sortParam, ageGroup, gender, type, isPartywear, isBestsellerOnly);
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-serif italic text-[#4b3b33]">No pieces match these filters yet.</p>
        <p className="text-sm text-[#a27b6a]">Try clearing your selection to see more.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">  
      {products.map((product) => (  
        <article  
          key={product.id}  
          className="group flex flex-col"
        >  
          <Link href={`/product/${product.slug}`} className="flex flex-col space-y-4"> 
            {/* PORTRAIT IMAGE CONTAINER */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#f4e3d7]/30 flex items-center justify-center border border-[#ead8cd]/50 transition-all duration-700 group-hover:shadow-xl group-hover:shadow-[#947460]/10">
              
              {/* Badge for Partywear */}
              {product.is_partywear && (
                <div className="absolute left-3 top-3 z-10 rounded-full bg-[#4b3b33] px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                  Partywear
                </div>
              )}
              
              {product.image_url ? (  
                <img  
                  src={product.image_url}  
                  alt={product.name}  
                  /* object-contain ensures the whole dress/outfit shows */
                  className="h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"  
                />  
              ) : (  
                <div className="flex h-full items-center justify-center px-4 text-center text-[10px] uppercase tracking-widest text-[#7c675b]/50">  
                  Coming Soon  
                </div>  
              )}  
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-medium text-[#4b3b33] group-hover:text-[#a27b6a] transition-colors">
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