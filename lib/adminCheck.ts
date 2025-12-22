import { cookies } from 'next/headers';  
import { createServerClient } from '@supabase/auth-helpers-nextjs';
  
// Put admin emails here (yours + later client's)  
const ADMIN_EMAILS = [  
  'atishpradeep@gmail.com', // TODO: replace with yours  
  // 'founder@example.com',  
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