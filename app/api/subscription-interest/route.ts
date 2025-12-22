import { NextResponse } from 'next/server';  
import { createServerClient } from '@supabase/auth-helpers-nextjs';  
import { cookies } from 'next/headers';  
import type { NextRequest } from 'next/server';
  
export async function POST(req: NextRequest) {  
  try {  
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
  
    // Get current user  
    const {  
      data: { user },  
    } = await supabase.auth.getUser();
  
    if (!user || !user.email) {  
      return NextResponse.json(  
        { error: 'Not signed in' },  
        { status: 401 }  
      );  
    }
  
    // Load existing profile (optional, to include name/phone/child info)  
    const { data: profile } = await supabase  
      .from('users')  
      .select('name, phone, child_name, child_age_group')  
      .eq('id', user.id)  
      .maybeSingle();
  
    const payload = {  
      child_name: profile?.child_name ?? null,  
      child_age_group: profile?.child_age_group ?? null,  
    };
  
    const { error } = await supabase.from('requests').insert({  
      type: 'subscription_interest',  
      name: profile?.name ?? null,  
      email: user.email,  
      phone: profile?.phone ?? null,  
      payload,  
      source: 'subscription_page',  
      status: 'new',  
    });
  
    if (error) {  
      console.error('Error creating subscription interest:', error);  
      return NextResponse.json(  
        { error: 'Failed to save interest' },  
        { status: 500 }  
      );  
    }
  
    return NextResponse.json({ ok: true });  
  } catch (err: any) {  
    console.error('Unexpected error:', err);  
    return NextResponse.json(  
      { error: 'Unexpected error' },  
      { status: 500 }  
    );  
  }  
}  