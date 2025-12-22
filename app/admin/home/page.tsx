'use client';
  
import { useEffect, useState } from 'react';  
import { useSupabaseBrowserClient } from '@/app/providers';
  
type Flyer = {  
  id: string;  
  title: string | null;  
  image_url: string;  
  link_url: string | null;  
  sort_order: number;  
  is_active: boolean;  
};
  
export default function AdminHomePage() {  
  const supabase = useSupabaseBrowserClient();  
  const [flyers, setFlyers] = useState<Flyer[]>([]);  
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState<string | null>(null);  
  const [title, setTitle] = useState('');  
  const [imageUrl, setImageUrl] = useState('');  
  const [linkUrl, setLinkUrl] = useState('');  
  const [sortOrder, setSortOrder] = useState(0);  
  const [isActive, setIsActive] = useState(true);  
  const [saving, setSaving] = useState(false);  
  const [error, setError] = useState<string | null>(null);
  
  const loadFlyers = async () => {  
    setLoading(true);  
    const { data, error } = await supabase  
      .from('homepage_flyers')  
      .select('*')  
      .order('sort_order', { ascending: true });
  
    if (!error && data) {  
      setFlyers(data as Flyer[]);  
    } else if (error) {  
      console.error(error);  
      setError(error.message);  
    }  
    setLoading(false);  
  };
  
  useEffect(() => {  
    loadFlyers();  
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, []);
  
  const resetForm = () => {  
    setEditingId(null);  
    setTitle('');  
    setImageUrl('');  
    setLinkUrl('');  
    setSortOrder(0);  
    setIsActive(true);  
    setError(null);  
  };
  
  const handleEdit = (flyer: Flyer) => {  
    setEditingId(flyer.id);  
    setTitle(flyer.title || '');  
    setImageUrl(flyer.image_url);  
    setLinkUrl(flyer.link_url || '');  
    setSortOrder(flyer.sort_order);  
    setIsActive(flyer.is_active);  
    setError(null);  
  };
  
  const handleDelete = async (id: string) => {  
    if (!confirm('Delete this flyer?')) return;  
    const { error } = await supabase  
      .from('homepage_flyers')  
      .delete()  
      .eq('id', id);  
    if (error) {  
      console.error(error);  
      alert('Failed to delete flyer');  
      return;  
    }  
    setFlyers((prev) => prev.filter((f) => f.id !== id));  
    if (editingId === id) resetForm();  
  };
  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    setSaving(true);  
    setError(null);
  
    if (!imageUrl) {  
      setError('Image URL is required.');  
      setSaving(false);  
      return;  
    }
  
    if (editingId) {  
      const { data, error } = await supabase  
        .from('homepage_flyers')  
        .update({  
          title: title || null,  
          image_url: imageUrl,  
          link_url: linkUrl || null,  
          sort_order: sortOrder,  
          is_active: isActive,  
        })  
        .eq('id', editingId)  
        .select('*')  
        .maybeSingle();
  
      if (error) {  
        console.error(error);  
        setError(error.message);  
      } else if (data) {  
        setFlyers((prev) =>  
          prev.map((f) => (f.id === editingId ? (data as Flyer) : f))  
        );  
        resetForm();  
      }  
    } else {  
      const { data, error } = await supabase  
        .from('homepage_flyers')  
        .insert({  
          title: title || null,  
          image_url: imageUrl,  
          link_url: linkUrl || null,  
          sort_order: sortOrder,  
          is_active: isActive,  
        })  
        .select('*')  
        .maybeSingle();
  
      if (error) {  
        console.error(error);  
        setError(error.message);  
      } else if (data) {  
        setFlyers((prev) =>  
          [...prev, data as Flyer].sort((a, b) => a.sort_order - b.sort_order)  
        );  
        resetForm();  
      }  
    }
  
    setSaving(false);  
  };
  
  return (  
    <div>  
      <h1 className="text-xl font-semibold mb-4">Admin – Homepage flyers</h1>
  
      {/* Existing flyers list */}  
      <section className="mb-8">  
        <h2 className="text-sm font-semibold mb-3">Existing flyers</h2>  
        {loading ? (  
          <p className="text-sm text-[#7c675b]">Loading flyers...</p>  
        ) : flyers.length === 0 ? (  
          <p className="text-sm text-[#7c675b]">  
            No flyers yet. Add one below.  
          </p>  
        ) : (  
          <ul className="space-y-3">  
            {flyers.map((flyer) => (  
              <li  
                key={flyer.id}  
                className="flex items-center justify-between rounded-2xl border border-[#ead8cd] bg-[#fdf7f2] p-3 text-sm"  
              >  
                <div className="flex items-center gap-3">  
                  <div className="h-12 w-20 overflow-hidden rounded-xl bg-[#f4e3d7] flex-shrink-0">  
                    {/* eslint-disable-next-line @next/next/no-img-element */}  
                    <img  
                      src={flyer.image_url}  
                      alt={flyer.title || 'Flyer'}  
                      className="h-full w-full object-cover"  
                    />  
                  </div>  
                  <div>  
                    <div className="font-semibold">  
                      {flyer.title || '(No title)'}  
                    </div>  
                    <div className="text-[11px] text-[#7c675b]">  
                      Order: {flyer.sort_order} •{' '}  
                      {flyer.is_active ? 'Active' : 'Hidden'}  
                    </div>  
                    {flyer.link_url && (  
                      <div className="text-[11px] text-[#a07d68]">  
                        Link: {flyer.link_url}  
                      </div>  
                    )}  
                  </div>  
                </div>  
                <div className="flex gap-2 text-xs">  
                  <button  
                    type="button"  
                    onClick={() => handleEdit(flyer)}  
                    className="rounded-full border border-[#ead8cd] bg-white px-3 py-1 hover:bg-[#fdf2e9]"  
                  >  
                    Edit  
                  </button>  
                  <button  
                    type="button"  
                    onClick={() => handleDelete(flyer.id)}  
                    className="rounded-full border border-[#f5c2c2] bg-[#fee2e2] px-3 py-1 text-[#a85454] hover:bg-[#fecaca]"  
                  >  
                    Delete  
                  </button>  
                </div>  
              </li>  
            ))}  
          </ul>  
        )}  
      </section>
  
      {/* Add/edit form */}  
      <section>  
        <h2 className="text-sm font-semibold mb-3">  
          {editingId ? 'Edit flyer' : 'Add new flyer'}  
        </h2>  
        <form  
          onSubmit={handleSubmit}  
          className="space-y-3 rounded-2xl border border-[#ead8cd] bg-[#fdf7f2] p-4 text-sm"  
        >  
          {error && (  
            <p className="text-xs text-red-500">Error: {error}</p>  
          )}  
          <div>  
            <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
              Title (optional)  
            </label>  
            <input  
              type="text"  
              value={title}  
              onChange={(e) => setTitle(e.target.value)}  
              className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
            />  
          </div>  
          <div>  
            <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
              Image URL  
            </label>  
            <input  
              type="text"  
              required  
              value={imageUrl}  
              onChange={(e) => setImageUrl(e.target.value)}  
              placeholder="/hero/hero-1.jpg or full https:// URL"  
              className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
            />  
          </div>  
          <div>  
            <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
              Link URL (optional)  
            </label>  
            <input  
              type="text"  
              value={linkUrl}  
              onChange={(e) => setLinkUrl(e.target.value)}  
              placeholder="/shop, /newborn-kit or https://..."  
              className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
            />  
          </div>  
          <div className="flex flex-wrap items-center gap-3">  
            <div>  
              <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                Sort order  
              </label>  
              <input  
                type="number"  
                value={sortOrder}  
                onChange={(e) => setSortOrder(Number(e.target.value))}  
                className="w-24 rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
              />  
            </div>  
            <label className="mt-5 flex items-center gap-2 text-xs text-[#7c675b]">  
              <input  
                type="checkbox"  
                checked={isActive}  
                onChange={(e) => setIsActive(e.target.checked)}  
              />  
              Active  
            </label>  
          </div>  
          <div className="flex justify-end gap-2 pt-2 text-xs">  
            {editingId && (  
              <button  
                type="button"  
                onClick={resetForm}  
                className="rounded-full border border-[#ead8cd] bg-white px-4 py-2 hover:bg-[#fdf2e9]"  
              >  
                Cancel  
              </button>  
            )}  
            <button  
              type="submit"  
              disabled={saving}  
              className="rounded-full bg-[#4b3b33] px-5 py-2 font-medium text-[#fdf7f2] hover:bg-[#3a2e29] disabled:opacity-60"  
            >  
              {saving  
                ? 'Saving...'  
                : editingId  
                ? 'Save changes'  
                : 'Add flyer'}  
            </button>  
          </div>  
        </form>  
      </section>  
    </div>  
  );  
}  