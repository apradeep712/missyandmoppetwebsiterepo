'use client';
  
import { useMemo } from 'react';  
import { useRouter } from 'next/navigation';
  
type BuyNowButtonProps = {  
  className?: string;  
  disabled?: boolean;
  
  product: {  
    id: string;  
    slug: string;
  
    /**  
     * Selected size in months (set on PDP after user picks a size).  
     */  
    selected_age_months?: number | null;
  
    /**  
     * Optional list of available sizes. If >1 and no selected_age_months, we force select size.  
     */  
    age_months?: number[] | null;  
  };  
};
  
export default function BuyNowButton({ product, disabled, className }: BuyNowButtonProps) {  
  const router = useRouter();
  
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
  
  const handleBuyNow = () => {  
    if (disabled) return;
  
    if (needsSizeSelection) {  
      router.push(`/product/${product.slug}`);  
      return;  
    }
  
    const params = new URLSearchParams();  
    params.set('productId', product.id);  
    params.set('qty', '1');  
    if (selectedAge != null) params.set('ageMonths', String(selectedAge));
  
    router.push(`/checkout/buy-now?${params.toString()}`);  
  };
  
  return (  
    <div className="space-y-1">  
      <button  
        type="button"  
        disabled={isDisabled}  
        onClick={handleBuyNow}  
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
        {needsSizeSelection ? 'Select size' : 'Buy Now'}  
      </button>  
    </div>  
  );  
}  