'use client';
  
import { useRouter } from 'next/navigation';
  
type BuyNowProduct = {  
  id: string;  
  selected_age_months: number | null;  
  requires_size_selection: boolean;  
};
  
export default function BuyNowButtonClient({  
  disabled,  
  product,  
}: {  
  disabled?: boolean;  
  product: BuyNowProduct;  
}) {  
  const router = useRouter();
  
  return (  
    <button  
      type="button"  
      disabled={disabled}  
      onClick={() => {  
        // Send to quick checkout page (Pay Now only)  
        const params = new URLSearchParams();  
        params.set('productId', product.id);  
        params.set('qty', '1');
  
        if (product.selected_age_months !== null) {  
          params.set('ageMonths', String(product.selected_age_months));  
        }
  
        router.push(`/checkout/buy-now?${params.toString()}`);  
      }}  
      className={[  
        'w-full rounded-2xl px-4 py-3 text-sm font-medium shadow-[0_10px_26px_rgba(148,116,96,0.12)] transition',  
        disabled  
          ? 'cursor-not-allowed border border-[#ead8cd] bg-[#f3ede7] text-[#a08a7d]'  
          : 'border border-[#4b3b33] bg-[#4b3b33] text-white hover:opacity-95',  
      ].join(' ')}  
    >  
      Buy Now  
    </button>  
  );  
}  