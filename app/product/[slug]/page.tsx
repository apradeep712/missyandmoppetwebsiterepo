import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import HomeHeader from '@/app/components/HomeHeader';
import ProductActionsClient from './ProductActionsClient';

// --- Logic (Unchanged) ---
type Product = { id: string; name: string; slug: string; description: string | null; price_cents: number; currency: string; image_url: string | null; created_at: string; age_buckets: string[] | null; age_months: number[] | null; };
type ProductImageRow = { id: string; url: string; sort_order: number; alt_text: string | null; created_at: string; };

async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.from('products').select('id, name, slug, description, price_cents, currency, image_url, created_at, age_months').eq('slug', slug).eq('is_active', true).maybeSingle();
  if (error) return null;
  return data as Product | null;
}

async function getProductGallery(productId: string): Promise<ProductImageRow[]> {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.from('product_images').select('url').eq('product_id', productId).order('sort_order', { ascending: true });
  return (data ?? []) as ProductImageRow[];
}

async function getSuggestedProducts(currentId: string) {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.from('products').select('id, name, slug, description, price_cents, currency, image_url, created_at').eq('is_active', true).neq('id', currentId).order('created_at', { ascending: false }).limit(4);
  return (data || []);
}

function formatPrice(price_cents: number, currency: string) {
  const amount = price_cents / 100;
  return currency === 'INR' ? `₹${amount.toLocaleString('en-IN')}` : `${amount.toFixed(2)} ${currency}`;
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [suggested, gallery] = await Promise.all([
    getSuggestedProducts(product.id),
    getProductGallery(product.id),
  ]);

  const imageUrls = [product.image_url, ...gallery.map(g => g.url)].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[#FDFBF9] text-[#4B3B33] font-sans antialiased">
      <HomeHeader />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:items-start">
          
          {/* LEFT: MINIMAL PRODUCT DETAILS (Sticky) */}
          <section className="lg:col-span-5 lg:sticky lg:top-32 space-y-12 order-2 lg:order-1">
            <div className="space-y-4">
              <nav className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A07D68]/50">
                <Link href="/shop" className="hover:text-[#A07D68]">Collection</Link>
                <span className="mx-2">/</span>
                <span className="text-[#A07D68]">{product.name}</span>
              </nav>

              <h1 className="text-4xl md:text-5xl font-serif italic leading-tight text-[#4B3B33] tracking-tight">
                {product.name}
              </h1>
              
              <p className="text-2xl font-light text-[#A07D68]">
                {formatPrice(product.price_cents, product.currency)}
              </p>
            </div>

            <div className="border-l-2 border-[#EAD8CD] pl-6 py-2">
              <p className="text-base leading-relaxed text-[#7C675B] italic font-light">
                &ldquo;{product.description || "Thoughtfully designed for the little humans in your life."}&rdquo;
              </p>
            </div>

            <div className="pt-4">
               <ProductActionsClient 
                  product={{
                    ...product,
                    age_months: product.age_months,
                    age_buckets: product.age_buckets
                  }} 
                />
            </div>

            <div className="pt-10 border-t border-[#EAD8CD]/60">
              <div className="grid grid-cols-3 gap-4">
                {['Pure Cotton', 'Try-at-Home', 'Artisan Made'].map((text) => (
                  <div key={text} className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#A07D68]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT: CLEAN VERTICAL GALLERY */}
          <section className="lg:col-span-7 space-y-8 order-1 lg:order-2">
            <div className="flex w-full gap-4 overflow-x-auto lg:flex-col lg:overflow-visible no-scrollbar snap-x snap-mandatory">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="w-[85vw] flex-shrink-0 snap-center lg:w-full">
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#F4E3D7]/30">
                    <img 
                      src={url} 
                      alt={`${product.name} - ${idx}`} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- SUGGESTED PRODUCTS SECTION --- */}
        {suggested.length > 0 && (
          <section className="mt-32 pt-20 border-t border-[#EAD8CD]/60">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="text-2xl md:text-3xl font-serif italic tracking-tight">You may also adore</h2>
              <Link href="/shop" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A07D68] border-b border-[#A07D68]/30 pb-1">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {suggested.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group space-y-5">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[#F4E3D7]/20 border border-[#EAD8CD]/40 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-[#947460]/10">
                    {p.image_url ? (
                      <img 
                        src={p.image_url} 
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        alt={p.name} 
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-widest text-[#A07D68]/40">
                        Coming Soon
                      </div>
                    )}
                  </div>
                  <div className="px-1 text-center lg:text-left">
                    <h3 className="text-sm font-medium text-[#4B3B33] group-hover:text-[#A07D68] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-sm text-[#A07D68] mt-1 font-light">
                      {formatPrice(p.price_cents, p.currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
}