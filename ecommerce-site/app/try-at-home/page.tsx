'use client';
  
import { useState } from 'react';  
import { useRouter } from 'next/navigation';  
import { useSupabaseBrowserClient } from '@/app/providers';  
import HomeHeader from '@/app/components/HomeHeader';  

import { useTryAtHomeStore } from '@/app/store/tryAtHomeStore';
import type React from 'react';  
  
type TryAtHomeFormState = {  
  name: string;  
  email: string;  
  phone: string;  
  address: string;  
  pincode: string;  
  notes: string;  
};
  
export default function TryAtHomePage() {  
  const supabase = useSupabaseBrowserClient();  
  const router = useRouter();  
  const { items, removeItem, clear } = useTryAtHomeStore();
  
  const [form, setForm] = useState<TryAtHomeFormState>({  
    name: '',  
    email: '',  
    phone: '',  
    address: '',  
    pincode: '',  
    notes: '',  
  });
  
  const [submitting, setSubmitting] = useState(false);  
  const [error, setError] = useState<string | null>(null);  
  const [success, setSuccess] = useState<string | null>(null);
  
  const onChange =  
    (field: keyof TryAtHomeFormState) =>  
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {  
      setForm((prev) => ({ ...prev, [field]: e.target.value }));  
    };
  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    setError(null);  
    setSuccess(null);
  
    // Enforce: must have between 1 and 3 items  
    if (items.length === 0) {  
      setError('Please add up to 3 pieces from product pages to Try at home before submitting.');  
      return;  
    }  
    if (items.length > 3) {  
      // Should not happen due to store guard, but keep as safety  
      setError('Sorry, maximum 3 pieces allowed for Try at home. Please remove some items.');  
      return;  
    }
  
    if (!form.name || !form.email || !form.phone || !form.address || !form.pincode) {  
      setError('Please fill in name, email, phone, address and pincode.');  
      return;  
    }
  
    setSubmitting(true);
  
    try {  
      // Optionally get current user for linking  
      const {  
        data: { user },  
      } = await supabase.auth.getUser();
  
      const payload = {  
        type: 'try_at_home',  
        name: form.name,  
        email: form.email,  
        phone: form.phone,  
        source: 'try_at_home_page',  
        status: 'new',  
        payload: {  
          address: form.address,  
          pincode: form.pincode,  
          notes: form.notes,  
          items: items.map((i) => ({  
            id: i.id,  
            name: i.name,  
            slug: i.slug,  
            price_cents: i.price_cents,  
            currency: i.currency,  
          })),  
        },  
        user_id: user?.id ?? null,  
      };
  
      const { error: insertError } = await supabase.from('requests').insert(payload);
  
      if (insertError) {  
        console.error('Error saving try-at-home request:', insertError.message);  
        setError('Something went wrong while saving your request. Please try again.');  
        setSubmitting(false);  
        return;  
      }
  
      clear();  
      setForm({  
        name: '',  
        email: '',  
        phone: '',  
        address: '',  
        pincode: '',  
        notes: '',  
      });  
      setSuccess(  
        'Thank you! Our team will review your Try at home request and get in touch soon.'  
      );  
    } catch (err) {  
      console.error(err);  
      setError('Unexpected error. Please try again.');  
    } finally {  
      setSubmitting(false);  
    }  
  };
  
  return (  
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33]">  
      <HomeHeader />
  
      <div className="mx-auto max-w-4xl px-4 py-8">  
        {/* Heading */}  
        <div className="mb-6">  
          <h1 className="text-2xl font-semibold text-[#4b3b33] sm:text-3xl">  
            Try at home  
          </h1>  
          <p className="mt-1 text-sm text-[#7c675b]">  
            Choose up to 3 pieces from our collection and we'll help you try them at home  
            before you decide.  
          </p>  
        </div>
  
        {/* Selected items from Try-at-home store */}  
        <section className="mb-6 rounded-2xl border border-[#ead8cd] bg-white/90 p-4">  
          <div className="mb-3 flex items-center justify-between">  
            <h2 className="text-sm font-semibold text-[#4b3b33]">  
              Your Try at home selection  
            </h2>  
            <p className="text-[11px] text-[#7c675b]">  
              {items.length === 0  
                ? 'No pieces selected yet.'  
                : `${items.length} of 3 pieces selected`}  
            </p>  
          </div>
  
          {items.length === 0 ? (  
            <div className="text-xs text-[#7c675b]">  
              Go to any product page and click{' '}  
              <span className="font-semibold">"Add to Try at home"</span> to build your  
              selection (maximum 3 pieces).  
            </div>  
          ) : (  
            <div className="space-y-3">  
              {items.map((item) => (  
                <div  
                  key={item.id}  
                  className="flex items-center justify-between rounded-xl border border-[#ead8cd] bg-[#fdf7f2] p-3 text-xs sm:text-sm"  
                >  
                  <div className="flex items-center gap-3">  
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-[#f4e3d7] flex-shrink-0">  
                      {item.image_url ? (  
                        // eslint-disable-next-line @next/next/no-img-element  
                        <img  
                          src={item.image_url}  
                          alt={item.name}  
                          className="h-full w-full object-cover"  
                        />  
                      ) : (  
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-[#a07d68]">  
                          No image  
                        </div>  
                      )}  
                    </div>  
                    <div>  
                      <div className="font-medium text-[#4b3b33]">  
                        {item.name}  
                      </div>  
                      <div className="text-[11px] text-[#7c675b]">  
                        {item.currency === 'INR'  
                          ? `₹${(item.price_cents / 100).toFixed(2)}`  
                          : `${(item.price_cents / 100).toFixed(2)} ${item.currency}`}  
                      </div>  
                    </div>  
                  </div>  
                  <button  
                    type="button"  
                    onClick={() => removeItem(item.id)}  
                    className="rounded-full border border-[#f5c2c2] bg-[#fee2e2] px-3 py-1 text-[11px] text-[#a85454] hover:bg-[#fecaca]"  
                  >  
                    Remove  
                  </button>  
                </div>  
              ))}  
            </div>  
          )}
  
          {items.length > 3 && (  
            <p className="mt-2 text-[11px] text-[#a85454]">  
              You have selected more than 3 pieces. Please remove some items to continue.  
            </p>  
          )}  
        </section>
  
        {/* Info + form */}  
        <section className="rounded-2xl border border-[#ead8cd] bg-white/90 p-4 sm:p-6">  
          <p className="mb-4 text-xs text-[#7c675b]">  
            Once you share your details, our team will confirm availability and logistics  
            for your Try at home selection. If you&apos;d like to discuss more than 3  
            pieces, please contact Missy &amp; Mopet directly and we&apos;ll help you  
            curate a bigger edit.  
          </p>
  
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">  
            {error && (  
              <p className="text-xs text-[#a85454]">Error: {error}</p>  
            )}  
            {success && (  
              <p className="text-xs text-emerald-600">{success}</p>  
            )}
  
            <div className="grid gap-3 sm:grid-cols-2">  
              <div>  
                <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                  Your name  
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
                  Email  
                </label>  
                <input  
                  type="email"  
                  value={form.email}  
                  onChange={onChange('email')}  
                  className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
                />  
              </div>  
            </div>
  
            <div className="grid gap-3 sm:grid-cols-2">  
              <div>  
                <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                  Phone  
                </label>  
                <input  
                  type="tel"  
                  value={form.phone}  
                  onChange={onChange('phone')}  
                  className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
                />  
              </div>  
              <div>  
                <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                  Pincode  
                </label>  
                <input  
                  type="text"  
                  value={form.pincode}  
                  onChange={onChange('pincode')}  
                  className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
                />  
              </div>  
            </div>
  
            <div>  
              <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                Address  
              </label>  
              <textarea  
                rows={3}  
                value={form.address}  
                onChange={onChange('address')}  
                className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
              />  
            </div>
  
            <div>  
              <label className="mb-1 block text-xs font-medium text-[#7c675b]">  
                Anything else you&apos;d like us to know?  
              </label>  
              <textarea  
                rows={3}  
                value={form.notes}  
                onChange={onChange('notes')}  
                placeholder="Preferred dates/times, size notes, etc."  
                className="w-full rounded-lg border border-[#ead8cd] bg-white px-3 py-2 text-sm text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
              />  
            </div>
  
            <div className="pt-2">  
              <button  
                type="submit"  
                disabled={submitting}  
                className="w-full rounded-full bg-[#4b3b33] px-5 py-2.5 text-sm font-medium text-[#fdf7f2] hover:bg-[#3a2e29] disabled:opacity-60"  
              >  
                {submitting  
                  ? 'Sending your Try at home request...'  
                  : 'Submit Try at home request'}  
              </button>  
            </div>  
          </form>  
        </section>  
      </div>  
    </main>  
  );  
}  