// app/api/admin/upload-product-images/route.ts  
import { NextResponse } from 'next/server';  
import { createClient } from '@supabase/supabase-js';
  
export const runtime = 'nodejs';
  
function jsonError(message: string, status = 500, details?: any) {  
  return NextResponse.json(  
    { error: message, details: details ? String(details) : undefined },  
    { status }  
  );  
}
  
export async function POST(req: Request) {  
  try {  
    // OPTIONAL: simple protection so random users can't hit this endpoint  
    // Set ADMIN_UPLOAD_SECRET in env and send header from your admin UI calls.  
    const secret = process.env.ADMIN_UPLOAD_SECRET;  
    if (secret) {  
      const got = req.headers.get('x-admin-secret');  
      if (got !== secret) return jsonError('Unauthorized', 401);  
    }
  
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;  
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;  
    if (!url || !serviceKey) return jsonError('Supabase env missing', 500);
  
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  
    const form = await req.formData();  
    const slug = String(form.get('slug') ?? '').trim();  
    if (!slug) return jsonError('Missing slug', 400);
  
    const files = form.getAll('files').filter(Boolean) as File[];  
    if (!files.length) return jsonError('No files uploaded', 400);
  
    // Change bucket name if yours differs  
    const bucket = 'product-images';
  
    const urls: string[] = [];
  
    for (const file of files) {  
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();  
      const safeExt = ext.replace(/[^a-z0-9]/g, '') || 'jpg';
  
      const arrayBuffer = await file.arrayBuffer();  
      const bytes = new Uint8Array(arrayBuffer);
  
      // Unique path per file  
      const path = `products/${slug}/${crypto.randomUUID()}.${safeExt}`;
  
      const upload = await supabase.storage.from(bucket).upload(path, bytes, {  
        contentType: file.type || 'image/jpeg',  
        upsert: false,  
      });
  
      if (upload.error) {  
        return jsonError('Storage upload failed', 500, upload.error.message);  
      }
  
      const pub = supabase.storage.from(bucket).getPublicUrl(path);  
      const publicUrl = pub.data.publicUrl;  
      if (!publicUrl) return jsonError('Could not get public URL', 500);
  
      urls.push(publicUrl);  
    }
  
    return NextResponse.json({ urls }, { status: 200 });  
  } catch (err: any) {  
    // Always return JSON (never let Next render HTML error pages)  
    return jsonError('Upload route crashed', 500, err?.message ?? err);  
  }  
}  