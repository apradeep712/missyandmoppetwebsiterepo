import Link from 'next/link';  
import { getSupabaseServerClient } from '@/lib/supabaseServer';  
import AddToCartButton from '../components/AddToCartButton';  
import HomeHeader from '../components/HomeHeader';
  
type Product = {  
  id: string;  
  name: string;  
  slug: string;  
  description: string | null;  
  price_cents: number;  
  currency: string;  
  image_url: string | null;  
  created_at: string;  
};
  
type SortOption = 'newest' | 'price_low' | 'price_high';  
type AgeGroupFilter = 'baby' | 'toddler' | 'kid' | undefined;
  
async function getProducts(  
  sort: SortOption,  
  ageGroup?: AgeGroupFilter  
): Promise<Product[]> {  
  const supabase = await getSupabaseServerClient();
  
  let query = supabase  
    .from('products')  
    .select(  
      'id, name, slug, description, price_cents, currency, image_url, created_at, age_buckets'  
    )  
    .eq('is_active', true);
  
  // Age group filter using age_buckets  
  if (ageGroup) {  
    const babyIds = ['0-3m', '3-6m', '6-12m'];  
    const toddlerIds = ['12-18m', '18-24m', '2-3y', '3-4y'];  
    const kidIds = [  
      '4-5y',  
      '5-6y',  
      '6-7y',  
      '7-8y',  
      '8-9y',  
      '9-10y',  
      '11-12y',  
      '12-13y',  
      '13-14y',  
      '14-15y',  
      '15-16y',  
    ];
  
    let ids: string[] = [];  
    if (ageGroup === 'baby') ids = babyIds;  
    if (ageGroup === 'toddler') ids = toddlerIds;  
    if (ageGroup === 'kid') ids = kidIds;
  
    if (ids.length > 0) {  
      // ANY overlap between product.age_buckets and selected group  
      // @ts-ignore - Supabase JS types don't include overlaps yet  
      query = query.overlaps('age_buckets', ids);  
    }  
  }
  
  if (sort === 'price_low') {  
    query = query.order('price_cents', { ascending: true });  
  } else if (sort === 'price_high') {  
    query = query.order('price_cents', { ascending: false });  
  } else {  
    query = query.order('created_at', { ascending: false });  
  }
  
  const { data, error } = await query;
  
  if (error) {  
    console.error('Error loading products for shop:', error.message);  
    return [];  
  }
  
  return (data || []) as Product[];  
}
  
function formatPrice(price_cents: number, currency: string) {  
  const amount = price_cents / 100;  
  if (currency === 'INR') return `₹${amount.toFixed(2)}`;  
  return `${amount.toFixed(2)} ${currency}`;  
}
  
export default async function ShopPage(props: {  
  searchParams: Promise<{ sort?: string; ageGroup?: string }>;  
}) {  
  const sp = await props.searchParams;  
  const sortParam = (sp.sort as SortOption) || 'newest';  
  const ageGroup = (sp.ageGroup as AgeGroupFilter) || undefined;
  
  const products = await getProducts(sortParam, ageGroup);
  
  return (  
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33]">  
      <HomeHeader />
  
      <div className="mx-auto max-w-6xl px-4 py-8">  
        {/* Title + controls */}  
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">  
          <div>  
            <h1 className="text-2xl font-semibold text-[#4b3b33] sm:text-3xl">  
              Shop all pieces  
            </h1>  
            <p className="mt-1 text-sm text-[#7c675b]">  
              Browse the full Missy &amp; Mopet collection. Filter by age or  
              sort how you like.  
            </p>  
          </div>
  
          {/* Sort + Age filters */}  
          <div className="flex flex-wrap gap-3 text-xs sm:text-sm">  
            {/* Sort */}  
            <div className="flex items-center gap-2">  
              <span className="text-[#a07d68]">Sort</span>  
              <div className="inline-flex overflow-hidden rounded-full border border-[#ead8cd] bg-white/80 text-xs">  
                <ShopSortLink label="Newest" value="newest" current={sortParam} />  
                <ShopSortLink  
                  label="Price ↑"  
                  value="price_low"  
                  current={sortParam}  
                />  
                <ShopSortLink  
                  label="Price ↓"  
                  value="price_high"  
                  current={sortParam}  
                />  
              </div>  
            </div>
  
            {/* Age */}  
            <div className="flex items-center gap-2">  
              <span className="text-[#a07d68]">Age</span>  
              <div className="inline-flex overflow-hidden rounded-full border border-[#ead8cd] bg-white/80 text-xs">  
                <AgeChip  
                  label="All"  
                  value=""  
                  current={ageGroup}  
                  sort={sortParam}  
                />  
                <AgeChip  
                  label="Baby"  
                  value="baby"  
                  current={ageGroup}  
                  sort={sortParam}  
                />  
                <AgeChip  
                  label="Toddler"  
                  value="toddler"  
                  current={ageGroup}  
                  sort={sortParam}  
                />  
                <AgeChip  
                  label="Kids"  
                  value="kid"  
                  current={ageGroup}  
                  sort={sortParam}  
                />  
              </div>  
            </div>  
          </div>  
        </div>
  
        {/* Products grid */}  
        {products.length === 0 ? (  
          <p className="text-sm text-[#7c675b]">  
            No products match these filters yet.  
          </p>  
        ) : (  
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">  
            {products.map((product) => (  
              <article  
                key={product.id}  
                className="flex flex-col rounded-3xl border border-[#ead8cd] bg-white/85 p-4 shadow-[0_12px_32px_rgba(148,116,96,0.18)]"  
              >  
                <Link href={`/product/${product.slug}`}>  
                  <div className="mb-3 h-52 overflow-hidden rounded-2xl bg-[#f4e3d7]">  
                    {product.image_url ? (  
                      // eslint-disable-next-line @next/next/no-img-element  
                      <img  
                        src={product.image_url}  
                        alt={product.name}  
                        className="h-full w-full object-cover"  
                      />  
                    ) : (  
                      <div className="flex h-full items-center justify-center px-4 text-center text-xs text-[#7c675b]">  
                        Product image coming soon  
                      </div>  
                    )}  
                  </div>
  
                  <h2 className="text-base font-semibold text-[#4b3b33]">  
                    {product.name}  
                  </h2>
  
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
                  <AddToCartButton product={product} />  
                </div>  
              </article>  
            ))}  
          </div>  
        )}  
      </div>  
    </main>  
  );  
}
  
function ShopSortLink({  
  label,  
  value,  
  current,  
}: {  
  label: string;  
  value: SortOption;  
  current: SortOption;  
}) {  
  const isActive = current === value;  
  const base =  
    'px-3 py-1.5 text-[11px] sm:text-xs border-r border-[#ead8cd] last:border-r-0';  
  const active = 'bg-[#4b3b33] text-[#fdf7f2]';  
  const inactive = 'bg-white/0 text-[#7c675b] hover:bg-[#f4e3d7]';
  
  return (  
    <Link  
      href={`/shop?sort=${value}`}  
      className={`${base} ${isActive ? active : inactive}`}  
    >  
      {label}  
    </Link>  
  );  
}
  
function AgeChip({  
  label,  
  value,  
  current,  
  sort,  
}: {  
  label: string;  
  value: string;  
  current?: string;  
  sort: SortOption;  
}) {  
  const isActive = (current || '') === value;  
  const base =  
    'px-3 py-1.5 text-[11px] sm:text-xs border-r border-[#ead8cd] last:border-r-0';  
  const active = 'bg-[#f4e3d7] text-[#4b3b33]';  
  const inactive = 'bg-white/0 text-[#7c675b] hover:bg-[#fce8dd]';
  
  const href =  
    value === ''  
      ? `/shop?sort=${sort}`  
      : `/shop?sort=${sort}&ageGroup=${encodeURIComponent(value)}`;
  
  return (  
    <Link href={href} className={`${base} ${isActive ? active : inactive}`}>  
      {label}  
    </Link>  
  );  
}  