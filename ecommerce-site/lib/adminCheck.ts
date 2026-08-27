import { cookies } from 'next/headers';  
import { createServerClient } from '@supabase/auth-helpers-nextjs';
  
// Put admin emails here (keep lowercase — compared against the lowercased user email)
const ADMIN_EMAILS = [
  'missyandmoppet@gmail.com',
];
  
export async function isAdminRequest(): Promise<boolean> {  
  const cookieStore = await cookies();
  
  const supabase = createServerClient(  
    process.env.NEXT_PUBLIC_SUPABASE_URL!,  
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,  
    {  
      cookies: {  
        get(name: string) {  
          return cookieStore.get(name)?.value;  
        },  
      },  
    }  
  );
  
  const {  
    data: { user },  
  } = await supabase.auth.getUser();
  
  if (!user || !user.email) return false;
  
  return ADMIN_EMAILS.includes(user.email.toLowerCase());  
}  