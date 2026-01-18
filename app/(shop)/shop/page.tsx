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
  is_partywear: boolean; // Added for completeness
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
  partywear?: boolean // NEW: Added parameter
): Promise<Product[]> {  
  const supabase = await getSupabaseServerClient();
  
  let query = supabase  
    .from('products')  
    .select(  
      'id, name, slug, description, price_cents, currency, image_url, created_at, age_months, gender, product_type, is_partywear'  
    )  
    .eq('is_active', true);
  
  // NEW: Apply Partywear filter
  if (partywear) {
    query = query.eq('is_partywear', true);
  }

  if (ageGroup) {  
    const months = monthsForAgeGroup(ageGroup);  
    // @ts-ignore  
    query = query.overlaps('age_months', months);  
  }
  
  if (gender) {  
    // @ts-ignore  
    query = query.overlaps('gender', [gender]);  
  }
  
  if (productType) {  
    query = query.eq('product_type', productType);  
  }
  
  if (sort === 'price_low') query = query.order('price_cents', { ascending: true });  
  else if (sort === 'price_high') query = query.order('price_cents', { ascending: false });  
  else query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {  
    console.error('Error loading products for shop:', error.message);  
    return [];  
  }
  
  return (data || []) as unknown as Product[];  
}
  
function formatPrice(price_cents: number, currency: string) {  
  const amount = price_cents / 100;  
  if (currency === 'INR') return `₹${amount.toFixed(2)}`;  
  return `${amount.toFixed(2)} ${currency}`;  
}

export default function ShopPage(props: {  
  searchParams: Promise<{ sort?: string; ageGroup?: string; gender?: string; type?: string; partywear?: string }>;  
}) {  
  return (
    <div className="py-2">  
      <div className="mb-6">  
        <h1 className="text-2xl font-semibold text-[#4b3b33] sm:text-3xl">  
          Shop all pieces  
        </h1>  
        <p className="mt-1 text-sm text-[#7c675b]">  
          Use the Menu to filter by gender, age, and product type.  
        </p>  
      </div>

      <Suspense fallback={<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 opacity-50">Loading products...</div>}>
        <ShopList searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function ShopList({ searchParams }: { 
  searchParams: Promise<{ sort?: string; ageGroup?: string; gender?: string; type?: string; partywear?: string }> 
}) {
  const sp = await searchParams;
  
  const sortParam = (sp.sort as SortOption) || 'newest';  
  const ageGroup = (sp.ageGroup as AgeGroupFilter) || undefined;  
  const gender = sp.gender || undefined;  
  const type = sp.type || undefined;  
  const isPartywear = sp.partywear === 'true'; // NEW: Parse the boolean from string
  
  // NEW: Passed the isPartywear boolean to the fetcher
  const products = await getProducts(sortParam, ageGroup, gender, type, isPartywear);

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-serif italic text-[#4b3b33]">No pieces match these filters yet.</p>
        <p className="text-sm text-[#a27b6a]">Try clearing your selection to see more.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">  
      {products.map((product) => (  
        <article  
          key={product.id}  
          className="flex flex-col rounded-3xl border border-[#ead8cd] bg-white/85 p-4 shadow-[0_12px_32px_rgba(148,116,96,0.18)]"  
        >  
          <Link href={`/product/${product.slug}`}> 
            <div className="relative mb-3 h-52 overflow-hidden rounded-2xl bg-[#f4e3d7]">
              {/* Badge for Partywear */}
              {product.is_partywear && (
                <div className="absolute left-3 top-3 z-10 rounded-full bg-[#4b3b33] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  Partywear
                </div>
              )}
              
              {product.image_url ? (  
                // eslint-disable-next-line @next/next/no-img-element  
                <img  
                  src={product.image_url}  
                  alt={product.name}  
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"  
                />  
              ) : (  
                <div className="flex h-full items-center justify-center px-4 text-center text-xs text-[#7c675b]">  
                  Product image coming soon  
                </div>  
              )}  
            </div>

            <h2 className="text-base font-semibold text-[#4b3b33]">{product.name}</h2>

            {product.description && (  
              <p className="mt-1 flex-1 text-xs text-[#7c675b] line-clamp-3">  
                {product.description}  
              </p>  
            )}  
          </Link>

          <div className="mt-4 flex items-center justify-between">  
            <span className="text-sm font-semibold text-[#4b3b33]">  
              {formatPrice(product.price_cents, product.currency)}  
            </span>  
          </div>  
        </article>  
      ))}  
    </div>
  );
}