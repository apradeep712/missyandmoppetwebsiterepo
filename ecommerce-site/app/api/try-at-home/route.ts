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
  
    const {  
      data: { user },  
    } = await supabase.auth.getUser();
  
    if (!user || !user.email) {  
      return NextResponse.json(  
        { error: 'Not signed in' },  
        { status: 401 }  
      );  
    }
  
    const body = await req.json();
  
    const {  
      address,  
      pincode,  
      notes,  
    }: { address: string; pincode: string; notes: string } = body;
  
    // Load profile for extra context (optional)  
    const { data: profile } = await supabase  
      .from('users')  
      .select('name, phone, child_name, child_age_group')  
      .eq('id', user.id)  
      .maybeSingle();
  
    const payload = {  
      address: address || null,  
      pincode: pincode || null,  
      notes: notes || null,  
      child_name: profile?.child_name ?? null,  
      child_age_group: profile?.child_age_group ?? null,  
    };
  
    const { error } = await supabase.from('requests').insert({  
      type: 'try_at_home',  
      name: profile?.name ?? null,  
      email: user.email,  
      phone: profile?.phone ?? null,  
      payload,  
      source: 'try_at_home_page',  
      status: 'new',  
    });
  
    if (error) {  
      console.error('Error creating try-at-home request:', error);  
      return NextResponse.json(  
        { error: 'Failed to save request' },  
        { status: 500 }  
      );  
    }
  
    return NextResponse.json({ ok: true });  
  } catch (err: any) {  
    console.error('Unexpected error in try-at-home:', err);  
    return NextResponse.json(  
      { error: 'Unexpected error' },  
      { status: 500 }  
    );  
  }  
}  