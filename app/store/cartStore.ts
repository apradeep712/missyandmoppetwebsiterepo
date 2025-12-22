'use client';
  
import { create } from 'zustand';  
import { persist } from 'zustand/middleware';
  
export type CartItem = {  
  id: string;  
  name: string;  
  slug: string;  
  image_url: string | null;  
  price_cents: number;  
  currency: string;  
  quantity: number;  
};
  
type CartState = {  
  items: CartItem[];  
  addItem: (item: Omit<CartItem, 'quantity'>) => { ok: boolean; reason?: string };  
  removeItem: (id: string) => void;  
  clear: () => void;  
  setQuantity: (id: string, quantity: number) => void;  
};
  
export const useCartStore = create<CartState>()(  
  persist(  
    (set, get) => ({  
      items: [],
  
      addItem: (item) => {  
        const current = get().items;
  
        // If item already in cart, just bump quantity (without exceeding 5 total distinct items)  
        const existing = current.find((i) => i.id === item.id);  
        if (existing) {  
          set({  
            items: current.map((i) =>  
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i  
            ),  
          });  
          return { ok: true };  
        }
  
        // Max 5 distinct products  
        if (current.length >= 5) {  
          return {  
            ok: false,  
            reason:  
              'You can keep up to 5 different products in your cart. Please remove one to add another.',  
          };  
        }
  
        set({  
          items: [  
            ...current,  
            {  
              ...item,  
              quantity: 1,  
            },  
          ],  
        });  
        return { ok: true };  
      },
  
      removeItem: (id) => {  
        set({ items: get().items.filter((i) => i.id !== id) });  
      },
  
      clear: () => {  
        set({ items: [] });  
      },
  
      setQuantity: (id, quantity) => {  
        if (quantity <= 0) {  
          set({ items: get().items.filter((i) => i.id !== id) });  
        } else {  
          set({  
            items: get().items.map((i) =>  
              i.id === id ? { ...i, quantity } : i  
            ),  
          });  
        }  
      },  
    }),  
    {  
      name: 'cart-store', // key in localStorage  
    }  
  )  
);  