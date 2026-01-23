'use client';
  
import { useMemo, useState } from 'react';  
import { useTryAtHomeStore } from '@/app/store/tryAtHomeStore';
  
type TryAtHomeButtonClientProps = {  
  product: {  
    id: string;  
    name: string;  
    slug: string;  
    image_url: string | null;  
    price_cents: number;  
    currency: string;  
  };  
};
  
export default function TryAtHomeButtonClient({ product }: TryAtHomeButtonClientProps) {  
  const items = useTryAtHomeStore((s) => s.items);  
  const addItem = useTryAtHomeStore((s) => s.addItem);
  
  const alreadyAdded = useMemo(  
    () => items.some((i) => i.id === product.id),  
    [items, product.id]  
  );
  
  const [message, setMessage] = useState<string | null>(null);  
  const [error, setError] = useState<string | null>(null);
  
  const handleClick = () => {  
    setMessage(null);  
    setError(null);
  
    const result = addItem({  
      id: product.id,  
      name: product.name,  
      slug: product.slug,  
      image_url: product.image_url,  
      price_cents: product.price_cents,  
      currency: product.currency,  
    });
  
    if (result.ok) setMessage(alreadyAdded ? 'Already in your selection.' : 'Added to Try at home.');  
    else if (result.reason) setError(result.reason);  
  };
  
  return (  
    <div className="space-y-2">  
      <button  
        type="button"  
        onClick={handleClick}  
        disabled={alreadyAdded}  
        className={[  
          'w-full rounded-full border px-4 py-2 text-sm font-medium transition',  
          alreadyAdded  
            ? 'cursor-not-allowed border-[#ead8cd] bg-[#fdf2e9] text-[#7c675b]'  
            : 'border-[#ead8cd] bg-white text-[#4b3b33] hover:bg-[#fdf2e9]',  
        ].join(' ')}  
      >  
        {alreadyAdded ? 'Added to Try at home' : 'Try at home'}  
      </button>
  
      {message && <p className="text-[11px] text-emerald-600">{message}</p>}  
      {error && <p className="text-[11px] text-[#a85454]">{error}</p>}  
    </div>  
  );  
}  