import CheckoutBuyNowClient from './ui/CheckoutBuyNowClient';
  
export default async function BuyNowCheckoutPage({  
  searchParams,  
}: {  
  searchParams: Promise<{ productId?: string; qty?: string; ageMonths?: string }>;  
}) {  
  const sp = await searchParams;
  
  const productId = sp.productId ?? '';  
  const qty = Math.max(1, Number(sp.qty ?? 1));  
  const ageMonths = sp.ageMonths ? Number(sp.ageMonths) : null;
  
  return (  
    <div className="mx-auto w-full max-w-2xl px-4 py-6">  
      <h1 className="text-lg font-semibold text-[#4b3b33]">Lets go !</h1>  
      <p className="mt-1 text-sm text-[#7c675b]">Please complete your payment and let our team do the rest</p>
  
      <div className="mt-6">  
        <CheckoutBuyNowClient productId={productId} qty={qty} ageMonths={ageMonths} />  
      </div>  
    </div>  
  );  
}  