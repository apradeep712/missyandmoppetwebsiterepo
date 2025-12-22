'use client';
  
import { useEffect, useState } from 'react';  
import { useSupabaseBrowserClient } from '../providers';
  
type CurrentUser = {  
  id: string;  
  email: string | null;  
};
  
export function useCurrentUser() {  
  const supabase = useSupabaseBrowserClient();  
  const [user, setUser] = useState<CurrentUser | null>(null);  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {  
    const load = async () => {  
      const { data } = await supabase.auth.getUser();  
      if (data.user) {  
        setUser({  
          id: data.user.id,  
          email: data.user.email ?? null,  
        });  
      } else {  
        setUser(null);  
      }  
      setLoading(false);  
    };
  
    load();  
  }, [supabase]);
  
  return { user, loading };  
}  