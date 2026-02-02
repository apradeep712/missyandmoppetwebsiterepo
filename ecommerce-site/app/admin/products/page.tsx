'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';  
import { createBrowserClient } from '@supabase/ssr';

type Currency = 'INR';  
type Gender = 'boys' | 'girls';

type Product = {  
id: string;  
name: string;  
slug: string;  
description: string | null;  
price_cents: number;  
currency: Currency;  
stock: number;  
is_active: boolean; 
is_partywear: boolean; 
image_url: string | null;  
created_at: string;  
gender: Gender[] | null;  
product_type: string | null;  
age_months: number[] | null;  
};

type ProductFormState = {  
id?: string;  
name: string;  
slug: string;  
description: string;

// Canonical storage (months) saved to DB  
age_months: number[];

// Admin entry (boundary points)  
age_month_points_text: string; // e.g. "12,18"  
age_year_points_text: string; // e.g. "2,3,4,5,6,7,10,11,13"

price_inr: string;  
stock: string;  
is_active: boolean; 
is_partywear: boolean; // <-- Add this 
currency: Currency;

// hero  
image_url: string; // external url OR uploaded url result  
image_file: File | null;

// gallery  
gallery_files: File[];  
gender: Gender[];  
product_type: string;  
};

type ProductImageRow = { id: string; url: string; sort_order: number };

function slugify(input: string) {  
return input  
  .toLowerCase()  
  .trim()  
  .replace(/['"]/g, '')  
  .replace(/[^a-z0-9]+/g, '-')  
  .replace(/^-+|-+$/g, '');  
}

function formatINRFromPaise(paise: number) {  
return (paise / 100).toFixed(2);  
}

function toPaiseFromINRString(inr: string) {  
const normalized = inr.replace(/,/g, '').trim();  
const n = Number(normalized);  
if (!Number.isFinite(n) || n < 0) return null;  
return Math.round(n * 100);  
}

function cn(...parts: Array<string | false | null | undefined>) {  
return parts.filter(Boolean).join(' ');  
}

function toggleInArray<T>(arr: T[], value: T) {  
return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];  
}

/** Normalize canonical months list: dedupe, sort, clamp */  
function normalizeAgeMonths(input: number[]) {  
const cleaned = (input ?? [])  
  .map((n) => Number(n))  
  .filter((n) => Number.isFinite(n))  
  .map((n) => Math.round(n))  
  .filter((n) => n >= 0 && n <= 216); // 0..18y safety  
return Array.from(new Set(cleaned)).sort((a, b) => a - b);  
}

function formatAgeFromMonths(months: number) {  
if (months < 12) return `${months}M`;  
const y = Math.floor(months / 12);  
const m = months % 12;  
return m === 0 ? `${y}Y` : `${y}Y ${m}M`;  
}

/** Parse "12,18" or "12 18" into [12,18] */  
function parseNumberList(raw: string) {  
return (raw ?? '')  
  .split(/[,\s]+/)  
  .map((s) => s.trim())  
  .filter(Boolean)  
  .map((s) => Number(s))  
  .filter((n) => Number.isFinite(n));  
}

function yearsToMonths(years: number[]) {  
return years.map((y) => Math.round(y * 12));  
}

/**  
 * Canonical: months boundary points + years boundary points -> months[]  
 * Example:  
 *  monthPointsText="12,18"  
 *  yearPointsText="2,3,4,5,6,7,10,11,13"  
 * => [12,18,24,36,48,60,72,84,120,132,156]  
 */  
function computeAgeMonthsFromTexts(monthPointsText: string, yearPointsText: string) {  
const monthPoints = parseNumberList(monthPointsText);  
const yearPoints = parseNumberList(yearPointsText);  
return normalizeAgeMonths([...monthPoints, ...yearsToMonths(yearPoints)]);  
}

function Modal({  
open,  
title,  
onClose,  
children,  
}: {  
open: boolean;  
title: string;  
onClose: () => void;  
children: React.ReactNode;  
}) {  
if (!open) return null;

return (  
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">  
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />  
    <div className="relative z-10 flex w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl">  
      <div className="flex items-center justify-between border-b border-gray-100 p-5">  
        <div>  
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>  
          <p className="text-xs text-gray-500">Fields marked * are required.</p>  
        </div>  
        <button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200">  
          ✕  
        </button>  
      </div>  
      <div className="max-h-[80vh] flex-1 overflow-y-auto p-5">{children}</div>  
    </div>  
  </div>  
);  
}

async function uploadViaAdminApi(slug: string, files: File[]) {  
const fd = new FormData();  
fd.set('slug', slug);  
for (const f of files) fd.append('files', f);

const res = await fetch('/api/admin/upload-product-images', {  
  method: 'POST',  
  body: fd,  
});

const contentType = res.headers.get('content-type') || '';  
if (!contentType.includes('application/json')) {  
  const text = await res.text();  
  throw new Error(`Upload API returned non-JSON (${res.status}). First 200 chars: ${text.slice(0, 200)}`);  
}

const json = (await res.json()) as { urls?: string[]; error?: string; details?: string };

if (!res.ok) throw new Error(json.error || `Upload failed (${res.status})`);  
return json.urls ?? [];  
}

export default function AdminProductsPage() {  
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;  
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = useMemo(() => {  
  if (!supabaseUrl || !supabaseAnon) {  
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');  
  }  
  return createBrowserClient(supabaseUrl, supabaseAnon);  
}, [supabaseUrl, supabaseAnon]);

const [loadingList, setLoadingList] = useState(false);  
const [saving, setSaving] = useState(false);

const [products, setProducts] = useState<Product[]>([]);  
const [query, setQuery] = useState('');

const [errorMsg, setErrorMsg] = useState<string | null>(null);  
const [infoMsg, setInfoMsg] = useState<string | null>(null);

const [modalOpen, setModalOpen] = useState(false);  
const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

// Existing gallery (saved in DB) for the product being edited  
const [existingGallery, setExistingGallery] = useState<ProductImageRow[]>([]);  
const [loadingGallery, setLoadingGallery] = useState(false);

const PRODUCT_TYPES = useMemo(  
  () => [  
    { label: 'T-shirt', value: 't-shirt' },  
    { label: 'Pants', value: 'pants' },  
    { label: 'Shorts', value: 'shorts' },  
    { label: 'Shirt', value: 'shirt' },  
    { label: 'Dress', value: 'dress' },  
    { label: 'Set', value: 'set' },  
    { label: 'Polo', value: 'polo' },  
    { label: 'Top', value: 'top' },  
    { label: 'Vest', value: 'vest' },  
    { label: 'Onesie', value: 'onesie' },  
    { label: 'Jumpsuit', value: 'jumpsuit' },  
    { label: 'Coat', value: 'coat' },  
  ],  
  []  
);

const emptyForm: ProductFormState = useMemo(  
  () => ({  
    name: '',  
    slug: '',  
    description: '',

    age_months: [],  
    age_month_points_text: '',  
    age_year_points_text: '',

    price_inr: '',  
    stock: '0',  
    is_active: true, 
    is_partywear: false, // <-- Add this 
    currency: 'INR',

    image_url: '',  
    image_file: null,

    gallery_files: [],  
    gender: [],  
    product_type: '',  
  }),  
  []  
);

const [form, setForm] = useState<ProductFormState>(emptyForm);

const loadProducts = useCallback(async () => {  
  setLoadingList(true);  
  setErrorMsg(null);

  try {  
    const res = await supabase.from('products').select('*').order('created_at', { ascending: false });  
    if (res.error) throw res.error;  
    setProducts((res.data ?? []) as Product[]);  
  } catch (e: any) {  
    setErrorMsg(e?.message ?? 'Failed to load products.');  
  } finally {  
    setLoadingList(false);  
  }  
}, [supabase]);

useEffect(() => {  
  void loadProducts();  
}, [loadProducts]);

const filtered = useMemo(() => {  
  const q = query.trim().toLowerCase();  
  if (!q) return products;  
  return products.filter(  
    (p) =>  
      p.name.toLowerCase().includes(q) ||  
      p.slug.toLowerCase().includes(q) ||  
      (p.description ?? '').toLowerCase().includes(q) ||  
      (p.product_type ?? '').toLowerCase().includes(q)  
  );  
}, [products, query]);

function openAddModal() {  
  setModalMode('add');  
  setForm(emptyForm);  
  setExistingGallery([]);  
  setErrorMsg(null);  
  setInfoMsg(null);  
  setModalOpen(true);  
}

async function fetchExistingGallery(productId: string) {  
  setLoadingGallery(true);  
  try {  
    const { data, error } = await supabase  
      .from('product_images')  
      .select('id,url,sort_order')  
      .eq('product_id', productId)  
      .order('sort_order', { ascending: true });

    if (error) throw error;  
    setExistingGallery((data ?? []) as ProductImageRow[]);  
  } catch (e: any) {  
    setExistingGallery([]);  
    setErrorMsg(e?.message ?? 'Failed to load gallery images.');  
  } finally {  
    setLoadingGallery(false);  
  }  
}

function openEditModal(p: Product) {  
  const months = normalizeAgeMonths((p.age_months ?? []) as number[]);

  // Heuristic reverse-fill:  
  // - month boundaries: keep non-year months (<24 is common for 12,18)  
  const monthText = months.filter((m) => m < 24).join(',');

  // - years boundaries: whole years (>=24 and divisible by 12)  
  const yearText = months  
    .filter((m) => m >= 24 && m % 12 === 0)  
    .map((m) => String(m / 12))  
    .join(',');

  setModalMode('edit');  
  setForm({  
    id: p.id,  
    name: p.name,  
    slug: p.slug,  
    description: p.description ?? '',

    age_months: months,  
    age_month_points_text: monthText,  
    age_year_points_text: yearText,

    price_inr: formatINRFromPaise(p.price_cents),  
    stock: String(p.stock ?? 0),  
    is_active: !!p.is_active, 
    is_partywear: !!(p as any).is_partywear, // Use type casting if the Product type isn't updated yet 
    currency: p.currency ?? 'INR',

    image_url: p.image_url ?? '',  
    image_file: null,

    gallery_files: [],  
    gender: (p.gender ?? []) as Gender[],  
    product_type: p.product_type ?? '',  
  });

  setExistingGallery([]);  
  setErrorMsg(null);  
  setInfoMsg(null);  
  setModalOpen(true);

  void fetchExistingGallery(p.id);  
}

const closeModal = () => {  
  if (!saving) setModalOpen(false);  
};

async function onSave(e: React.FormEvent) {  
  e.preventDefault();  
  setSaving(true);  
  setErrorMsg(null);  
  setInfoMsg(null);

  try {  
    const name = form.name.trim();  
    if (!name) throw new Error('Name is required.');

    const slug = form.slug.trim() ? slugify(form.slug) : slugify(name);  
    if (!slug) throw new Error('Slug is required.');

    const pricePaise = toPaiseFromINRString(form.price_inr);  
    if (pricePaise === null) throw new Error('Price (INR) is invalid.');

    const stockNum = Number(form.stock);  
    if (!Number.isInteger(stockNum) || stockNum < 0) throw new Error('Stock must be a non-negative integer.');

    // Always recompute from texts once before save, so admin doesn't need to blur.  
    const computedAgeMonths = computeAgeMonthsFromTexts(form.age_month_points_text, form.age_year_points_text);

    // 1) Upload hero if selected  
    let imageUrlToSave: string | null = form.image_url.trim() || null;  
    if (form.image_file) {  
      const [heroUrl] = await uploadViaAdminApi(slug, [form.image_file]);  
      imageUrlToSave = heroUrl ?? null;  
    }

    // 2) Upsert product row first  
    const payload = {  
      name,  
      slug,  
      description: form.description.trim() || null,  
      price_cents: pricePaise,  
      currency: form.currency,  
      stock: stockNum,  
      is_active: form.is_active,
is_partywear: form.is_partywear, // <-- Add this
      // save canonical months  
      age_months: computedAgeMonths.length ? computedAgeMonths : null,

      image_url: imageUrlToSave,  
      gender: form.gender.length ? form.gender : null,  
      product_type: form.product_type.trim() ? form.product_type.trim() : null,  
    };

    const operation =  
      modalMode === 'add'  
        ? supabase.from('products').insert([payload]).select('id').single()  
        : supabase.from('products').update(payload).eq('id', form.id!).select('id').single();

    const { data: saved, error: saveErr } = await operation;  
    if (saveErr) throw saveErr;

    const productId = saved?.id as string | undefined;  
    if (!productId) throw new Error('Failed to get saved product id.');

    // 3) Upload gallery images and write to product_images  
    if (form.gallery_files.length) {  
      const galleryUrls = await uploadViaAdminApi(slug, form.gallery_files);

      const { data: existing, error: existingErr } = await supabase  
        .from('product_images')  
        .select('sort_order')  
        .eq('product_id', productId)  
        .order('sort_order', { ascending: false })  
        .limit(1);

      if (existingErr) throw existingErr;

      const maxSort = existing?.[0]?.sort_order ?? 0;

      const rows = galleryUrls.map((url, idx) => ({  
        product_id: productId,  
        url,  
        sort_order: maxSort + idx + 1,  
      }));

      if (rows.length) {  
        const ins = await supabase.from('product_images').insert(rows);  
        if (ins.error) throw ins.error;  
      }  
    }

    await loadProducts();  
    setInfoMsg(modalMode === 'add' ? 'Product created.' : 'Product updated.');

    await fetchExistingGallery(productId);

    // Clear local file selections; also sync canonical months back into form  
    setForm((prev) => ({  
      ...prev,  
      image_file: null,  
      gallery_files: [],  
      age_months: computedAgeMonths,  
    }));

    setModalOpen(false);  
  } catch (e: any) {  
    setErrorMsg(e?.message ?? 'Failed to save.');  
  } finally {  
    setSaving(false);  
  }  
}

async function deleteProduct(p: Product) {  
  if (!confirm(`Delete ${p.name}?`)) return;  
  setErrorMsg(null);

  const { error } = await supabase.from('products').delete().eq('id', p.id);  
  if (error) setErrorMsg(error.message);  
  else setProducts((prev) => prev.filter((x) => x.id !== p.id));  
}

return (  
  <div className="space-y-6">  
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">  
      <div>  
        <h1 className="text-2xl font-serif font-bold text-[#4b3b33]">Inventory</h1>  
        <p className="text-sm text-[#7c675b]">{products.length} products total</p>  
      </div>  
      <button  
        onClick={openAddModal}  
        className="rounded-full bg-[#4b3b33] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-transform active:scale-95"  
      >  
        + New Product  
      </button>  
    </div>

    <div className="flex gap-2">  
      <div className="relative flex-1">  
        <input  
          value={query}  
          onChange={(e) => setQuery(e.target.value)}  
          placeholder="Search catalog..."  
          className="w-full rounded-2xl border border-[#ead8cd] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#d9b9a0]"  
        />  
      </div>  
      <button  
        onClick={() => void loadProducts()}  
        className="rounded-2xl border border-[#ead8cd] bg-white px-4 py-2 text-xs font-bold text-[#4b3b33]"  
      >  
        {loadingList ? '...' : '↻'}  
      </button>  
    </div>

    {(errorMsg || infoMsg) && (  
      <div  
        className={cn(  
          'rounded-2xl p-4 text-xs font-bold',  
          errorMsg ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'  
        )}  
      >  
        {errorMsg || infoMsg}  
      </div>  
    )}

    <div className="overflow-hidden rounded-3xl border border-[#ead8cd] bg-white shadow-sm">  
      <div className="hidden grid-cols-12 gap-2 bg-[#fdf7f2] px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#a07d68] md:grid">  
        <div className="col-span-5">Product Details</div>  
        <div className="col-span-2">Price</div>  
        <div className="col-span-1">Stock</div>  
        <div className="col-span-2 text-center">Status</div>  
        <div className="col-span-2 text-right">Actions</div>  
      </div>

      <div className="divide-y divide-[#ead8cd]">  
        {filtered.map((p) => (  
          <div key={p.id} className="flex flex-col p-4 md:grid md:grid-cols-12 md:gap-4 md:px-6 md:py-5">  
            <div className="col-span-5 flex items-start gap-4">  
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-[#ead8cd] bg-[#f4e3d7]">  
                {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : null}  
              </div>  
              <div className="min-w-0">  
                <h3 className="truncate text-sm font-bold text-[#4b3b33]">{p.name}</h3>  
                <p className="text-[10px] text-[#b8927c]">{p.slug}</p>  
                <div className="mt-2 flex flex-wrap gap-1">  
                  {p.product_type ? (  
                    <span className="rounded-full bg-[#fdf2e9] px-2 py-0.5 text-[9px] font-bold text-[#a07d68]">  
                      {p.product_type}  
                    </span>  
                  ) : null}  
                  {p.gender?.map((g) => (  
                    <span  
                      key={g}  
                      className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600"  
                    >  
                      {g}  
                    </span>  
                  ))}  
                </div>  
              </div>  
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#ead8cd] pt-4 md:mt-0 md:border-0 md:pt-0 md:contents">  
              <div className="md:col-span-2">  
                <p className="text-xs font-bold md:text-sm">₹{formatINRFromPaise(p.price_cents)}</p>  
                <p className="text-[10px] text-gray-400 md:hidden">Price</p>  
              </div>  
              <div className="md:col-span-1">  
                <p className="text-xs font-bold md:text-sm">{p.stock}</p>  
                <p className="text-[10px] text-gray-400 md:hidden">Stock</p>  
              </div>  
              <div className="md:col-span-2 md:flex md:justify-center">  
                <span  
                  className={cn(  
                    'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase',  
                    p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'  
                  )}  
                >  
                  {p.is_active ? 'Active' : 'Hidden'}  
                </span>  
              </div>  
              <div className="flex gap-2 md:col-span-2 md:justify-end">  
                <button  
                  onClick={() => void openEditModal(p)}  
                  className="rounded-xl border border-[#ead8cd] p-2 text-xs font-bold hover:bg-[#fdf7f2]"  
                >  
                  Edit  
                </button>  
                <button  
                  onClick={() => void deleteProduct(p)}  
                  className="rounded-xl border border-red-100 p-2 text-xs font-bold text-red-500 hover:bg-red-50"  
                >  
                  ✕  
                </button>  
              </div>  
            </div>  
          </div>  
        ))}

        {filtered.length === 0 && <div className="p-10 text-center text-sm text-gray-400">No items matched.</div>}  
      </div>  
    </div>

    <Modal open={modalOpen} title={modalMode === 'add' ? 'New Creation' : 'Update Details'} onClose={closeModal}>  
      <form onSubmit={onSave} className="space-y-6">  
        <div className="grid gap-4 md:grid-cols-2">  
          <div className="md:col-span-2">  
            <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#a07d68]">Product Name *</label>  
            <input  
              value={form.name}  
              onChange={(e) =>  
                setForm((prev) => ({ ...prev, name: e.target.value, slug: prev.slug || slugify(e.target.value) }))  
              }  
              className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm outline-none focus:border-[#4b3b33]"  
              required  
            />  
          </div>

          <div className="md:col-span-2">  
            <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#a07d68]">Search Slug *</label>  
            <input  
              value={form.slug}  
              onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}  
              className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm outline-none focus:border-[#4b3b33]"  
              required  
            />  
          </div>

          <div>  
            <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#a07d68]">Price (INR) *</label>  
            <input  
              value={form.price_inr}  
              onChange={(e) => setForm((prev) => ({ ...prev, price_inr: e.target.value }))}  
              className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm"  
              placeholder="e.g. 1200"  
              required  
            />  
          </div>

          <div>  
            <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#a07d68]">  
              Inventory Count *  
            </label>  
            <input  
              type="number"  
              value={form.stock}  
              onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}  
              className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm"  
              required  
            />  
          </div>  
        </div>

        <div className="grid gap-4 md:grid-cols-2">  
          <div>  
            <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#a07d68]">Category Type</label>  
            <select  
              value={form.product_type}  
              onChange={(e) => setForm((prev) => ({ ...prev, product_type: e.target.value }))}  
              className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm"  
            >  
              <option value="">None</option>  
              {PRODUCT_TYPES.map((t) => (  
                <option key={t.value} value={t.value}>  
                  {t.label}  
                </option>  
              ))}  
            </select>  
          </div>

          <div>  
            <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#a07d68]">Gender Filter</label>  
            <div className="flex gap-4 pt-2">  
              {(['boys', 'girls'] as const).map((g) => (  
                <label key={g} className="flex items-center gap-2 text-sm">  
                  <input  
                    type="checkbox"  
                    checked={form.gender.includes(g)}  
                    onChange={() => setForm((prev) => ({ ...prev, gender: toggleInArray(prev.gender, g) }))}  
                    className="rounded"  
                  />  
                  {g.charAt(0).toUpperCase() + g.slice(1)}  
                </label>  
              ))}  
            </div>  
          </div>  
        </div>

        {/* SIZES */}  
        <div>  
          <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#a07d68]">Sizes (Age)</label>

          <div className="mt-2 rounded-2xl border border-[#ead8cd] bg-[#fdf7f2] p-4 space-y-4">  
            {/* Quick picks (optional) */}  
            <div>  
              <div className="text-[11px] font-bold text-[#4b3b33]">Quick pick (months)</div>  
              <div className="mt-2 flex flex-wrap gap-2">  
                {[12, 18, 24, 36, 48, 60, 72, 84, 120, 132, 156].map((m) => {  
                  const active = form.age_months.includes(m);  
                  return (  
                    <button  
                      key={m}  
                      type="button"  
                      onClick={() =>  
                        setForm((prev) => ({  
                          ...prev,  
                          age_months: normalizeAgeMonths(  
                            prev.age_months.includes(m) ? prev.age_months.filter((x) => x !== m) : [...prev.age_months, m]  
                          ),  
                        }))  
                      }  
                      className={cn(  
                        'rounded-full px-3 py-1 text-[11px] font-bold border transition',  
                        active  
                          ? 'bg-[#4b3b33] text-white border-[#4b3b33]'  
                          : 'bg-white text-[#4b3b33] border-[#ead8cd] hover:bg-[#fff7f0]'  
                      )}  
                    >  
                      {formatAgeFromMonths(m)}  
                    </button>  
                  );  
                })}  
              </div>  
              <p className="mt-2 text-[11px] text-gray-600">  
                Quick pick updates <span className="font-mono">age_months</span> directly.  
              </p>  
            </div>

            {/* Boundary inputs (the main requested feature) */}  
            <div className="border-t border-[#ead8cd] pt-4">  
              <div className="text-[11px] font-bold text-[#4b3b33]">Boundary points</div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">  
                <div>  
                  <div className="text-[11px] font-bold text-[#4b3b33]">Months boundary points</div>  
                  <p className="text-[11px] text-gray-600">  
                    Example: <span className="font-mono">12,18</span> (for "12–18 months")  
                  </p>  
                  <input  
                    type="text"  
                    inputMode="numeric"  
                    value={form.age_month_points_text}  
                    onChange={(e) => setForm((prev) => ({ ...prev, age_month_points_text: e.target.value }))}  
                    className="mt-2 w-full rounded-xl border border-[#ead8cd] bg-white p-3 text-sm"  
                    placeholder="12,18"  
                  />  
                </div>

                <div>  
                  <div className="text-[11px] font-bold text-[#4b3b33]">Years boundary points</div>  
                  <p className="text-[11px] text-gray-600">  
                    Example: <span className="font-mono">2,3,4,5,6,7,10,11,13</span>  
                  </p>  
                  <input  
                    type="text"  
                    inputMode="numeric"  
                    value={form.age_year_points_text}  
                    onChange={(e) => setForm((prev) => ({ ...prev, age_year_points_text: e.target.value }))}  
                    className="mt-2 w-full rounded-xl border border-[#ead8cd] bg-white p-3 text-sm"  
                    placeholder="2,3,4,5,6,7,10,11,13"  
                  />  
                </div>  
              </div>

              <div className="mt-3 flex flex-wrap gap-2">  
                <button  
                  type="button"  
                  onClick={() => {  
                    const monthsText = form.age_month_points_text;  
                    const yearsText = form.age_year_points_text;  
                    const computed = computeAgeMonthsFromTexts(monthsText, yearsText);  
                    setForm((prev) => ({ ...prev, age_months: computed }));  
                  }}  
                  className="rounded-xl bg-[#4b3b33] px-3 py-2 text-xs font-bold text-white"  
                >  
                  Update sizes  
                </button>

                <button  
                  type="button"  
                  onClick={() =>  
                    setForm((prev) => ({  
                      ...prev,  
                      age_month_points_text: '12,18',  
                      age_year_points_text: '2,3,4,5,6,7,10,11,13',  
                      age_months: computeAgeMonthsFromTexts('12,18', '2,3,4,5,6,7,10,11,13'),  
                    }))  
                  }  
                  className="rounded-xl border border-[#ead8cd] bg-white px-3 py-2 text-xs font-bold text-[#4b3b33] hover:bg-[#fff7f0]"  
                >  
                  Use your standard preset  
                </button>

                <button  
                  type="button"  
                  onClick={() =>  
                    setForm((prev) => ({  
                      ...prev,  
                      age_months: [],  
                      age_month_points_text: '',  
                      age_year_points_text: '',  
                    }))  
                  }  
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"  
                >  
                  Clear  
                </button>  
              </div>

              <div className="mt-3 rounded-xl border border-[#ead8cd] bg-white p-3">  
                <div className="text-[11px] font-bold text-[#4b3b33]">  
                  Saved to DB as <span className="font-mono">age_months</span>  
                </div>  
                <div className="mt-2 text-xs font-mono text-gray-700 break-words">  
                  {JSON.stringify(normalizeAgeMonths(form.age_months))}  
                </div>  
                <div className="mt-2 text-[11px] text-gray-600">  
                  Labels preview:{' '}  
                  <span className="font-bold text-[#4b3b33]">  
                    {form.age_months.length ? normalizeAgeMonths(form.age_months).map(formatAgeFromMonths).join(', ') : 'None'}  
                  </span>  
                </div>  
              </div>  
            </div>  
          </div>  
        </div>

        <div>  
          <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#a07d68]">Description</label>  
          <textarea  
            value={form.description}  
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}  
            className="h-24 w-full rounded-xl border border-[#ead8cd] p-3 text-sm"  
          />  
        </div>

        {/* HERO */}  
        <div>  
          <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#a07d68]">Hero Image</label>  
          <div className="mt-2 space-y-3">  
            <input  
              type="file"  
              accept="image/*"  
              onChange={(e) => setForm((prev) => ({ ...prev, image_file: e.target.files?.[0] ?? null }))}  
              className="w-full text-xs"  
            />  
            <input  
              value={form.image_url}  
              onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}  
              placeholder="Or paste external URL"  
              className="w-full rounded-xl border border-[#ead8cd] p-3 text-sm"  
            />  
            <p className="text-[11px] text-gray-500">  
              If you choose a file, it uploads via the admin API (no browser Storage upload).  
            </p>  
          </div>  
        </div>

        {/* GALLERY */}  
        <div>  
          <label className="mb-1.5 block text-[11px] font-bold uppercase text-[#a07d68]">Gallery Images</label>

          {modalMode === 'edit' ? (  
            <div className="mt-2 space-y-2">  
              <div className="text-[11px] font-bold text-[#4b3b33]">Existing gallery</div>  
              {loadingGallery ? (  
                <div className="text-[11px] text-gray-500">Loading gallery…</div>  
              ) : existingGallery.length ? (  
                <div className="grid grid-cols-4 gap-2 rounded-xl border border-[#ead8cd] p-3">  
                  {existingGallery.map((img) => (  
                    <img  
                      key={img.id}  
                      src={img.url}  
                      alt=""  
                      className="h-20 w-20 rounded-xl border border-[#ead8cd] object-cover"  
                    />  
                  ))}  
                </div>  
              ) : (  
                <div className="text-[11px] text-gray-500">No gallery images saved yet.</div>  
              )}  
            </div>  
          ) : null}

          <div className="mt-3 space-y-3">  
            <input  
              type="file"  
              accept="image/*"  
              multiple  
              onChange={(e) => {  
                const incoming = Array.from(e.target.files ?? []);  
                setForm((prev) => ({ ...prev, gallery_files: [...prev.gallery_files, ...incoming] }));  
              }}  
              className="w-full text-xs"  
            />

            {form.gallery_files.length ? (  
              <div className="rounded-xl border border-[#ead8cd] p-3">  
                <div className="mb-2 text-[11px] font-bold text-[#4b3b33]">Selected files (to add)</div>  
                <ul className="space-y-2 text-xs text-gray-700">  
                  {form.gallery_files.map((f, idx) => (  
                    <li key={`${f.name}-${idx}`} className="flex items-center justify-between gap-3">  
                      <span className="truncate">{f.name}</span>  
                      <button  
                        type="button"  
                        onClick={() =>  
                          setForm((prev) => ({  
                            ...prev,  
                            gallery_files: prev.gallery_files.filter((_, i) => i !== idx),  
                          }))  
                        }  
                        className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"  
                      >  
                        Remove  
                      </button>  
                    </li>  
                  ))}  
                </ul>  
              </div>  
            ) : (  
              <p className="text-[11px] text-gray-500">Add one or more images. They'll be uploaded and saved.</p>  
            )}  
          </div>  
        </div>
<div className="flex items-center gap-3">  
          <input  
            type="checkbox"  
            checked={form.is_partywear}  
            onChange={(e) => setForm((prev) => ({ ...prev, is_partywear: e.target.checked }))}  
            className="h-5 w-5 rounded-md text-[#4b3b33]"  
          />  
          <label className="text-sm font-bold text-[#4b3b33]">Is this a Party wear ?</label>  
        </div>
        <div className="flex items-center gap-3">  
          <input  
            type="checkbox"  
            checked={form.is_active}  
            onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}  
            className="h-5 w-5 rounded-md text-[#4b3b33]"  
          />  
          <label className="text-sm font-bold text-[#4b3b33]">Make live on website</label>  
        </div>

        <button  
          type="submit"  
          disabled={saving}  
          className="w-full rounded-2xl bg-[#4b3b33] py-4 font-bold text-white shadow-lg active:scale-95 disabled:opacity-50"  
        >  
          {saving ? 'Synchronizing...' : modalMode === 'add' ? 'Publish Product' : 'Save Updates'}  
        </button>  
      </form>  
    </Modal>  
  </div>  
);  
}  