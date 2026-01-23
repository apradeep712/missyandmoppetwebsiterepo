'use client';
  
import { create } from 'zustand';  
import { persist } from 'zustand/middleware';
  
export type TryAtHomeItem = {  
  id: string;  
  name: string;  
  slug: string;  
  image_url: string | null;  
  price_cents: number;  
  currency: string;  
};
  
type TryAtHomeState = {  
  items: TryAtHomeItem[];  
  addItem: (item: TryAtHomeItem) => { ok: boolean; reason?: string };  
  removeItem: (id: string) => void;  
  clear: () => void;  
};
  
export const useTryAtHomeStore = create<TryAtHomeState>()(  
  persist(  
    (set, get) => ({  
      items: [],
  
      addItem: (item) => {  
        const current = get().items;
  
        // Already selected → no change, but OK  
        if (current.some((i) => i.id === item.id)) {  
          return { ok: true };  
        }
  
        // Max 3 items  
        if (current.length >= 3) {  
          return {  
            ok: false,  
            reason:  
              'Sorry, maximum 3 pieces allowed for Try at home. Please contact Missy & Mopet to talk to our team.',  
          };  
        }
  
        set({ items: [...current, item] });  
        return { ok: true };  
      },
  
      removeItem: (id) => {  
        set({ items: get().items.filter((i) => i.id !== id) });  
      },
  
      clear: () => {  
        set({ items: [] });  
      },  
    }),  
    {  
      name: 'try-at-home-store', // key in localStorage  
    }  
  )  
);  