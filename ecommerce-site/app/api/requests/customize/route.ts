import { NextResponse } from 'next/server';  
import { createServerClient } from '@supabase/auth-helpers-nextjs';  
import type { NextRequest } from 'next/server';  
import { cookies } from 'next/headers';
  
export async function POST(req: NextRequest) {  
  try {  
    const body = await req.json();
  
    const {  
      name,  
      email,  
      phone,  
      forWhom,  
      colours,  
      idea,  
    } = body as {  
      name: string;  
      email: string;  
      phone?: string;  
      forWhom?: string;  
      colours?: string;  
      idea?: string;  
    };
  
    if (!email || !name) {  
      return NextResponse.json(  
        { error: 'Name and email are required.' },  
        { status: 400 }  
      );  
    }
  
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
  
    const payload = {  
      forWhom: forWhom || null,  
      colours: colours || null,  
      idea: idea || null,  
    };
  
    const { error } = await supabase.from('requests').insert({  
      type: 'customize',  
      name,  
      email,  
      phone: phone || null,  
      payload,  
      source: 'web',  
      status: 'new',  
    });
  
    if (error) {  
      console.error('Error inserting customize request:', error);  
      return NextResponse.json(  
        { error: 'Failed to save request.' },  
        { status: 500 }  
      );  
    }
  
    return NextResponse.json({ ok: true });  
  } catch (err: any) {  
    console.error('Unexpected error:', err);  
    return NextResponse.json(  
      { error: 'Unexpected error.' },  
      { status: 500 }  
    );  
  }  
}  