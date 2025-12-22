import Link from 'next/link';  
import { notFound } from 'next/navigation';  
import { getSupabaseServerClient } from '@/lib/supabaseServer';  
import AddToCartButton from '@/app/components/AddToCartButton';  
import HomeHeader from '@/app/components/HomeHeader';  
import { AGE_BUCKETS } from '@/lib/ageBuckets';  
import TryAtHomeButtonClient from '@/app/components/TryAtHomeButtonClient';
  
type Product = {  
  id: string;  
  name: string;  
  slug: string;  
  description: string | null;  
  price_cents: number;  
  currency: string;  
  image_url: string | null;  
  created_at: string;  
  age_buckets: string[] | null;  
};
  
async function getProductBySlug(slug: string): Promise<Product | null> {  
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase  
    .from('products')  
    .select(  
      'id, name, slug, description, price_cents, currency, image_url, created_at, age_buckets'  
    )  
    .eq('slug', slug)  
    .eq('is_active', true)  
    .maybeSingle();
  
  if (error) {  
    console.error('Error loading product:', error.message);  
    return null;  
  }
  
  return data as Product | null;  
}
  
async function getSuggestedProducts(currentId: string): Promise<Product[]> {  
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase  
    .from('products')  
    .select(  
      'id, name, slug, description, price_cents, currency, image_url, created_at'  
    )  
    .eq('is_active', true)  
    .neq('id', currentId)  
    .order('created_at', { ascending: false })  
    .limit(4);
  
  if (error) {  
    console.error('Error loading suggested products:', error.message);  
    return [];  
  }
  
  return (data || []) as Product[];  
}
  
function formatPrice(price_cents: number, currency: string) {  
  const amount = price_cents / 100;  
  if (currency === 'INR') return `₹${amount.toFixed(2)}`;  
  return `${amount.toFixed(2)} ${currency}`;  
}
  
export default async function ProductPage(props: {  
  params: Promise<{ slug: string }>;  
}) {  
  const { slug } = await props.params;
  
  const product = await getProductBySlug(slug);  
  if (!product) {  
    notFound();  
  }
  
  const suggested = await getSuggestedProducts(product.id);
  
  const availableAgeBuckets = product.age_buckets  
    ? AGE_BUCKETS.filter((b) => product.age_buckets!.includes(b.id))  
    : [];
  
  return (  
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33]">  
      <HomeHeader />
  
      <div className="mx-auto max-w-6xl px-4 py-8">  
        {/* Breadcrumb */}  
        <div className="mb-4 text-xs text-[#a07d68]">  
          <Link href="/" className="hover:underline">  
            Home  
          </Link>{' '}  
          <span className="mx-1">/</span>  
          <Link href="/shop" className="hover:underline">  
            Shop  
          </Link>{' '}  
          <span className="mx-1">/</span>  
          <span>{product.name}</span>  
        </div>
  
        <div className="grid gap-8 lg:grid-cols-[1.1fr,1fr]">  
          {/* Left: images */}  
          <section className="space-y-4">  
            <div className="overflow-hidden rounded-3xl border border-[#ead8cd] bg-[#f4e3d7] shadow-[0_20px_60px_rgba(148,116,96,0.25)]">  
              {product.image_url ? (  
                // eslint-disable-next-line @next/next/no-img-element  
                <img  
                  src={product.image_url}  
                  alt={product.name}  
                  className="h-full w-full object-cover"  
                />  
              ) : (  
                <div className="flex h-80 items-center justify-center px-6 text-center text-sm text-[#7c675b]">  
                  Product image coming soon.  
                </div>  
              )}  
            </div>  
          </section>
  
          {/* Right: details */}  
          <section className="space-y-6">  
            <div>  
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8927c]">  
                Pastel piece  
              </p>  
              <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">  
                {product.name}  
              </h1>  
            </div>
  
            {/* Price */}  
            <div className="space-y-1">  
              <p className="text-lg font-semibold text-[#4b3b33]">  
                {formatPrice(product.price_cents, product.currency)}  
              </p>  
            </div>
  
            {/* Available for ages */}  
            {availableAgeBuckets.length > 0 && (  
              <div className="space-y-2">  
                <p className="text-xs font-medium text-[#7c675b]">  
                  Available for  
                </p>  
                <div className="flex flex-wrap gap-2">  
                  {availableAgeBuckets.map((b) => (  
                    <span  
                      key={b.id}  
                      className="rounded-full border border-[#ead8cd] bg-white px-3 py-1.5 text-xs text-[#4b3b33]"  
                    >  
                      {b.label}  
                    </span>  
                  ))}  
                </div>  
              </div>  
            )}
  
            {product.description && (  
              <p className="text-sm text-[#7c675b]">{product.description}</p>  
            )}
  
            {/* Actions: Add to cart / Try at home */}  
            <div className="space-y-4">  
              <div className="space-y-3">  
                <AddToCartButton product={{  
    id: product.id,  
    name: product.name,  
    slug: product.slug,  
    image_url: product.image_url,  
    price_cents: product.price_cents,  
    currency: product.currency,  
  }}   />  
                {/* You can add a Buy now button here later if needed */}  
              </div>
  
              <TryAtHomeButtonClient  
                product={{  
                  id: product.id,  
                  name: product.name,  
                  slug: product.slug,  
                  image_url: product.image_url,  
                  price_cents: product.price_cents,  
                  currency: product.currency,  
                }}  
              />  
            </div>
  
            {/* Size & fit / fabric details sections (placeholders) */}  
            <div className="space-y-3 pt-2 text-sm">  
              <div>  
                <h2 className="text-sm font-semibold text-[#4b3b33]">  
                  Size &amp; fit  
                </h2>  
                <p className="mt-1 text-xs text-[#7c675b]">  
                  Pick the age that matches your little one. If you&apos;re  
                  between ages, we recommend sizing up for longer wear.  
                </p>  
              </div>  
              <div>  
                <h2 className="text-sm font-semibold text-[#4b3b33]">  
                  Fabric &amp; care  
                </h2>  
                <p className="mt-1 text-xs text-[#7c675b]">  
                  Soft, breathable cotton in gentle pastels. Machine wash on  
                  delicate with like colours. Dry in shade.  
                </p>  
              </div>  
            </div>  
          </section>  
        </div>
  
        {/* Suggested products */}  
        {suggested.length > 0 && (  
          <section className="mt-10 border-t border-[#ead8cd] pt-6">  
            <h2 className="mb-4 text-sm font-semibold text-[#4b3b33]">  
              You might also like  
            </h2>  
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">  
              {suggested.map((p) => (  
                <Link  
                  key={p.id}  
                  href={`/product/${p.slug}`}  
                  className="group flex flex-col rounded-2xl border border-[#ead8cd] bg-white/90 p-3 shadow-[0_10px_26px_rgba(148,116,96,0.18)]"  
                >  
                  <div className="mb-2 h-36 overflow-hidden rounded-2xl bg-[#f4e3d7]">  
                    {p.image_url ? (  
                      // eslint-disable-next-line @next/next/no-img-element  
                      <img  
                        src={p.image_url}  
                        alt={p.name}  
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"  
                      />  
                    ) : (  
                      <div className="flex h-full items-center justify-center px-3 text-center text-[11px] text-[#7c675b]">  
                        Image coming soon  
                      </div>  
                    )}  
                  </div>  
                  <div className="flex-1">  
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b8927c]">  
                      Pastel piece  
                    </p>  
                    <p className="mt-1 text-sm font-semibold text-[#4b3b33]">  
                      {p.name}  
                    </p>  
                  </div>  
                  <p className="mt-2 text-xs font-semibold text-[#4b3b33]">  
                    {formatPrice(p.price_cents, p.currency)}  
                  </p>  
                </Link>  
              ))}  
            </div>  
          </section>  
        )}  
      </div> 
    </main>  
  );  
}  