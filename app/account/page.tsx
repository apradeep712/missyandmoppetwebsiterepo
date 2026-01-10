'use client';

import { useEffect, useState } from 'react';  
import { useRouter } from 'next/navigation';  
import { useSupabaseBrowserClient } from '../providers';

type Profile = {  
  name: string | null;  
  email: string | null;  
  phone: string | null;  
  child_name: string | null;  
  child_gender: string | null;  
  child_age_group: string | null;  
};

export default function AccountPage() {  
  const supabase = useSupabaseBrowserClient();  
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);  
  const [userId, setUserId] = useState<string | null>(null);  
  const [profile, setProfile] = useState<Profile>({  
    name: '',  
    email: '',  
    phone: '',  
    child_name: '',  
    child_gender: '',  
    child_age_group: '',  
  });  
  const [saving, setSaving] = useState(false);  
  const [message, setMessage] = useState<string | null>(null);  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {  
    const load = async () => {  
      const { data } = await supabase.auth.getUser();  
      const user = data.user;  
      if (!user) {  
        router.push('/auth');  
        return;  
      }
      setUserId(user.id);
      const { data: existing, error } = await supabase  
        .from('users')  
        .select('name, email, phone, child_name, child_gender, child_age_group')  
        .eq('id', user.id)  
        .maybeSingle();
      if (error) console.error(error);  

      setProfile({  
        name: existing?.name ?? '',  
        email: existing?.email ?? user.email ?? '',  
        phone: existing?.phone ?? '',  
        child_name: existing?.child_name ?? '',  
        child_gender: existing?.child_gender ?? '',  
        child_age_group: existing?.child_age_group ?? '',  
      });
      setLoading(false);  
    };
    load();  
  }, [supabase, router]);

  const handleChange = (field: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {  
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));  
  };

  const handleSave = async (e: React.FormEvent) => {  
    e.preventDefault();  
    if (!userId) return;
    setSaving(true); setError(null); setMessage(null);
    try {  
      const { error } = await supabase.from('users').upsert(  
        {  
          id: userId,  
          name: profile.name || null,  
          email: profile.email || null,  
          phone: profile.phone || null,  
          child_name: profile.child_name || null,  
          child_gender: profile.child_gender || null,  
          child_age_group: profile.child_age_group || null,  
        },  
        { onConflict: 'id' }  
      );
      if (error) setError(error.message);  
      else setMessage('Profile updated beautifully.');  
    } catch (err: any) {  
      setError(err.message || 'Unexpected error');  
    } finally {  
      setSaving(false);  
    }  
  };

  const handleLogout = async () => {  
    await supabase.auth.signOut();  
    router.push('/');  
  };

  if (loading) {  
    return (  
      <main className="min-h-screen bg-[#fdf7f2] flex items-center justify-center">  
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ead8cd] border-t-[#4b3b33] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-[#7c675b]">Preparing your dashboard...</p>  
        </div>  
      </main>  
    );  
  }

  return (  
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33] selection:bg-[#ead8cd]">  
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-20">  
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#4b3b33]">Family Profile</h1>
            <p className="text-[#7c675b] mt-2 italic">Tailoring the Missy & Moppet experience for you</p>
          </div>
          <button  
            type="button"  
            onClick={handleLogout}  
            className="w-fit rounded-full border border-[#ead8cd] bg-white px-5 py-2 text-xs font-semibold text-[#7c675b] transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-100"  
          >  
            Sign Out  
          </button>  
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <div className="rounded-[2rem] border border-[#ead8cd] bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-brown-900/5 sm:p-10">  
              <form onSubmit={handleSave} className="space-y-10">  
                
                {/* Parent Section */}  
                <section>  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#fdf7f2] rounded-lg text-[#a07d68]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <h2 className="text-lg font-bold">Guardian Details</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">  
                    <div className="sm:col-span-2">  
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#a07d68]">Full Name</label>  
                      <input type="text" value={profile.name || ''} onChange={handleChange('name')} className="w-full rounded-xl border border-[#ead8cd] bg-[#fdf7f2]/50 px-4 py-3 text-sm transition-focus outline-none focus:bg-white focus:ring-2 focus:ring-[#ead8cd]" placeholder="How should we address you?" />  
                    </div>  
                    <div>  
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#a07d68]">Email Address</label>  
                      <input type="email" value={profile.email || ''} readOnly className="w-full cursor-not-allowed rounded-xl border border-[#ead8cd] bg-[#f5eee8] px-4 py-3 text-sm text-[#7c675b]" />  
                    </div>  
                    <div>  
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#a07d68]">Phone Number</label>  
                      <input type="tel" value={profile.phone || ''} onChange={handleChange('phone')} className="w-full rounded-xl border border-[#ead8cd] bg-[#fdf7f2]/50 px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#ead8cd]" placeholder="+1..." />  
                    </div>  
                  </div>  
                </section>

                {/* Child Section */}  
                <section>  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#fdf7f2] rounded-lg text-[#a07d68]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h2 className="text-lg font-bold">Little One&apos;s Details</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">  
                    <div className="sm:col-span-2">  
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#a07d68]">Child&apos;s Name</label>  
                      <input type="text" value={profile.child_name || ''} onChange={handleChange('child_name')} className="w-full rounded-xl border border-[#ead8cd] bg-[#fdf7f2]/50 px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#ead8cd]" placeholder="Their name or nickname" />  
                    </div>  
                    <div>  
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#a07d68]">Gender</label>  
                      <select value={profile.child_gender || ''} onChange={handleChange('child_gender')} className="w-full rounded-xl border border-[#ead8cd] bg-[#fdf7f2]/50 px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#ead8cd] appearance-none">  
                        <option value="">Select Gender</option>  
                        <option value="girl">Girl</option>  
                        <option value="boy">Boy</option>  
                        <option value="neutral">Neutral / Prefer not to say</option>  
                      </select>  
                    </div>  
                    <div>  
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#a07d68]">Age Group</label>  
                      <select value={profile.child_age_group || ''} onChange={handleChange('child_age_group')} className="w-full rounded-xl border border-[#ead8cd] bg-[#fdf7f2]/50 px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#ead8cd] appearance-none">  
                        <option value="">Select Age</option>  
                        <option value="newborn">Newborn (0–18m)</option>  
                        <option value="toddler">Toddler (2–5y)</option>  
                        <option value="big-kid">Big kid (5–10y)</option>  
                      </select>  
                    </div>  
                  </div>  
                </section>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ead8cd]/50">  
                  <div className="text-xs font-medium">  
                    {error && <p className="text-red-500 animate-pulse">✕ {error}</p>}  
                    {message && <p className="text-emerald-600">✓ {message}</p>}  
                  </div>  
                  <button type="submit" disabled={saving} className="w-full sm:w-auto rounded-full bg-[#4b3b33] px-10 py-3 text-sm font-bold text-[#fdf7f2] shadow-lg shadow-brown-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60">  
                    {saving ? 'Updating...' : 'Update Profile'}  
                  </button>  
                </div>  
              </form>  
            </div>
          </div>

          {/* Right Column: Quick Links & Stats */}
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-[#ead8cd] bg-[#4b3b33] p-8 text-[#fdf7f2] shadow-xl">
              <h3 className="text-xl font-serif font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => router.push('/shop')} className="w-full flex items-center justify-between group bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all">
                  <span className="text-sm font-medium">Browse Outfits</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
                <button onClick={() => router.push('/customize')} className="w-full flex items-center justify-between group bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all">
                  <span className="text-sm font-medium">Customize Look</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#ead8cd] bg-white p-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#a07d68] mb-4">Support</h3>
              <p className="text-sm text-[#7c675b] leading-relaxed">
                Need help with your profile or an existing order? Our concierge team is here for you.
              </p>
              <button className="mt-4 text-sm font-bold text-[#4b3b33] underline underline-offset-4 hover:text-[#a07d68] transition-colors">
                Contact Concierge
              </button>
            </div>
          </div>

        </div>
      </div>  
    </main>  
  );  
}