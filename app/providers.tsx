'use client';
  
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';  
import { createContext, useContext, useState } from 'react';
  
type SupabaseClientType = ReturnType<typeof createBrowserClient>;
  
const SupabaseContext = createContext<SupabaseClientType | null>(null);
  
export function useSupabaseBrowserClient() {  
  const client = useContext(SupabaseContext);  
  if (!client) {  
    throw new Error('Supabase client not available in context');  
  }  
  return client;  
}
  
export default function Providers({ children }: { children: React.ReactNode }) {  
  const [supabaseClient] = useState(() =>  
    createBrowserClient(  
      process.env.NEXT_PUBLIC_SUPABASE_URL!,  
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  
    )  
  );
  
  return (  
    <SupabaseContext.Provider value={supabaseClient}>  
      {children}  
    </SupabaseContext.Provider>  
  );  
}  