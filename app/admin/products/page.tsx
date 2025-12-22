'use client';
  
import { useEffect, useState } from 'react';  
import { useSupabaseBrowserClient } from '@/app/providers';  
import { AGE_BUCKETS } from '@/lib/ageBuckets';
  
type Product = {  
  id: string;  
  name: string;  
  slug: string;  
  description: string | null;  
  price_cents: number;  
  currency: string;  
  image_url: string | null;  
  age_buckets: string[] | null;  
  is_active: boolean;  
};
  
type FormState = {  
  id: string | null;  
  name: string;  
  slug: string;  
  description: string;  
  price: string; // in rupees as string  
  currency: string;  
  image_url: string;  
  age_buckets: string[];  
  is_active: boolean;  
};
  
export default function AdminProductsPage() {  
  const supabase = useSupabaseBrowserClient();  
  const [products, setProducts] = useState<Product[]>([]);  
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState<FormState>({  
    id: null,  
    name: '',  
    slug: '',  
    description: '',  
    price: '',  
    currency: 'INR',  
    image_url: '',  
    age_buckets: [],  
    is_active: true,  
  });
  
  const [saving, setSaving] = useState(false);  
  const [error, setError] = useState<string | null>(null);
  
  // Load products from Supabase  
  const loadProducts = async () => {  
    setLoading(true);  
    const { data, error } = await supabase  
      .from('products')  
      .select(  
        'id, name, slug, description, price_cents, currency, image_url, age_buckets, is_active'  
      )  
      .order('created_at', { ascending: false });
  
    if (!error && data) {  
      setProducts(data as Product[]);  
    } else if (error) {  
      console.error(error);  
      setError(error.message);  
    }  
    setLoading(false);  
  };
  
  useEffect(() => {  
    loadProducts();  
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, []);
  
  const resetForm = () => {  
    setForm({  
      id: null,  
      name: '',  
      slug: '',  
      description: '',  
      price: '',  
      currency: 'INR',  
      image_url: '',  
      age_buckets: [],  
      is_active: true,  
    });  
    setError(null);  
  };
  
  const handleEdit = (p: Product) => {  
    setForm({  
      id: p.id,  
      name: p.name,  
      slug: p.slug,  
      description: p.description || '',  
      price: (p.price_cents / 100).toString(),  
      currency: p.currency,  
      image_url: p.image_url || '',  
      age_buckets: p.age_buckets || [],  
      is_active: p.is_active,  
    });  
    setError(null);  
  };
  
  const handleDelete = async (id: string) => {  
    if (!confirm('Delete this product?')) return;  
    const { error } = await supabase.from('products').delete().eq('id', id);  
    if (error) {  
      console.error(error);  
      alert('Failed to delete product');  
      return;  
    }  
    setProducts((prev) => prev.filter((p) => p.id !== id));  
    if (form.id === id) resetForm();  
  };
  
  const onChange =  
    (field: keyof FormState) =>  
    (  
      e:  
        | React.ChangeEvent<HTMLInputElement>  
        | React.ChangeEvent<HTMLTextAreaElement>  
        | React.ChangeEvent<HTMLSelectElement>  
    ) => {  
      if (field === 'is_active') {  
        const checked = (e.target as HTMLInputElement).checked;  
        setForm((prev) => ({ ...prev, is_active: checked }));  
      } else {  
        const value = e.target.value;  
        setForm((prev) => ({ ...prev, [field]: value }));  
      }  
    };
  
  const toggleAgeBucket = (id: string) => {  
    setForm((prev) => ({  
      ...prev,  
      age_buckets: prev.age_buckets.includes(id)  
        ? prev.age_buckets.filter((b) => b !== id)  
        : [...prev.age_buckets, id],  
    }));  
  };
  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    setSaving(true);  
    setError(null);
  
    const price_cents = Math.round(Number(form.price || '0') * 100);
  
    if (!form.name || !form.slug || !price_cents) {  
      setError('Name, slug and price are required.');  
      setSaving(false);  
      return;  
    }
  
    const payload = {  
      name: form.name,  
      slug: form.slug,  
      description: form.description || null,  
      price_cents,  
      currency: form.currency || 'INR',  
      image_url: form.image_url || null,  
      age_buckets: form.age_buckets.length ? form.age_buckets : null,  
      is_active: form.is_active,  
    };
  
    if (form.id) {  
      const { data, error } = await supabase  
        .from('products')  
        .update(payload)  
        .eq('id', form.id)  
        .select('*')  
        .maybeSingle();
  
      if (error) {  
        console.error(error);  
        setError(error.message);  
      } else if (data) {  
        setProducts((prev) =>  
          prev.map((p) => (p.id === form.id ? (data as Product) : p))  
        );  
        resetForm();  
      }  
    } else {  
      const { data, error } = await supabase  
        .from('products')  
        .insert(payload)  
        .select('*')  
        .maybeSingle();
  
      if (error) {  
        console.error(error);  
        setError(error.message);  
      } else if (data) {  
        setProducts((prev) => [data as Product, ...prev]);  
        resetForm();  
      }  
    }
  
    setSaving(false);  
  };
  
  return (  
    <div>  
      <h1 className="text-xl font-semibold mb-4">Admin – Products</h1>
  
      {/* Add / Edit form */}  
      <section className="mb-8">  
        <h2 className="text-sm font-semibold mb-3">  
          {form.id ? 'Edit product' : 'Add new product'}  
        </h2>  
        <form  
          onSubmit={handleSubmit}  
          className="space-y-3 rounded-2xl border border-[#ead8cd] bg-[#fdf7f2] p-4 text-sm"  
        >  
          {error && (  
            <p className="text-xs text-red-500">Error: {error}</p>  
          )}
  
          {/* Name + Slug */}  
          <div className="grid gap-3 sm:grid-cols-2">  
            <div>  
              <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                Name  
              </label>  
              <input  
                type="text"  
                value={form.name}  
                onChange={onChange('name')}  
                className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
              />  
            </div>  
            <div>  
              <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                Slug (URL)  
              </label>  
              <input  
                type="text"  
                value={form.slug}  
                onChange={onChange('slug')}  
                placeholder="e.g. white-pastel-polo"  
                className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
              />  
            </div>  
          </div>
  
          {/* Price + Currency */}  
          <div className="grid gap-3 sm:grid-cols-3">  
            <div>  
              <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                Price (₹)  
              </label>  
              <input  
                type="number"  
                min="0"  
                value={form.price}  
                onChange={onChange('price')}  
                className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
              />  
            </div>  
            <div>  
              <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                Currency  
              </label>  
              <input  
                type="text"  
                value={form.currency}  
                onChange={onChange('currency')}  
                className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
              />  
            </div>  
          </div>
  
          {/* Age buckets multi-select */}  
          <div>  
            <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
              Available for age groups  
            </label>  
            <div className="space-y-3">  
              {/* Baby */}  
              <div>  
                <p className="mb-1 text-[11px] font-semibold text-[#a07d68]">  
                  Baby (months)  
                </p>  
                <div className="flex flex-wrap gap-2">  
                  {AGE_BUCKETS.filter((b) => b.group === 'baby').map((b) => {  
                    const selected = form.age_buckets.includes(b.id);  
                    return (  
                      <button  
                        key={b.id}  
                        type="button"  
                        onClick={() => toggleAgeBucket(b.id)}  
                        className={`rounded-full border px-3 py-1.5 text-[11px] ${  
                          selected  
                            ? 'border-[#4b3b33] bg-[#fce8dd] text-[#4b3b33]'  
                            : 'border-[#ead8cd] bg-white text-[#7c675b] hover:bg-[#fdf2e9]'  
                        }`}  
                      >  
                        {b.label}  
                      </button>  
                    );  
                  })}  
                </div>  
              </div>
  
              {/* Toddler */}  
              <div>  
                <p className="mb-1 text-[11px] font-semibold text-[#a07d68]">  
                  Toddler  
                </p>  
                <div className="flex flex-wrap gap-2">  
                  {AGE_BUCKETS.filter((b) => b.group === 'toddler').map((b) => {  
                    const selected = form.age_buckets.includes(b.id);  
                    return (  
                      <button  
                        key={b.id}  
                        type="button"  
                        onClick={() => toggleAgeBucket(b.id)}  
                        className={`rounded-full border px-3 py-1.5 text-[11px] ${  
                          selected  
                            ? 'border-[#4b3b33] bg-[#fce8dd] text-[#4b3b33]'  
                            : 'border-[#ead8cd] bg-white text-[#7c675b] hover:bg-[#fdf2e9]'  
                        }`}  
                      >  
                        {b.label}  
                      </button>  
                    );  
                  })}  
                </div>  
              </div>
  
              {/* Kids */}  
              <div>  
                <p className="mb-1 text-[11px] font-semibold text-[#a07d68]">  
                  Kids  
                </p>  
                <div className="flex flex-wrap gap-2">  
                  {AGE_BUCKETS.filter((b) => b.group === 'kid').map((b) => {  
                    const selected = form.age_buckets.includes(b.id);  
                    return (  
                      <button  
                        key={b.id}  
                        type="button"  
                        onClick={() => toggleAgeBucket(b.id)}  
                        className={`rounded-full border px-3 py-1.5 text-[11px] ${  
                          selected  
                            ? 'border-[#4b3b33] bg-[#fce8dd] text-[#4b3b33]'  
                            : 'border-[#ead8cd] bg-white text-[#7c675b] hover:bg-[#fdf2e9]'  
                        }`}  
                      >  
                        {b.label}  
                      </button>  
                    );  
                  })}  
                </div>  
              </div>  
            </div>  
          </div>
  
          {/* Image URL */}  
          <div>  
            <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
              Image URL  
            </label>  
            <input  
              type="text"  
              value={form.image_url}  
              onChange={onChange('image_url')}  
              placeholder="/products/..." // or full https:// URL  
              className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
            />  
          </div>
  
          {/* Description */}  
          <div>  
            <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
              Description  
            </label>  
            <textarea  
              rows={3}  
              value={form.description}  
              onChange={onChange('description')}  
              className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
            />  
          </div>
  
          {/* Active + buttons */}  
          <div className="flex items-center justify-between pt-2">  
            <label className="flex items-center gap-2 text-xs text-[#7c675b]">  
              <input  
                type="checkbox"  
                checked={form.is_active}  
                onChange={onChange('is_active')}  
              />  
              Active  
            </label>  
            <div className="flex gap-2 text-xs">  
              {form.id && (  
                <button  
                  type="button"  
                  onClick={resetForm}  
                  className="rounded-full border border-[#ead8cd] bg-white px-4 py-2 hover:bg-[#fdf2e9]"  
                >  
                  Cancel edit  
                </button>  
              )}  
              <button  
                type="submit"  
                disabled={saving}  
                className="rounded-full bg-[#4b3b33] px-5 py-2 font-medium text-[#fdf7f2] hover:bg-[#3a2e29] disabled:opacity-60"  
              >  
                {saving  
                  ? 'Saving...'  
                  : form.id  
                  ? 'Save changes'  
                  : 'Add product'}  
              </button>  
            </div>  
          </div>  
        </form>  
      </section>
  
      {/* Existing products */}  
      <section>  
        <h2 className="text-sm font-semibold mb-3">Existing products</h2>  
        {loading ? (  
          <p className="text-sm text-[#7c675b]">Loading products...</p>  
        ) : products.length === 0 ? (  
          <p className="text-sm text-[#7c675b]">No products yet.</p>  
        ) : (  
          <div className="space-y-3">  
            {products.map((p) => (  
              <div  
                key={p.id}  
                className="flex items-center justify-between rounded-2xl border border-[#ead8cd] bg-[#fdf7f2] p-3 text-sm"  
              >  
                <div className="flex items-center gap-3">  
                  <div className="h-12 w-12 overflow-hidden rounded-xl bg-[#f4e3d7] flex-shrink-0">  
                    {p.image_url ? (  
                      // eslint-disable-next-line @next/next/no-img-element  
                      <img  
                        src={p.image_url}  
                        alt={p.name}  
                        className="h-full w-full object-cover"  
                      />  
                    ) : (  
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-[#a07d68]">  
                        No image  
                      </div>  
                    )}  
                  </div>  
                  <div>  
                    <div className="font-semibold">{p.name}</div>  
                    <div className="text-[11px] text-[#7c675b]">  
                      {p.age_buckets && p.age_buckets.length  
                        ? `${p.age_buckets.join(', ')} • `  
                        : ''}  
                      ₹{(p.price_cents / 100).toFixed(2)} •{' '}  
                      {p.is_active ? 'Active' : 'Inactive'}  
                    </div>  
                  </div>  
                </div>  
                <div className="flex gap-2 text-xs">  
                  <button  
                    type="button"  
                    onClick={() => handleEdit(p)}  
                    className="rounded-full border border-[#ead8cd] bg-white px-3 py-1 hover:bg-[#fdf2e9]"  
                  >  
                    Edit  
                  </button>  
                  <button  
                    type="button"  
                    onClick={() => handleDelete(p.id)}  
                    className="rounded-full border border-[#f5c2c2] bg-[#fee2e2] px-3 py-1 text-[#a85454] hover:bg-[#fecaca]"  
                  >  
                    Delete  
                  </button>  
                </div>  
              </div>  
            ))}  
          </div>  
        )}  
      </section>  
    </div>  
  );  
}  