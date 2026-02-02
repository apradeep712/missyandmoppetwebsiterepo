'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// MASTER CLIENT (Only accessible on the server)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Uses the Master Key
);

/** --- REQUESTS --- **/
export async function updateRequestStatus(id: string, newStatus: string) {
  const { error } = await supabaseAdmin.from('requests').update({ status: newStatus }).eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/requests');
}

/** --- PRODUCTS --- **/
export async function upsertProduct(productData: any) {
  const { error } = await supabaseAdmin.from('products').upsert(productData);
  if (error) throw error;
  revalidatePath('/admin/products');
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/products');
}

/** --- FLYERS --- **/
export async function upsertFlyer(flyerData: any) {
  const { error } = await supabaseAdmin.from('homepage_flyers').upsert(flyerData);
  if (error) throw error;
  revalidatePath('/admin/home');
}