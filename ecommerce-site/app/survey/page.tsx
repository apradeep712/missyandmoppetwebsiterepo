'use client';

import { useMemo, useState } from 'react';

/* ---------- helpers ---------- */
function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ');
}
function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/* ---------- survey definition ---------- */
type Question = { key: 'q1' | 'q2' | 'q3' | 'q4' | 'q5'; label: string; options: string[] };

const QUESTIONS: Question[] = [
  {
    key: 'q1',
    label: 'Who are you shopping for?',
    options: ['First baby', 'Growing toddler', 'Big kid', 'A little gift 🎁'],
  },
  {
    key: 'q2',
    label: 'What matters most to you?',
    options: ['Softness & comfort', 'Unique designs', 'Organic fabrics', 'Matching sets'],
  },
  {
    key: 'q3',
    label: 'How do you discover kids’ brands?',
    options: ['Instagram', 'Word of mouth', 'Google search', 'Influencers'],
  },
  {
    key: 'q4',
    label: 'How often do you shop for their clothes?',
    options: ['Every month', 'Each season', 'Special occasions', 'All the time'],
  },
  {
    key: 'q5',
    label: 'What would delight you most?',
    options: ['Custom pieces', 'A subscription box', 'Try-at-home', 'Newborn gift kits'],
  },
];

/* ---------- small UI pieces ---------- */
function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <label className="mb-2 block">
      <span className="text-[11px] font-bold uppercase tracking-widest text-[#a07d68]">
        {children}
      </span>
      {hint && <span className="ml-2 text-[10px] text-[#b8927c]">{hint}</span>}
    </label>
  );
}

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'rounded-full border px-4 py-2 text-sm transition-all',
        active
          ? 'border-[#4b3b33] bg-[#4b3b33] text-[#fdf7f2] shadow-sm'
          : 'border-[#ead8cd] bg-white text-[#7c675b] hover:border-[#a07d68]'
      )}
    >
      {children}
    </button>
  );
}

/* ---------- page ---------- */
export default function SurveyPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [comments, setComments] = useState('');

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = email.trim() === '' || isEmail(email.trim());
  const canSubmit = useMemo(
    () => name.trim().length > 0 && phone.trim().length >= 6 && emailValid && !loading,
    [name, phone, emailValid, loading]
  );

  const answeredCount = QUESTIONS.filter((q) => answers[q.key]).length;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          ...answers,
          comments: comments.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to submit.');
      setDone(true);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setName('');
    setPhone('');
    setEmail('');
    setAnswers({});
    setComments('');
    setDone(false);
    setError(null);
  }

  return (
    <main className="min-h-screen bg-[#f9efe7] px-6 py-16 text-[#4b3b33] sm:py-24">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b8927c]">
            Missy &amp; Moppet
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
            Help us dress them better
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#7c675b]">
            A tiny 5-question survey about your little one&apos;s wardrobe. It takes under a
            minute and helps us make things you&apos;ll love.
          </p>
        </header>

        {done ? (
          <div className="rounded-[2rem] border border-[#ead8cd] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fdf7f2] text-3xl">
              💛
            </div>
            <h2 className="font-serif text-2xl font-bold">Thank you!</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#7c675b]">
              Your answers are in. We really appreciate you helping shape Missy &amp; Moppet.
            </p>
            <button
              onClick={reset}
              className="mt-6 rounded-full border border-[#ead8cd] bg-white px-6 py-2 text-xs font-bold uppercase tracking-widest text-[#4b3b33] transition-colors hover:border-[#a07d68]"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-[2rem] border border-[#ead8cd] bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8"
          >
            {/* Contact */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <FieldLabel>Your name</FieldLabel>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anushree"
                  className="w-full rounded-2xl border border-[#ead8cd] bg-[#fdf7f2] px-4 py-3 text-sm outline-none focus:border-[#a07d68]"
                  required
                />
              </div>
              <div className="sm:col-span-1">
                <FieldLabel>Phone</FieldLabel>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="+91 …"
                  className="w-full rounded-2xl border border-[#ead8cd] bg-[#fdf7f2] px-4 py-3 text-sm outline-none focus:border-[#a07d68]"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel hint="optional">Email</FieldLabel>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  placeholder="you@example.com"
                  className={cx(
                    'w-full rounded-2xl border bg-[#fdf7f2] px-4 py-3 text-sm outline-none',
                    emailValid ? 'border-[#ead8cd] focus:border-[#a07d68]' : 'border-red-300'
                  )}
                />
                {!emailValid && (
                  <p className="mt-1 text-[11px] text-red-500">Please enter a valid email or leave it blank.</p>
                )}
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6 border-t border-[#ead8cd] pt-6">
              {QUESTIONS.map((q, i) => (
                <fieldset key={q.key}>
                  <FieldLabel>
                    {i + 1}. {q.label}
                  </FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt) => (
                      <Pill
                        key={opt}
                        active={answers[q.key] === opt}
                        onClick={() =>
                          setAnswers((a) => ({ ...a, [q.key]: a[q.key] === opt ? '' : opt }))
                        }
                      >
                        {opt}
                      </Pill>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            {/* Optional comment */}
            <div className="border-t border-[#ead8cd] pt-6">
              <FieldLabel hint="optional">
                Anything you wish existed for your little one?
              </FieldLabel>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value.slice(0, 2000))}
                rows={3}
                placeholder="Tell us anything…"
                className="w-full rounded-2xl border border-[#ead8cd] bg-[#fdf7f2] px-4 py-3 text-sm outline-none focus:border-[#a07d68]"
              />
              <div className="mt-1 text-right text-[10px] text-[#b8927c]">{comments.length}/2000</div>
            </div>

            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] text-[#b8927c]">{answeredCount}/5 questions answered</span>
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-full bg-[#4b3b33] px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#fdf7f2] shadow-lg transition-all hover:bg-[#3d3029] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Submit survey'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
