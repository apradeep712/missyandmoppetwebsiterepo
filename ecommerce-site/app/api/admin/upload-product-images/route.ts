// app/api/admin/upload-product-images/route.ts
//
// Hands out one-time signed upload URLs so the browser uploads images straight
// to Supabase Storage. Files never pass through this function, which avoids
// Vercel's 4.5 MB request body limit (413 FUNCTION_PAYLOAD_TOO_LARGE).
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin } from '@/lib/adminAuth';

export const runtime = 'nodejs';

const BUCKET = 'product-images';
const MAX_FILES = 20;

type FileInfo = { name?: string; type?: string };

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = (await req.json().catch(() => null)) as { slug?: string; files?: FileInfo[] } | null;
  const slug = String(body?.slug ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 120);
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

  const files = Array.isArray(body?.files) ? body!.files : [];
  if (!files.length) return NextResponse.json({ error: 'No files' }, { status: 400 });
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Upload at most ${MAX_FILES} images at a time` }, { status: 400 });
  }

  const uploads: { path: string; token: string; publicUrl: string }[] = [];
  for (const f of files) {
    if (f.type && !f.type.startsWith('image/')) {
      return NextResponse.json({ error: `"${f.name ?? 'file'}" is not an image` }, { status: 400 });
    }
    const ext = (String(f.name ?? '').split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = `products/${slug}/${crypto.randomUUID()}.${ext}`;

    const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUploadUrl(path);
    if (error || !data) {
      return NextResponse.json({ error: 'Could not prepare upload', details: error?.message }, { status: 500 });
    }
    const publicUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    uploads.push({ path: data.path, token: data.token, publicUrl });
  }

  return NextResponse.json({ bucket: BUCKET, uploads });
}
