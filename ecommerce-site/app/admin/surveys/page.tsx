'use client';

import { useEffect, useState } from 'react';
import { useSupabaseBrowserClient } from '@/app/providers';

type SurveyRow = {
  id: string;
  created_at: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  q1: string | null;
  q2: string | null;
  q3: string | null;
  q4: string | null;
  q5: string | null;
  comments: string | null;
  source: string | null;
  status: string | null;
};

const QUESTION_LABELS: { key: keyof SurveyRow; label: string }[] = [
  { key: 'q1', label: 'Shopping for' },
  { key: 'q2', label: 'Matters most' },
  { key: 'q3', label: 'Discovers via' },
  { key: 'q4', label: 'Shops' },
  { key: 'q5', label: 'Would delight' },
];

export default function AdminSurveysPage() {
  const supabase = useSupabaseBrowserClient();
  const [rows, setRows] = useState<SurveyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('survey')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setRows(data as SurveyRow[]);
      setLoading(false);
    }
    load();
  }, [supabase]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#4b3b33]">Survey Responses</h1>
        <p className="text-sm text-[#7c675b]">Answers submitted from the public survey page</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b3b33]" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-20 bg-[#fdf7f2] rounded-3xl border border-dashed border-[#ead8cd]">
          <p className="text-[#7c675b]">No survey responses yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div
              key={r.id}
              className="rounded-3xl border border-[#ead8cd] bg-white p-5 md:p-6 transition-all hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#7c675b]">
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                  <h2 className="text-lg font-bold text-[#4b3b33]">{r.name || 'Anonymous'}</h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#7c675b]">
                    {r.phone && (
                      <a href={`tel:${r.phone}`} className="hover:text-[#4b3b33] transition-colors">
                        {r.phone}
                      </a>
                    )}
                    {r.email && (
                      <a
                        href={`mailto:${r.email}`}
                        className="underline decoration-[#ead8cd] hover:text-[#4b3b33] transition-colors"
                      >
                        {r.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 rounded-2xl bg-[#fdf7f2] p-4 border border-[#ead8cd]/50">
                {QUESTION_LABELS.map(({ key, label }) => (
                  <div key={key} className="space-y-0.5">
                    <p className="text-[9px] font-black uppercase text-[#a07d68] leading-none">{label}</p>
                    <p className="text-xs font-medium text-[#4b3b33]">
                      {(r[key] as string) || '—'}
                    </p>
                  </div>
                ))}
              </div>

              {r.comments && (
                <div className="mt-4 rounded-2xl border border-[#ead8cd]/50 bg-white p-4">
                  <p className="text-[9px] font-black uppercase text-[#a07d68] leading-none mb-1">Comments</p>
                  <p className="text-sm text-[#4b3b33]">{r.comments}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
