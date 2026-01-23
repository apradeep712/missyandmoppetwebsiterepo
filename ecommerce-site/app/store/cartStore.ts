'use client';

import { create } from 'zustand';  
import { persist } from 'zustand/middleware';
  
export type CartItem = {  
  line_id: string;  
  id: string;  
  name: string;  
  slug: string;  
  image_url: string | null;  
  price_cents: number;  
  currency: string;  
  quantity: number;  
  selected_age_months: number | null;  
};
  
type CartState = {  
  items: CartItem[];  
  addItem: (item: Omit<CartItem, 'quantity' | 'line_id'>) => { ok: boolean; reason?: string };  
  removeItem: (line_id: string) => void;  
  clear: () => void;  
  setQuantity: (line_id: string, quantity: number) => void;  
};
  
function makeLineId(productId: string, selectedAgeMonths: number | null) {  
  return `${productId}:${selectedAgeMonths ?? 'na'}`;  
}
  
export const useCartStore = create<CartState>()(  
  persist(  
    (set, get) => ({  
      items: [],
  
      addItem: (item) => {  
        const current = get().items;  
        const line_id = makeLineId(item.id, item.selected_age_months);
  
        const existing = current.find((i) => i.line_id === line_id);  
        if (existing) {  
          set({  
            items: current.map((i) =>  
              i.line_id === line_id ? { ...i, quantity: i.quantity + 1 } : i  
            ),  
          });  
          return { ok: true };  
        }
  
        if (current.length >= 5) {  
          return {  
            ok: false,  
            reason: 'You can keep up to 5 different products in your cart.',  
          };  
        }
  
        set({ items: [...current, { ...item, line_id, quantity: 1 }] });  
        return { ok: true };  
      },
  
      removeItem: (line_id) => set({ items: get().items.filter((i) => i.line_id !== line_id) }),
  
      clear: () => set({ items: [] }),
  
      setQuantity: (line_id, quantity) => {  
        if (quantity <= 0) {  
          set({ items: get().items.filter((i) => i.line_id !== line_id) });  
          return;  
        }  
        set({  
          items: get().items.map((i) =>  
            i.line_id === line_id ? { ...i, quantity } : i  
          ),  
        });  
      },  
    }),  
    { name: 'cart-store-v2' }
  )  
);