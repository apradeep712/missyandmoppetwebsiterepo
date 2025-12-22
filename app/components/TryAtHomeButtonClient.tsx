'use client';
  
import { useState } from 'react';  
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
  
export default function TryAtHomeButtonClient({  
  product,  
}: TryAtHomeButtonClientProps) {  
  const { addItem } = useTryAtHomeStore();  
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
  
    if (result.ok) {  
      setMessage('Added to Try at home selection.');  
    } else if (result.reason) {  
      setError(result.reason);  
    }  
  };
  
  return (  
    <div className="space-y-2">  
      <button  
        type="button"  
        onClick={handleClick}  
        className="w-full rounded-full border border-[#ead8cd] bg-white px-4 py-2 text-sm font-medium text-[#4b3b33] hover:bg-[#fdf2e9]"  
      >  
        Add to Try at home  
      </button>  
      {message && (  
        <p className="text-[11px] text-emerald-600">{message}</p>  
      )}  
      {error && (  
        <p className="text-[11px] text-[#a85454]">{error}</p>  
      )}  
    </div>  
  );  
}  