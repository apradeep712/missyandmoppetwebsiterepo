import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

interface SurveyInput {
  name: string;
  phone: string;
  email?: string;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  comments?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SurveyInput;

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required.' },
        { status: 400 }
      );
    }

    const clip = (v: unknown, max = 1000) =>
      typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null;

    const { error } = await supabaseAdmin.from('survey').insert({
      name: name.slice(0, 200),
      phone: phone.slice(0, 40),
      email: clip(body.email, 200),
      q1: clip(body.q1, 200),
      q2: clip(body.q2, 200),
      q3: clip(body.q3, 200),
      q4: clip(body.q4, 200),
      q5: clip(body.q5, 200),
      comments: clip(body.comments, 2000),
      source: 'web',
      status: 'new',
    });

    if (error) {
      console.error('Error inserting survey response:', error);
      return NextResponse.json({ error: 'Failed to save your response.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Unexpected survey error:', err);
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 });
  }
}
