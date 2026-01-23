import Link from 'next/link';  
import AddToCartButton from '../AddToCartButton';
  
type Product = {  
  id: string;  
  name: string;  
  slug: string;  
  description: string | null;  
  price_cents: number;  
  currency: string;  
  image_url: string | null;  
};
  
function formatPrice(price_cents: number, currency: string) {  
  const amount = price_cents / 100;  
  if (currency === 'INR') return `₹${amount.toFixed(2)}`;  
  return `${amount.toFixed(2)} ${currency}`;  
}
  
export default function ShopSection({ products }: { products: Product[] }) {  
  return (  
    <section id="shop" className="bg-slate-950 px-4 py-14 text-slate-50">  
      <div className="mx-auto max-w-6xl">  
        <header className="mb-8 flex flex-col items-center justify-between gap-3 sm:flex-row">  
          <div>  
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">  
              Shop  
            </p>  
            <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">  
              Pastel pieces ready for their next story.  
            </h2>  
          </div>  
          <p className="max-w-md text-sm text-slate-400">  
            Browse our current drop of soft tees, sets, dresses and more. New  
            pieces land here first.  
          </p>  
        </header>
  
        {products.length === 0 ? (  
          <p className="text-slate-400">  
            No products available yet. Add some in Supabase.  
          </p>  
        ) : (  
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">  
            {products.map((product) => (  
              <article  
                key={product.id}  
                className="flex flex-col rounded-xl bg-slate-900/70 p-4 shadow-sm ring-1 ring-slate-800"  
              >  
                <Link href={`/product/${product.slug}`}>  
                  <div className="mb-3 h-52 overflow-hidden rounded-lg bg-slate-800">  
                    {product.image_url ? (  
                      // eslint-disable-next-line @next/next/no-img-element  
                      <img  
                        src={product.image_url}  
                        alt={product.name}  
                        className="h-full w-full object-cover"  
                      />  
                    ) : (  
                      <div className="flex h-full items-center justify-center text-slate-600">  
                        No image  
                      </div>  
                    )}  
                  </div>
  
                  <h3 className="text-base font-semibold">{product.name}</h3>
  
                  {product.description && (  
                    <p className="mt-1 flex-1 text-xs text-slate-400 line-clamp-2">  
                      {product.description}  
                    </p>  
                  )}  
                </Link>
  
                <div className="mt-4 flex items-center justify-between">  
                  <span className="text-sm font-semibold text-emerald-300">  
                    {formatPrice(product.price_cents, product.currency)}  
                  </span>  
                  <AddToCartButton product={product} />  
                </div>  
              </article>  
            ))}  
          </div>  
        )}  
      </div>  
    </section>  
  );  
}  