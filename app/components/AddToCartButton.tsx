'use client';
  
import { useState } from 'react';  
import { useCartStore } from '@/app/store/cartStore';
  
type AddToCartButtonProps = {  
  product: {  
    id: string;  
    name: string;  
    slug: string;  
    image_url: string | null;  
    price_cents: number;  
    currency: string;  
  };  
};
  
export default function AddToCartButton({ product }: AddToCartButtonProps) {  
  const addItem = useCartStore((s) => s.addItem);  
  const [status, setStatus] = useState<'idle' | 'added' | 'error'>('idle');  
  const [message, setMessage] = useState<string | null>(null);
  
  const handleAddToCart = () => {  
    setMessage(null);
  
    const { ok, reason } = addItem({  
      id: product.id,  
      name: product.name,  
      slug: product.slug,  
      image_url: product.image_url,  
      price_cents: product.price_cents,  
      currency: product.currency,  
    });
  
    if (!ok) {  
      // Hit 5-product limit  
      setStatus('error');  
      setMessage(reason ?? 'Unable to add this item to cart.');  
      return;  
    }
  
    setStatus('added');  
    setMessage('Added to cart.');  
    // Optional: reset back to idle after a short delay  
    setTimeout(() => {  
      setStatus('idle');  
      setMessage(null);  
    }, 2000);  
  };
  
  return (  
    <div className="space-y-1">  
      <button  
        type="button"  
        onClick={handleAddToCart}  
        className="w-full rounded-full bg-[#4b3b33] px-4 py-2 text-sm font-medium text-[#fdf7f2] hover:bg-[#3a2e29]"  
      >  
        {status === 'added' ? 'Added ✓' : 'Add to cart'}  
      </button>
  
      {message && (  
        <p  
          className={`text-[11px] ${  
            status === 'error' ? 'text-[#a85454]' : 'text-[#4b3b33]'  
          }`}  
        >  
          {message}  
        </p>  
      )}  
    </div>  
  );  
}  