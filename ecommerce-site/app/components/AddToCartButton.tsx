'use client';
  
import { useState, useMemo } from 'react';  
import { useRouter } from 'next/navigation';  
import { useCartStore } from '@/app/store/cartStore';
  
type AddToCartButtonProps = {  
  className?: string;  
  disabled?: boolean;
  
  product: {  
    id: string;  
    name: string;  
    slug: string;  
    image_url: string | null;  
    price_cents: number;  
    currency: string;
  
    /**  
     * Selected size in months (set this on the product detail page after user picks a size).  
     * Optional so the shop grid can pass a plain product without size selection.  
     */  
    selected_age_months?: number | null;
  
    /**  
     * Optional list of available sizes (months). If present and there are multiple sizes,  
     * the button will route to the product page when no size is selected.  
     */  
    age_months?: number[] | null;  
  };  
};
  
export default function AddToCartButton({  
  product,  
  disabled,  
  className,  
}: AddToCartButtonProps) {  
  const router = useRouter();  
  const addItem = useCartStore((s) => s.addItem);
  
  const [status, setStatus] = useState<'idle' | 'added' | 'error'>('idle');  
  const [message, setMessage] = useState<string | null>(null);
  
  const normalizedAges = useMemo(() => {  
    const arr = product.age_months ?? [];  
    if (!Array.isArray(arr)) return [];  
    return Array.from(new Set(arr))  
      .filter((n) => Number.isFinite(n))  
      .sort((a, b) => a - b);  
  }, [product.age_months]);
  
  const selectedAge =  
    product.selected_age_months === undefined ? null : product.selected_age_months;
  
  const needsSizeSelection = normalizedAges.length > 1 && selectedAge == null;
  
  const isDisabled = !!disabled || needsSizeSelection;
  
  const handleAddToCart = () => {  
    if (disabled) return;
  
    // If this product has multiple sizes and none is selected, send user to PDP to choose.  
    if (needsSizeSelection) {  
      router.push(`/product/${product.slug}`);  
      return;  
    }
  
    setMessage(null);
  
    const { ok, reason } = addItem({  
      id: product.id,  
      name: product.name,  
      slug: product.slug,  
      image_url: product.image_url,  
      price_cents: product.price_cents,  
      currency: product.currency,  
      selected_age_months: selectedAge,  
    });
  
    if (!ok) {  
      setStatus('error');  
      setMessage(reason ?? 'Unable to add this item to cart.');  
      return;  
    }
  
    setStatus('added');  
    setMessage('Added to cart.');  
    setTimeout(() => {  
      setStatus('idle');  
      setMessage(null);  
    }, 2000);  
  };
  
  return (  
    <div className="space-y-1">  
      <button  
        type="button"  
        disabled={isDisabled}  
        onClick={handleAddToCart}  
        className={  
          className ??  
          [  
            'w-full rounded-full px-4 py-2 text-sm font-medium transition',  
            isDisabled  
              ? 'cursor-not-allowed bg-[#ead8cd] text-[#7c675b]'  
              : 'bg-[#4b3b33] text-[#fdf7f2] hover:bg-[#3a2e29]',  
          ].join(' ')  
        }  
      >  
        {needsSizeSelection  
          ? 'Select size'  
          : status === 'added'  
            ? 'Added ✓'  
            : 'Add to cart'}  
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