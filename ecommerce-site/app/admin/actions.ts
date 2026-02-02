'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// MASTER CLIENT (Server Only - Bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Ensure this secret key is in .env.local
);

/** --- REQUESTS ACTIONS --- **/
export async function updateRequestStatus(id: string, newStatus: string) {
  const { error } = await supabaseAdmin
    .from('requests')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error('Update Request Error:', error);
    throw new Error(error.message);
  }
  revalidatePath('/admin/requests');
}

/** --- PRODUCTS ACTIONS --- **/
export async function upsertProduct(productData: any) {
  // .upsert automatically updates if the ID exists, otherwise inserts
  const { error } = await supabaseAdmin
    .from('products')
    .upsert(productData, { onConflict: 'id' });

  if (error) {
    console.error('Upsert Product Error:', error);
    throw new Error(error.message);
  }
  revalidatePath('/admin/products');
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete Product Error:', error);
    throw new Error(error.message);
  }
  revalidatePath('/admin/products');
}

/** --- FLYERS ACTIONS --- **/
export async function upsertFlyer(flyerData: any) {
  const { error } = await supabaseAdmin
    .from('homepage_flyers')
    .upsert(flyerData, { onConflict: 'id' });

  if (error) {
    console.error('Upsert Flyer Error:', error);
    throw new Error(error.message);
  }
  revalidatePath('/admin/home');
}

export async function deleteFlyer(id: string) {
  const { error } = await supabaseAdmin
    .from('homepage_flyers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete Flyer Error:', error);
    throw new Error(error.message);
  }
  revalidatePath('/admin/home');
}