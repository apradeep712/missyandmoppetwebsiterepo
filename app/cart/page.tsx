'use client';
  
import Link from 'next/link';  
import HomeHeader from '@/app/components/HomeHeader';  
import { useCartStore } from '@/app/store/cartStore';
  
export default function CartPage() {  
  const items = useCartStore((s) => s.items);  
  const removeItem = useCartStore((s) => s.removeItem);  
  const setQuantity = useCartStore((s) => s.setQuantity);  
  const clear = useCartStore((s) => s.clear);
  
  const totalCents = items.reduce(  
    (sum, item) => sum + item.price_cents * item.quantity,  
    0  
  );
  
  return (  
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33]">  
      <HomeHeader />
  
      <div className="mx-auto max-w-4xl px-4 py-8">  
        <h1 className="mb-4 text-2xl font-semibold text-[#4b3b33]">  
          Your cart  
        </h1>
  
        {items.length === 0 ? (  
          <div className="rounded-2xl border border-[#ead8cd] bg-white/90 p-6 text-sm text-[#7c675b]">  
            Your cart is empty.  
            <div className="mt-2">  
              <Link  
                href="/shop"  
                className="text-[#4b3b33] underline underline-offset-4"  
              >  
                Browse products  
              </Link>  
            </div>  
          </div>  
        ) : (  
          <div className="space-y-4">  
            <section className="space-y-3 rounded-2xl border border-[#ead8cd] bg-white/90 p-4">  
              {items.map((item) => (  
                <div  
                  key={item.id}  
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#ead8cd] bg-[#fdf7f2] p-3 text-xs sm:text-sm"  
                >  
                  <div className="flex items-center gap-3">  
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#f4e3d7]">  
                      {item.image_url ? (  
                        // eslint-disable-next-line @next/next/no-img-element  
                        <img  
                          src={item.image_url}  
                          alt={item.name}  
                          className="h-full w-full object-cover"  
                        />  
                      ) : (  
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-[#a07d68]">  
                          No image  
                        </div>  
                      )}  
                    </div>  
                    <div>  
                      <div className="font-medium text-[#4b3b33]">  
                        {item.name}  
                      </div>  
                      <div className="text-[11px] text-[#7c675b]">  
                        {item.currency === 'INR'  
                          ? `₹${(item.price_cents / 100).toFixed(2)}`  
                          : `${(item.price_cents / 100).toFixed(2)} ${  
                              item.currency  
                            }`}  
                      </div>  
                    </div>  
                  </div>
  
                  <div className="flex items-center gap-3">  
                    {/* Quantity controls */}  
                    <div className="flex items-center gap-1">  
                      <button  
                        type="button"  
                        onClick={() => setQuantity(item.id, item.quantity - 1)}  
                        className="h-6 w-6 rounded-full border border-[#ead8cd] text-[12px] text-[#4b3b33]"  
                      >  
                        -  
                      </button>  
                      <span className="w-6 text-center text-[12px]">  
                        {item.quantity}  
                      </span>  
                      <button  
                        type="button"  
                        onClick={() => setQuantity(item.id, item.quantity + 1)}  
                        className="h-6 w-6 rounded-full border border-[#ead8cd] text-[12px] text-[#4b3b33]"  
                      >  
                        +  
                      </button>  
                    </div>
  
                    <button  
                      type="button"  
                      onClick={() => removeItem(item.id)}  
                      className="rounded-full border border-[#f5c2c2] bg-[#fee2e2] px-3 py-1 text-[11px] text-[#a85454] hover:bg-[#fecaca]"  
                    >  
                      Remove  
                    </button>  
                  </div>  
                </div>  
              ))}  
            </section>
  
            <section className="rounded-2xl border border-[#ead8cd] bg-white/90 p-4 text-sm">  
              <div className="flex items-center justify-between">  
                <span className="font-medium text-[#4b3b33]">Subtotal</span>  
                <span className="font-semibold text-[#4b3b33]">  
                  ₹{(totalCents / 100).toFixed(2)}  
                </span>  
              </div>  
              <p className="mt-2 text-[11px] text-[#7c675b]">  
                Taxes and shipping will be calculated at checkout.  
              </p>
  
              <div className="mt-4 flex flex-wrap items-center gap-3">  
                <button  
                  type="button"  
                  className="rounded-full bg-[#4b3b33] px-5 py-2 text-sm font-medium text-[#fdf7f2] hover:bg-[#3a2e29]"  
                >  
                  Proceed to checkout  
                </button>  
                <button  
                  type="button"  
                  onClick={clear}  
                  className="text-[11px] text-[#a85454] underline underline-offset-4"  
                >  
                  Clear cart  
                </button>  
              </div>  
            </section>  
          </div>  
        )}  
      </div>  
    </main>  
  );  
}  