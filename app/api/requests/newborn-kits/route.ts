import { NextResponse } from 'next/server';  
import { createServerClient } from '@supabase/auth-helpers-nextjs';  
import type { NextRequest } from 'next/server';  
import { cookies } from 'next/headers';
  
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
  
    // Parse body (optional fields)  
    const body = await req.json().catch(() => ({}));  
    const {  
      name: bodyName,  
      email: bodyEmail,  
      phone: bodyPhone,  
      message,  
    } = (body ?? {}) as {  
      name?: string;  
      email?: string;  
      phone?: string;  
      message?: string;  
    };
  
    // Try auth (optional)  
    const {  
      data: { user },  
    } = await supabase.auth.getUser();
  
    // Try profile (optional)  
    let profile: { name: string | null; phone: string | null } | null = null;  
    if (user?.id) {  
      const { data } = await supabase  
        .from('users')  
        .select('name, phone')  
        .eq('id', user.id)  
        .maybeSingle();  
      profile = data ?? null;  
    }
  
    const finalEmail = bodyEmail ?? user?.email ?? null;  
    const finalName = bodyName ?? profile?.name ?? null;  
    const finalPhone = bodyPhone ?? profile?.phone ?? null;
  
    if (!finalEmail || !finalName) {  
      // You can change this to 401 if you want to force sign-in.  
      return NextResponse.json(  
        { error: 'Name and email are required (sign in or provide details).' },  
        { status: 400 }  
      );  
    }
  
    const payload = {  
      message: message || null,  
    };
  
    const { error } = await supabase.from('requests').insert({  
      type: 'newborn_kit',  
      name: finalName,  
      email: finalEmail,  
      phone: finalPhone,  
      payload,  
      source: 'web',  
      status: 'new',  
    });
  
    if (error) {  
      console.error('Error inserting newborn kit request:', error);  
      return NextResponse.json({ error: 'Failed to save request.' }, { status: 500 });  
    }
  
    return NextResponse.json({ ok: true });  
  } catch (err: any) {  
    console.error('Unexpected error:', err);  
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });  
  }  
}  