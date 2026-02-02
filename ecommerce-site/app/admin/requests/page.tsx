'use client';

import { useEffect, useState } from 'react';  
import { useSupabaseBrowserClient } from '@/app/providers';

type RequestRow = {  
  id: string;  
  type: string;  
  name: string | null;  
  email: string;  
  phone: string | null;  
  payload: any;  
  status: string;  
  source: string | null;  
  created_at: string;  
};

const TYPE_LABELS: Record<string, string> = {  
  newborn_kit: 'Newborn Kit Inquiry',  
  customize: 'Custom Outfit Request',  
  subscription_interest: 'Subscription Plan',  
  try_at_home: 'Home Trial Request',  
};

export default function AdminRequestsPage() {  
  const supabase = useSupabaseBrowserClient();  
  const [requests, setRequests] = useState<RequestRow[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [filterType, setFilterType] = useState<string>('all');  
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const loadRequests = async () => {  
    setLoading(true);  
    const { data, error } = await supabase  
      .from('requests')  
      .select('*')  
      .order('created_at', { ascending: false });

    if (!error && data) setRequests(data as RequestRow[]);  
    setLoading(false);  
  };

  useEffect(() => { loadRequests(); }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {  
    const { error } = await supabase.from('requests').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    }
  };

  const filtered = requests.filter((r) => {  
    if (filterType !== 'all' && r.type !== filterType) return false;  
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;  
    return true;  
  });

  return (  
    <div className="max-w-5xl mx-auto">  
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#4b3b33]">Customer Requests</h1>
        <p className="text-sm text-[#7c675b]">Manage inquiries from your website forms</p>
      </div>

      {/* FILTERS BAR */}
      <section className="mb-6 flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl border border-[#ead8cd]">  
        <div className="flex items-center gap-2">  
          <span className="text-[11px] font-bold uppercase text-[#a07d68]">Inquiry Type</span>  
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="rounded-xl border border-[#ead8cd] bg-[#fdf7f2] px-3 py-2 text-xs text-[#4b3b33] outline-none">  
            <option value="all">All Types</option>  
            {Object.entries(TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>  
        </div>  
        <div className="flex items-center gap-2">  
          <span className="text-[11px] font-bold uppercase text-[#a07d68]">Status</span>  
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-xl border border-[#ead8cd] bg-[#fdf7f2] px-3 py-2 text-xs text-[#4b3b33] outline-none">  
            <option value="all">Any Status</option>  
            <option value="new">🆕 New</option>  
            <option value="contacted">📞 Contacted</option>  
            <option value="closed">✅ Closed</option>  
          </select>  
        </div>  
      </section>

      {loading ? (  
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b3b33]"></div>
        </div>
      ) : filtered.length === 0 ? (  
        <div className="text-center py-20 bg-[#fdf7f2] rounded-3xl border border-dashed border-[#ead8cd]">
          <p className="text-[#7c675b]">No requests found in this category.</p> 
        </div>
      ) : (  
        <div className="space-y-4">  
          {filtered.map((r) => (  
            <div key={r.id} className="group relative overflow-hidden rounded-3xl border border-[#ead8cd] bg-white transition-all hover:shadow-md">  
              {/* Status Indicator Strip */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                r.status === 'new' ? 'bg-orange-400' : r.status === 'contacted' ? 'bg-blue-400' : 'bg-green-500'
              }`} />

              <div className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">  
                  <div className="space-y-1">  
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#a07d68]">
                        {TYPE_LABELS[r.type] || r.type}
                      </span>
                      <span className="text-[10px] text-[#7c675b]">• {new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-lg font-bold text-[#4b3b33]">{r.name || 'Anonymous User'}</h2>  
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#7c675b]">  
                      <a href={`mailto:${r.email}`} className="hover:text-[#4b3b33] transition-colors underline decoration-[#ead8cd]">{r.email}</a>  
                      {r.phone && <a href={`tel:${r.phone}`} className="hover:text-[#4b3b33] transition-colors">{r.phone}</a>}  
                    </div>  
                  </div>

                  <div className="flex items-center gap-2 shrink-0">  
                    <button onClick={() => handleStatusChange(r.id, 'new')} className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase transition-colors ${r.status === 'new' ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>New</button>  
                    <button onClick={() => handleStatusChange(r.id, 'contacted')} className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase transition-colors ${r.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>Contacted</button>  
                    <button onClick={() => handleStatusChange(r.id, 'closed')} className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase transition-colors ${r.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>Closed</button>  
                  </div>  
                </div>  

                {/* DETAILS GRID */}
                {r.payload && (  
                  <div className="mt-5 rounded-2xl bg-[#fdf7f2] p-4 border border-[#ead8cd]/50">  
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(r.payload).map(([key, value]) => (
                        <div key={key} className="space-y-0.5">
                          <p className="text-[9px] font-black uppercase text-[#a07d68] leading-none">{key.replace(/_/g, ' ')}</p>
                          <p className="text-xs font-medium text-[#4b3b33] truncate">
                            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>  
                )} 

                <div className="mt-4 flex items-center justify-between">
                   <div className="text-[10px] font-medium text-[#a07d68] italic">
                    Referrer: {r.source || 'Direct Website'}
                  </div>
                  {/* Quick Action Buttons for Mobile */}
                  <div className="flex gap-2">
                    {r.phone && (
                       <a href={`tel:${r.phone}`} className="md:hidden rounded-full bg-[#4b3b33] p-2 text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                       </a>
                    )}
                    <a href={`mailto:${r.email}`} className="md:hidden rounded-full bg-[#4b3b33] p-2 text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </a>
                  </div>
                </div>
              </div>  
            </div>  
          ))}  
        </div>  
      )}  
    </div>  
  );  
}