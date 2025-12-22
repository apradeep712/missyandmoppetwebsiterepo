'use client';
  
import Link from 'next/link';  
import { useCartStore } from '@/lib/cartStore';
  
export default function CartSummary() {  
  const items = useCartStore((state) => state.items);
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (  
    <Link  
      href="/cart"  
      className="text-sm text-slate-200 hover:text-white transition"  
    >  
      Cart ({totalItems})  
    </Link>  
  );  
}  