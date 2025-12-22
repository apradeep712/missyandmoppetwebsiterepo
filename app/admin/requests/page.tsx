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
  newborn_kit: 'Newborn kit',  
  customize: 'Customize outfit',  
  subscription_interest: 'Subscription interest',  
  try_at_home: 'Try at home',  
};
  
export default function AdminRequestsPage() {  
  const supabase = useSupabaseBrowserClient();  
  const [requests, setRequests] = useState<RequestRow[]>([]);  
  const [loading, setLoading] = useState(true);  
  const [filterType, setFilterType] = useState<string>('all');  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const loadRequests = async () => {  
    setLoading(true);  
    let query = supabase  
      .from('requests')  
      .select(  
        'id, type, name, email, phone, payload, status, source, created_at'  
      )  
      .order('created_at', { ascending: false });
  
    const { data, error } = await query;
  
    if (!error && data) {  
      setRequests(data as RequestRow[]);  
    } else if (error) {  
      console.error(error);  
    }  
    setLoading(false);  
  };
  
  useEffect(() => {  
    loadRequests();  
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, []);
  
  const handleStatusChange = async (id: string, newStatus: string) => {  
    const { error } = await supabase  
      .from('requests')  
      .update({ status: newStatus })  
      .eq('id', id);
  
    if (error) {  
      console.error(error);  
      alert('Failed to update status');  
      return;  
    }
  
    setRequests((prev) =>  
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))  
    );  
  };
  
  const filtered = requests.filter((r) => {  
    if (filterType !== 'all' && r.type !== filterType) return false;  
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;  
    return true;  
  });
  
  return (  
    <div>  
      <h1 className="text-xl font-semibold mb-4">Admin – Requests</h1>
  
      <section className="mb-4 flex flex-wrap gap-3 text-xs sm:text-sm">  
        <div className="flex items-center gap-2">  
          <span className="text-[#a07d68]">Type</span>  
          <select  
            value={filterType}  
            onChange={(e) => setFilterType(e.target.value)}  
            className="rounded-full border border-[#ead8cd] bg-[#fdf7f2] px-3 py-1.5 text-xs text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
          >  
            <option value="all">All</option>  
            <option value="newborn_kit">Newborn kit</option>  
            <option value="customize">Customize</option>  
            <option value="subscription_interest">Subscription</option>  
            <option value="try_at_home">Try at home</option>  
          </select>  
        </div>  
        <div className="flex items-center gap-2">  
          <span className="text-[#a07d68]">Status</span>  
          <select  
            value={filterStatus}  
            onChange={(e) => setFilterStatus(e.target.value)}  
            className="rounded-full border border-[#ead8cd] bg-[#fdf7f2] px-3 py-1.5 text-xs text-[#4b3b33] outline-none focus:border-[#d9b9a0]"  
          >  
            <option value="all">All</option>  
            <option value="new">New</option>  
            <option value="contacted">Contacted</option>  
            <option value="closed">Closed</option>  
          </select>  
        </div>  
      </section>
  
      {loading ? (  
        <p className="text-sm text-[#7c675b]">Loading requests...</p>  
      ) : filtered.length === 0 ? (  
        <p className="text-sm text-[#7c675b]">  
          No requests match this filter yet.  
        </p>  
      ) : (  
        <div className="space-y-3 text-xs sm:text-sm">  
          {filtered.map((r) => (  
            <div  
              key={r.id}  
              className="rounded-2xl border border-[#ead8cd] bg-[#fdf7f2] p-3"  
            >  
              <div className="flex flex-wrap items-center justify-between gap-2">  
                <div>  
                  <div className="font-semibold text-[#4b3b33]">  
                    {TYPE_LABELS[r.type] || r.type}  
                  </div>  
                  <div className="text-[11px] text-[#7c675b]">  
                    {r.name || '(No name)'} • {r.email}  
                    {r.phone ? ` • ${r.phone}` : ''}  
                  </div>  
                </div>  
                <div className="flex items-center gap-2 text-[11px] text-[#7c675b]">  
                  <span>{new Date(r.created_at).toLocaleString()}</span>  
                </div>  
              </div>  
              {/* Payload preview */}  
              {r.payload && (  
                <div className="mt-2 rounded-xl bg-white/80 px-3 py-2 text-[11px] text-[#7c675b]">  
                  <pre className="whitespace-pre-wrap break-all">  
                    {JSON.stringify(r.payload, null, 2)}  
                  </pre>  
                </div>  
              )}  
              {/* Status actions */}  
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">  
                <div className="flex gap-1 text-[11px]">  
                  <button  
                    type="button"  
                    onClick={() => handleStatusChange(r.id, 'new')}  
                    className={`rounded-full px-3 py-1 border ${  
                      r.status === 'new'  
                        ? 'bg-[#4b3b33] text-[#fdf7f2] border-[#4b3b33]'  
                        : 'bg-white text-[#4b3b33] border-[#ead8cd]'  
                    }`}  
                  >  
                    New  
                  </button>  
                  <button  
                    type="button"  
                    onClick={() =>  
                      handleStatusChange(r.id, 'contacted')  
                    }  
                    className={`rounded-full px-3 py-1 border ${  
                      r.status === 'contacted'  
                        ? 'bg-[#4b3b33] text-[#fdf7f2] border-[#4b3b33]'  
                        : 'bg-white text-[#4b3b33] border-[#ead8cd]'  
                    }`}  
                  >  
                    Contacted  
                  </button>  
                  <button  
                    type="button"  
                    onClick={() => handleStatusChange(r.id, 'closed')}  
                    className={`rounded-full px-3 py-1 border ${  
                      r.status === 'closed'  
                        ? 'bg-[#4b3b33] text-[#fdf7f2] border-[#4b3b33]'  
                        : 'bg-white text-[#4b3b33] border-[#ead8cd]'  
                    }`}  
                  >  
                    Closed  
                  </button>  
                </div>  
                <div className="text-[11px] text-[#a07d68]">  
                  Source: {r.source || 'web'}  
                </div>  
              </div>  
            </div>  
          ))}  
        </div>  
      )}  
    </div>  
  );  
}  