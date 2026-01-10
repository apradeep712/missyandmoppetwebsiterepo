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

function getExt(filename: string) {  
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';  
  if (ext === 'jpeg') return 'jpg';  
  if (ext === 'jpg' || ext === 'png' || ext === 'webp') return ext;  
  return 'jpg';  
}  

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
  const [uploading, setUploading] = useState(false);  
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
    // Smooth scroll to form for mobile
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {  
    if (!confirm('Delete this flyer?')) return;  
    const { error } = await supabase.from('homepage_flyers').delete().eq('id', id);  
    if (error) {  
      alert('Failed to delete flyer');  
      return;  
    }  
    setFlyers((prev) => prev.filter((f) => f.id !== id));  
    if (editingId === id) resetForm();  
  };

  async function uploadFlyerImage(file: File) {  
    setUploading(true);  
    setError(null);

    const ext = getExt(file.name);  
    const path = `flyers/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage  
      .from('public-assets')  
      .upload(path, file, { upsert: false, contentType: file.type });
console.log('UPLOAD ERROR:', upErr);  

    if (upErr) {  
      setError(upErr.message);  
      setUploading(false);  
      return;  
    }

    const { data } = supabase.storage.from('public-assets').getPublicUrl(path);  
    setImageUrl(data.publicUrl);  
    setUploading(false);  
  }

  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    setSaving(true);  
    setError(null);

    if (!imageUrl) {  
      setError('Image URL is required.');  
      setSaving(false);  
      return;  
    }

    const payload = {  
      title: title || null,  
      image_url: imageUrl,  
      link_url: linkUrl || null,  
      sort_order: sortOrder,  
      is_active: isActive,  
    };

    if (editingId) {  
      const { data, error } = await supabase  
        .from('homepage_flyers')  
        .update(payload)  
        .eq('id', editingId)  
        .select('*')  
        .maybeSingle();

      if (error) setError(error.message);  
      else if (data) {  
        setFlyers((prev) => prev.map((f) => (f.id === editingId ? (data as Flyer) : f)));  
        resetForm();  
      }  
    } else {
        const { data: userData1 } = await supabase.auth.getUser();  
console.log('USER:', userData1?.user?.email, userData1?.user?.role);  
      const { data, error } = await supabase  
        .from('homepage_flyers')  
        .insert(payload)  
        .select('*')  
        .maybeSingle();
        const { data: userData } = await supabase.auth.getUser();  
console.log('admin user:', userData?.user?.email, userData?.user?.id);  

      if (error) setError(error.message);  
      else if (data) {  
        setFlyers((prev) => [...prev, data as Flyer].sort((a, b) => a.sort_order - b.sort_order));  
        resetForm();  
      }  
    }  
    setSaving(false);  
  };

  return (  
    <div className="space-y-10">  
      <header>
        <h1 className="text-2xl font-serif font-bold text-[#4b3b33]">Homepage Flyers</h1>
        <p className="text-sm text-[#7c675b]">Update the main banners on your storefront.</p>
      </header>
  
      {/* Existing flyers grid */}  
      <section>  
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#a07d68] mb-4">Live Banners</h2>  
        {loading ? (  
          <p className="text-sm text-[#7c675b] animate-pulse">Loading gallery...</p>  
        ) : flyers.length === 0 ? (  
          <div className="rounded-3xl border-2 border-dashed border-[#ead8cd] p-10 text-center">
            <p className="text-sm text-[#7c675b]">No flyers found. Add your first banner below.</p>
          </div>
        ) : (  
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">  
            {flyers.map((flyer) => (  
              <div   
                key={flyer.id}  
                className="group relative overflow-hidden rounded-3xl border border-[#ead8cd] bg-white p-2 shadow-sm transition-all hover:shadow-md"  
              >  
                <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#f4e3d7]">  
                  <img  
                    src={flyer.image_url}  
                    alt={flyer.title || 'Flyer'}  
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"  
                  />  
                </div>  
                
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="truncate font-bold text-[#4b3b33]">{flyer.title || 'Untitled Banner'}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${flyer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {flyer.is_active ? 'ACTIVE' : 'HIDDEN'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#7c675b]">Order: {flyer.sort_order}</p>
                  
                  <div className="mt-4 flex gap-2">  
                    <button  
                      onClick={() => handleEdit(flyer)}  
                      className="flex-1 rounded-xl border border-[#ead8cd] bg-white py-2 text-xs font-bold text-[#4b3b33] hover:bg-[#fdf7f2]"  
                    >  
                      Edit  
                    </button>  
                    <button  
                      onClick={() => handleDelete(flyer.id)}  
                      className="rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-100"  
                    >  
                      Delete  
                    </button>  
                  </div>  
                </div>
              </div>  
            ))}  
          </div>  
        )}  
      </section>

      {/* Add/edit form */}  
      <section className="border-t border-[#ead8cd] pt-10">  
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#4b3b33]">{editingId ? 'Modify Flyer' : 'Create New Banner'}</h2>  
          <p className="text-xs text-[#7c675b]">Upload high-quality images (recommended 1920x1080px).</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl bg-[#fdf7f2] p-6 shadow-inner md:grid-cols-2">  
          {error && <div className="col-span-full rounded-xl bg-red-50 p-3 text-xs text-red-500">Error: {error}</div>}
  
          <div className="space-y-4">
            <div>  
              <label className="mb-1.5 block text-xs font-bold uppercase text-[#7c675b]">Banner Title</label>  
              <input  
                type="text"  
                value={title}  
                onChange={(e) => setTitle(e.target.value)}  
                placeholder="e.g. New Summer Collection"
                className="w-full rounded-xl border border-[#ead8cd] bg-white px-4 py-2.5 text-sm text-[#4b3b33] outline-none focus:ring-2 focus:ring-[#d9b9a0]"  
              />  
            </div>

            <div>  
              <label className="mb-1.5 block text-xs font-bold uppercase text-[#7c675b]">Destination Link</label>  
              <input  
                type="text"  
                value={linkUrl}  
                onChange={(e) => setLinkUrl(e.target.value)}  
                placeholder="/shop or https://..."  
                className="w-full rounded-xl border border-[#ead8cd] bg-white px-4 py-2.5 text-sm text-[#4b3b33] outline-none focus:ring-2 focus:ring-[#d9b9a0]"  
              />  
            </div>

            <div className="flex gap-4">  
              <div className="flex-1">  
                <label className="mb-1.5 block text-xs font-bold uppercase text-[#7c675b]">Priority Order</label>  
                <input  
                  type="number"  
                  value={sortOrder}  
                  onChange={(e) => setSortOrder(Number(e.target.value))}  
                  className="w-full rounded-xl border border-[#ead8cd] bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#d9b9a0]"  
                />  
              </div>  
              <div className="flex items-end pb-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-[#7c675b]">  
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-[#ead8cd] text-[#4b3b33] focus:ring-[#d9b9a0]"
                    checked={isActive} 
                    onChange={(e) => setIsActive(e.target.checked)} 
                  />  
                  Active
                </label>  
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>  
              <label className="mb-1.5 block text-xs font-bold uppercase text-[#7c675b]">Banner Image</label>  
              <div className="group relative flex aspect-video w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#ead8cd] bg-white transition-colors hover:bg-white/50">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  <div className="text-center">
                    <span className="text-2xl">🖼️</span>
                    <p className="mt-1 text-[10px] text-[#a07d68]">No image selected</p>
                  </div>
                )}
                <input  
                  type="file"  
                  accept="image/*"  
                  disabled={uploading}  
                  onChange={(e) => {  
                    const f = e.target.files?.[0];  
                    if (f) uploadFlyerImage(f);  
                  }}  
                  className="absolute inset-0 cursor-pointer opacity-0"  
                />  
              </div>
              <p className="mt-2 text-[10px] text-[#7c675b]">
                {uploading ? "Uploading to storage..." : "Click image area to upload new file"}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">  
              {editingId && (  
                <button  
                  type="button"  
                  onClick={resetForm}  
                  className="rounded-full border border-[#ead8cd] bg-white px-6 py-2 text-xs font-bold text-[#4b3b33] hover:bg-white/50"  
                >  
                  Cancel  
                </button>  
              )}  
              <button  
                type="submit"  
                disabled={saving || uploading}  
                className="flex-1 rounded-full bg-[#4b3b33] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#4b3b33]/20 transition-all hover:bg-black disabled:opacity-50 md:flex-none"  
              >  
                {saving ? 'Processing...' : editingId ? 'Update Banner' : 'Publish Banner'}  
              </button>  
            </div>  
          </div>
        </form>  
      </section>  
    </div>  
  );  
}