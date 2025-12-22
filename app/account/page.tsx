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
  
  // Load user and profile  
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
  
      if (error) {  
        console.error(error);  
      }
  
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
  
  if (loading) {  
    return (  
      <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33]">  
        <div className="flex min-h-screen items-center justify-center">  
          <p className="text-sm text-[#7c675b]">Loading your profile...</p>  
        </div>  
      </main>  
    );  
  }
  
  const handleChange =  
    (field: keyof Profile) =>  
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {  
      setProfile((prev) => ({ ...prev, [field]: e.target.value }));  
    };
  
  const handleSave = async (e: React.FormEvent) => {  
    e.preventDefault();  
    if (!userId) return;
  
    setSaving(true);  
    setError(null);  
    setMessage(null);
  
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
  
      if (error) {  
        setError(error.message);  
      } else {  
        setMessage('Profile saved.');  
      }  
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
  
  return (  
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33]">  
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-8">  
        <div className="w-full rounded-3xl border border-[#ead8cd] bg-white/95 p-6 shadow-[0_25px_80px_rgba(148,116,96,0.35)] sm:p-8">  
          <div className="mb-6 flex items-center justify-between">  
            <div>  
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8927c]">  
                Your profile  
              </p>  
              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">  
                Missy &amp; Mopet family details  
              </h1>  
            </div>  
            <button  
              type="button"  
              onClick={handleLogout}  
              className="rounded-full border border-[#ead8cd] bg-white px-3 py-1.5 text-[11px] text-[#7c675b] hover:bg-[#fdf2e9]"  
            >  
              Log out  
            </button>  
          </div>
  
          <form onSubmit={handleSave} className="space-y-6 text-sm">  
            {/* Parent section */}  
            <section className="space-y-3">  
              <h2 className="text-sm font-semibold text-[#4b3b33]">  
                About you  
              </h2>  
              <div>  
                <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                  Name  
                </label>  
                <input  
                  type="text"  
                  value={profile.name || ''}  
                  onChange={handleChange('name')}  
                  className="w-full rounded-lg border border-[#ead8cd] bg-[#fdf7f2] px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
                />  
              </div>  
              <div>  
                <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                  Email  
                </label>  
                <input  
                  type="email"  
                  value={profile.email || ''}  
                  readOnly  
                  className="w-full cursor-not-allowed rounded-lg border border-[#ead8cd] bg-[#f5eee8] px-3 py-2 text-sm text-[#7c675b]"  
                />  
                <p className="mt-1 text-[11px] text-[#a07d68]">  
                  Email comes from your sign-in and is used for order updates.  
                </p>  
              </div>  
              <div>  
                <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                  Phone (optional)  
                </label>  
                <input  
                  type="tel"  
                  value={profile.phone || ''}  
                  onChange={handleChange('phone')}  
                  className="w-full rounded-lg border border-[#ead8cd] bg-[#fdf7f2] px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
                />  
              </div>  
            </section>
  
            {/* Child section */}  
            <section className="space-y-3">  
              <h2 className="text-sm font-semibold text-[#4b3b33]">  
                About your little one  
              </h2>  
              <div>  
                <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                  Child&apos;s name  
                </label>  
                <input  
                  type="text"  
                  value={profile.child_name || ''}  
                  onChange={handleChange('child_name')}  
                  className="w-full rounded-lg border border-[#ead8cd] bg-[#fdf7f2] px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
                />  
              </div>  
              <div className="flex flex-wrap gap-3">  
                <div className="flex-1 min-w-[140px]">  
                  <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                    Child&apos;s gender  
                  </label>  
                  <select  
                    value={profile.child_gender || ''}  
                    onChange={handleChange('child_gender')}  
                    className="w-full rounded-lg border border-[#ead8cd] bg-[#fdf7f2] px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
                  >  
                    <option value="">Select</option>  
                    <option value="girl">Girl</option>  
                    <option value="boy">Boy</option>  
                    <option value="neutral">Neutral / prefer not to say</option>  
                  </select>  
                </div>  
                <div className="flex-1 min-w-[140px]">  
                  <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                    Age group  
                  </label>  
                  <select  
                    value={profile.child_age_group || ''}  
                    onChange={handleChange('child_age_group')}  
                    className="w-full rounded-lg border border-[#ead8cd] bg-[#fdf7f2] px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
                  >  
                    <option value="">Select</option>  
                    <option value="newborn">Newborn (0–18 months)</option>  
                    <option value="toddler">Toddler (2–5 years)</option>  
                    <option value="big-kid">Big kid (5–10 years)</option>  
                  </select>  
                </div>  
              </div>  
            </section>
  
            <div className="flex items-center justify-between pt-2">  
              <div className="text-[11px] text-[#a07d68]">  
                {error && <p className="text-red-500">Error: {error}</p>}  
                {message && <p className="text-emerald-600">{message}</p>}  
              </div>  
              <button  
                type="submit"  
                disabled={saving}  
                className="rounded-full bg-[#4b3b33] px-6 py-2 text-sm font-medium text-[#fdf7f2] hover:bg-[#3a2e29] disabled:opacity-60"  
              >  
                {saving ? 'Saving...' : 'Save profile'}  
              </button>  
            </div>  
          </form>  
                    {/* Next actions section */}  
          <div className="mt-6 border-t border-[#ead8cd] pt-4 text-xs text-[#7c675b] sm:text-sm">  
            <p className="mb-2 font-semibold text-[#4b3b33]">  
              What would you like to do next?  
            </p>  
            <div className="flex flex-wrap gap-3">  
              <button  
                type="button"  
                onClick={() => router.push('/')}  
                className="inline-flex items-center rounded-full bg-[#4b3b33] px-4 py-2 text-xs font-medium text-[#fdf7f2] hover:bg-[#3a2e29]"  
              >  
                Go to homepage  
              </button>  
              <button  
                type="button"  
                onClick={() => router.push('/shop')}  
                className="inline-flex items-center rounded-full border border-[#ead8cd] bg-white px-4 py-2 text-xs font-medium text-[#4b3b33] hover:bg-[#fdf2e9]"  
              >  
                Browse outfits  
              </button>  
              <button  
                type="button"  
                onClick={() => router.push('/newborn-kit')}  
                className="inline-flex items-center rounded-full border border-[#ead8cd] bg-white px-4 py-2 text-xs font-medium text-[#4b3b33] hover:bg-[#fdf2e9]"  
              >  
                Explore Newborn Kit  
              </button>  
              <button  
                type="button"  
                onClick={() => router.push('/customize')}  
                className="inline-flex items-center rounded-full border border-[#ead8cd] bg-white px-4 py-2 text-xs font-medium text-[#4b3b33] hover:bg-[#fdf2e9]"  
              >  
                Customize an outfit  
              </button>  
            </div>  
          </div>  
        </div>  
      </div>  
    </main>  
  );  
}  