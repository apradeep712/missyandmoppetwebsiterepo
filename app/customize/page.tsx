'use client';
  
import { useMemo, useState } from 'react';  
import Link from 'next/link';
  
type ForWhom = 'girl' | 'boy' | 'neutral' | '';
  
const COLOURS: { key: string; label: string; swatches: [string, string] }[] = [  
  { key: 'blush-pink', label: 'Blush Pink', swatches: ['#F6C6D0', '#FCE8EC'] },  
  { key: 'sky-blue', label: 'Sky Blue', swatches: ['#A7D8F5', '#E7F6FF'] },  
  { key: 'mint-green', label: 'Mint Green', swatches: ['#BFE8D3', '#E9FBF3'] },  
  { key: 'lavender', label: 'Lavender', swatches: ['#CBB7F6', '#F1ECFF'] },  
  { key: 'butter-cream', label: 'Butter Cream', swatches: ['#F7E6A6', '#FFF7D6'] },  
  { key: 'peach', label: 'Peach', swatches: ['#F7BFA8', '#FFE8DE'] },  
];
  
function cx(...classes: Array<string | false | null | undefined>) {  
  return classes.filter(Boolean).join(' ');  
}
  
function isEmail(v: string) {  
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());  
}
  
function FieldLabel({  
  title,  
  hint,  
}: {  
  title: string;  
  hint?: string;  
}) {  
  return (  
    <div className="mb-2">  
      <div className="text-sm font-semibold text-[#4b3b33]">{title}</div>  
      {hint ? <div className="text-[12px] text-[#a07d68]">{hint}</div> : null}  
    </div>  
  );  
}
  
function SoftCard({  
  children,  
  className,  
}: {  
  children: React.ReactNode;  
  className?: string;  
}) {  
  return (  
    <section  
      className={cx(  
        'rounded-[28px] border border-[#ead8cd]/70 bg-white/80 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl',  
        'p-5 sm:p-6',  
        className  
      )}  
    >  
      {children}  
    </section>  
  );  
}
  
function PillToggle({  
  active,  
  children,  
  onClick,  
  disabled,  
}: {  
  active?: boolean;  
  disabled?: boolean;  
  children: React.ReactNode;  
  onClick: () => void;  
}) {  
  return (  
    <button  
      type="button"  
      disabled={disabled}  
      onClick={onClick}  
      className={cx(  
        'group inline-flex items-center justify-center rounded-full border px-4 py-2 text-[12px] font-medium transition-all duration-200',  
        'focus:outline-none focus:ring-2 focus:ring-[#ead8cd] focus:ring-offset-2 focus:ring-offset-[#f9efe7]',  
        disabled && 'cursor-not-allowed opacity-60',  
        active  
          ? 'border-[#b8927c] bg-white text-[#4b3b33] shadow-sm'  
          : 'border-[#ead8cd] bg-white/70 text-[#7c675b] hover:bg-white hover:text-[#4b3b33]'  
      )}  
    >  
      {children}  
    </button>  
  );  
}
  
export default function CustomizePage() {  
  // Keep your existing field names  
  const [name, setName] = useState('');  
  const [email, setEmail] = useState('');  
  const [phone, setPhone] = useState('');  
  const [forWhom, setForWhom] = useState<ForWhom>('');  
  const [colours, setColours] = useState<string[]>([]);  
  const [idea, setIdea] = useState('');
  
  const [loading, setLoading] = useState(false);  
  const [done, setDone] = useState(false);  
  const [error, setError] = useState<string | null>(null);
  
  const maxColours = 3;
  
  const progress = useMemo(() => {  
    let score = 0;  
    if (name.trim().length >= 2) score += 1;  
    if (isEmail(email)) score += 1;  
    if (forWhom) score += 1;  
    if (colours.length > 0) score += 1;  
    if (idea.trim().length >= 10) score += 1;  
    return score; // out of 5  
  }, [name, email, forWhom, colours.length, idea]);
  
  const canSubmit = useMemo(() => {  
    if (loading) return false;  
    if (name.trim().length < 2) return false;  
    if (!isEmail(email)) return false;  
    if (!forWhom) return false;  
    if (colours.length === 0) return false;  
    if (idea.trim().length < 10) return false;  
    return true;  
  }, [loading, name, email, forWhom, colours, idea]);
  
  const toggleColour = (key: string) => {  
    setColours((prev) => {  
      if (prev.includes(key)) return prev.filter((c) => c !== key);  
      if (prev.length >= maxColours) return prev; // hard stop at 3  
      return [...prev, key];  
    });  
  };
  
  const reset = () => {  
    setName('');  
    setEmail('');  
    setPhone('');  
    setForWhom('');  
    setColours([]);  
    setIdea('');  
    setError(null);  
    setDone(false);  
    setLoading(false);  
  };
  
  async function onSubmit(e: React.FormEvent) {  
    e.preventDefault();  
    setError(null);
  
    if (!canSubmit) {  
      setError('Please complete the required fields before submitting.');  
      return;  
    }
  
    setLoading(true);  
    try {  
      // Keep payload compatible with your current backend:  
      // colours as comma string (your earlier code did this).  
      const payload = {  
        name: name.trim(),  
        email: email.trim(),  
        phone: phone.trim(), // you previously sent '' — both are fine  
        forWhom,  
        colours: colours.join(', '),  
        idea: idea.trim(),  
      };
  
      const res = await fetch('/api/requests/customize', {  
        method: 'POST',  
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify(payload),  
      });
  
      if (!res.ok) {  
        const data = await res.json().catch(() => null);  
        throw new Error(data?.error || 'Something went wrong. Please try again.');  
      }
  
      setDone(true);  
    } catch (err: any) {  
      setError(err?.message || 'Failed to submit. Please try again.');  
    } finally {  
      setLoading(false);  
    }  
  }
  
  return (  
    <main className="min-h-screen bg-[#f9efe7] text-[#4b3b33]">  
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">  
        {/* Top header row */}  
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">  
          <div>  
            <div className="text-xs font-semibold tracking-[0.18em] text-[#a07d68] uppercase">  
              Made-to-order  
            </div>  
            <h1 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">  
              Customize your pastel set  
            </h1>  
            <p className="mt-2 max-w-2xl text-sm text-[#7c675b]">  
              Share your idea, pick up to {maxColours} colours, and we'll get back with the next steps.  
              Your request is saved in our system for review.  
            </p>  
          </div>
  
          <div className="flex items-center gap-3">  
            <Link  
              href="/shop"  
              className="rounded-full border border-[#ead8cd] bg-white/70 px-4 py-2 text-[12px] font-medium text-[#7c675b] transition-colors hover:bg-white hover:text-[#4b3b33]"  
            >  
              Browse shop  
            </Link>  
            <Link  
              href="/try-at-home"  
              className="rounded-full border border-[#ead8cd] bg-white/70 px-4 py-2 text-[12px] font-medium text-[#7c675b] transition-colors hover:bg-white hover:text-[#4b3b33]"  
            >  
              Try at home  
            </Link>  
          </div>  
        </div>
  
        {/* Success state */}  
        {done ? (  
          <SoftCard className="p-7 sm:p-10">  
            <div className="flex flex-col gap-4">  
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ead8cd] bg-white/70 px-3 py-1 text-[12px] text-[#7c675b]">  
                <span className="h-2 w-2 rounded-full bg-[#b8927c]" />  
                Request received  
              </div>
  
              <h2 className="text-2xl font-semibold">Thanks, {name.trim() || 'there'}.</h2>  
              <p className="max-w-2xl text-sm text-[#7c675b]">  
                We've saved your customization request. Our team will review it and contact you on{' '}  
                <span className="font-medium text-[#4b3b33]">{email.trim()}</span>  
                {phone.trim() ? (  
                  <>  
                    {' '}  
                    (and possibly{' '}  
                    <span className="font-medium text-[#4b3b33]">{phone.trim()}</span>)  
                  </>  
                ) : null}  
                .  
              </p>
  
              <div className="mt-2 grid gap-3 sm:grid-cols-2">  
                <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                  <div className="text-xs font-semibold tracking-[0.14em] text-[#a07d68] uppercase">  
                    Summary  
                  </div>  
                  <div className="mt-2 text-sm text-[#4b3b33]">  
                    <div>  
                      <span className="text-[#7c675b]">For: </span>  
                      <span className="font-medium">{forWhom}</span>  
                    </div>  
                    <div className="mt-1">  
                      <span className="text-[#7c675b]">Colours: </span>  
                      <span className="font-medium">{colours.join(', ')}</span>  
                    </div>  
                  </div>  
                </div>
  
                <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                  <div className="text-xs font-semibold tracking-[0.14em] text-[#a07d68] uppercase">  
                    Next  
                  </div>  
                  <div className="mt-2 text-sm text-[#7c675b]">  
                    We'll confirm feasibility, timeline, and price before any payment.  
                  </div>  
                </div>  
              </div>
  
              <div className="mt-4 flex flex-wrap gap-2">  
                <button  
                  type="button"  
                  onClick={reset}  
                  className="rounded-full border border-[#ead8cd] bg-white/80 px-4 py-2 text-[12px] font-medium text-[#7c675b] transition-colors hover:bg-white hover:text-[#4b3b33]"  
                >  
                  Submit another request  
                </button>
  
                <Link  
                  href="/shop"  
                  className="rounded-full border border-[#b8927c] bg-[#4b3b33] px-4 py-2 text-[12px] font-medium text-[#fdf7f2] transition-colors hover:bg-[#3f312b]"  
                >  
                  Continue shopping  
                </Link>  
              </div>  
            </div>  
          </SoftCard>  
        ) : (  
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">  
            {/* Form */}  
            <SoftCard>  
              <form onSubmit={onSubmit} className="space-y-6">  
                {/* Progress */}  
                <div className="rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                  <div className="flex items-center justify-between">  
                    <div className="text-sm font-semibold">Customization request</div>  
                    <div className="text-[12px] text-[#a07d68]">  
                      {progress}/5 complete  
                    </div>  
                  </div>  
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#f4e3d7]">  
                    <div  
                      className="h-full rounded-full bg-[#b8927c] transition-all duration-300"  
                      style={{ width: `${(progress / 5) * 100}%` }}  
                    />  
                  </div>  
                </div>
  
                {/* Contact */}  
                <div className="grid gap-4 sm:grid-cols-2">  
                  <div className="sm:col-span-1">  
                    <FieldLabel title="Your name" hint="So we know how to address you." />  
                    <input  
                      value={name}  
                      onChange={(e) => setName(e.target.value)}  
                      placeholder="e.g., Priya"  
                      className={cx(  
                        'w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none transition',  
                        'focus:bg-white focus:ring-2 focus:ring-[#ead8cd]',  
                        name.trim().length > 0 && name.trim().length < 2  
                          ? 'border-red-300'  
                          : 'border-[#ead8cd]'  
                      )}  
                    />  
                    {name.trim().length > 0 && name.trim().length < 2 ? (  
                      <div className="mt-2 text-[12px] text-red-600">  
                        Please enter at least 2 characters.  
                      </div>  
                    ) : null}  
                  </div>
  
                  <div className="sm:col-span-1">  
                    <FieldLabel title="Email" hint="We'll contact you here." />  
                    <input  
                      value={email}  
                      onChange={(e) => setEmail(e.target.value)}  
                      placeholder="e.g., priya@email.com"  
                      inputMode="email"  
                      className={cx(  
                        'w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none transition',  
                        'focus:bg-white focus:ring-2 focus:ring-[#ead8cd]',  
                        email.trim().length > 0 && !isEmail(email)  
                          ? 'border-red-300'  
                          : 'border-[#ead8cd]'  
                      )}  
                    />  
                    {email.trim().length > 0 && !isEmail(email) ? (  
                      <div className="mt-2 text-[12px] text-red-600">  
                        Please enter a valid email.  
                      </div>  
                    ) : null}  
                  </div>
  
                  <div className="sm:col-span-2">  
                    <FieldLabel title="Phone (optional)" hint="Helpful for quick confirmation." />  
                    <input  
                      value={phone}  
                      onChange={(e) => setPhone(e.target.value)}  
                      placeholder="e.g., +91 9XXXX XXXXX"  
                      inputMode="tel"  
                      className="w-full rounded-2xl border border-[#ead8cd] bg-white/80 px-4 py-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-[#ead8cd]"  
                    />  
                  </div>  
                </div>
  
                {/* For whom */}  
                <div>  
                  <FieldLabel title="Who is it for?" hint="Helps us with styling and fit." />  
                  <div className="flex flex-wrap gap-2">  
                    <PillToggle active={forWhom === 'girl'} onClick={() => setForWhom('girl')}>  
                      Girl  
                    </PillToggle>  
                    <PillToggle active={forWhom === 'boy'} onClick={() => setForWhom('boy')}>  
                      Boy  
                    </PillToggle>  
                    <PillToggle active={forWhom === 'neutral'} onClick={() => setForWhom('neutral')}>  
                      Neutral  
                    </PillToggle>  
                  </div>  
                  {!forWhom ? (  
                    <div className="mt-2 text-[12px] text-[#a07d68]">  
                      Pick one to continue.  
                    </div>  
                  ) : null}  
                </div>
  
                {/* Colours */}  
                <div>  
                  <div className="flex items-end justify-between gap-3">  
                    <FieldLabel  
                      title="Choose colours"  
                      hint={`Select up to ${maxColours}.`}  
                    />  
                    <div className="text-[12px] text-[#a07d68]">  
                      {colours.length}/{maxColours}  
                    </div>  
                  </div>
  
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">  
                    {COLOURS.map((c) => {  
                      const active = colours.includes(c.key);  
                      const atLimit = !active && colours.length >= maxColours;
  
                      return (  
                        <button  
                          key={c.key}  
                          type="button"  
                          onClick={() => toggleColour(c.key)}  
                          disabled={atLimit}  
                          className={cx(  
                            'flex items-center justify-between rounded-2xl border p-3 text-left transition-all duration-200',  
                            'focus:outline-none focus:ring-2 focus:ring-[#ead8cd] focus:ring-offset-2 focus:ring-offset-[#f9efe7]',  
                            atLimit && 'cursor-not-allowed opacity-70',  
                            active  
                              ? 'border-[#b8927c] bg-white shadow-sm'  
                              : 'border-[#ead8cd] bg-white/70 hover:bg-white'  
                          )}  
                        >  
                          <div className="flex items-center gap-3">  
                            <div className="flex items-center">  
                              <span  
                                className="h-6 w-6 rounded-full border border-[#ead8cd]"  
                                style={{ background: c.swatches[0] }}  
                              />  
                              <span  
                                className="-ml-2 h-6 w-6 rounded-full border border-[#ead8cd]"  
                                style={{ background: c.swatches[1] }}  
                              />  
                            </div>  
                            <div>  
                              <div className="text-sm font-medium text-[#4b3b33]">{c.label}</div>  
                              <div className="text-[12px] text-[#a07d68]">{c.key}</div>  
                            </div>  
                          </div>
  
                          <div  
                            className={cx(  
                              'inline-flex h-6 w-6 items-center justify-center rounded-full border text-[12px] font-semibold transition',  
                              active  
                                ? 'border-[#b8927c] bg-[#f4e3d7] text-[#4b3b33]'  
                                : 'border-[#ead8cd] bg-white/70 text-[#7c675b]'  
                            )}  
                            aria-hidden="true"  
                          >  
                            {active ? '✓' : '+'}  
                          </div>  
                        </button>  
                      );  
                    })}  
                  </div>
  
                  {colours.length === 0 ? (  
                    <div className="mt-2 text-[12px] text-[#a07d68]">  
                      Choose at least one colour.  
                    </div>  
                  ) : null}  
                </div>
  
                {/* Idea */}  
                <div>  
                  <FieldLabel  
                    title="Describe your idea"  
                    hint="Occasion, references, measurements, anything that helps. (Min 10 chars)"  
                  />  
                  <textarea  
                    value={idea}  
                    onChange={(e) => setIdea(e.target.value)}  
                    placeholder="e.g., A pastel co-ord set for a 1st birthday shoot, prefer soft fabric and minimal embroidery..."  
                    rows={6}  
                    className={cx(  
                      'w-full resize-none rounded-2xl border bg-white/80 px-4 py-3 text-sm outline-none transition',  
                      'focus:bg-white focus:ring-2 focus:ring-[#ead8cd]',  
                      idea.trim().length > 0 && idea.trim().length < 10  
                        ? 'border-red-300'  
                        : 'border-[#ead8cd]'  
                    )}  
                  />  
                  <div className="mt-2 flex items-center justify-between text-[12px] text-[#a07d68]">  
                    <span>  
                      {idea.trim().length > 0 && idea.trim().length < 10  
                        ? 'Add a little more detail.'  
                        : 'Tip: mention age/size, occasion, and fabric preference.'}  
                    </span>  
                    <span>{Math.min(idea.length, 2000)}/2000</span>  
                  </div>  
                </div>
  
                {/* Error */}  
                {error ? (  
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">  
                    {error}  
                  </div>  
                ) : null}
  
                {/* Submit */}  
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">  
                  <div className="text-[12px] text-[#a07d68]">  
                    By submitting, you agree we may contact you about this request.  
                  </div>
  
                  <button  
                    type="submit"  
                    disabled={!canSubmit}  
                    className={cx(  
                      'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all',  
                      !canSubmit  
                        ? 'cursor-not-allowed bg-[#4b3b33]/30 text-[#fdf7f2]'  
                        : 'bg-[#4b3b33] text-[#fdf7f2] hover:bg-[#3f312b] active:scale-[0.99]'  
                    )}  
                  >  
                    {loading ? (  
                      <span className="inline-flex items-center gap-2">  
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />  
                        Submitting…  
                      </span>  
                    ) : (  
                      'Submit request'  
                    )}  
                  </button>  
                </div>  
              </form>  
            </SoftCard>
  
            {/* Side panel */}  
            <div className="space-y-6">  
              <SoftCard>  
                <div className="text-xs font-semibold tracking-[0.14em] text-[#a07d68] uppercase">  
                  What happens next  
                </div>  
                <div className="mt-3 space-y-3 text-sm text-[#7c675b]">  
                  <div className="flex gap-3">  
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#b8927c]" />  
                    <p>  
                      We review your idea and confirm feasibility (fabric, sizing, timeline).  
                    </p>  
                  </div>  
                  <div className="flex gap-3">  
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#b8927c]" />  
                    <p>  
                      We contact you with a quote and delivery estimate.  
                    </p>  
                  </div>  
                  <div className="flex gap-3">  
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#b8927c]" />  
                    <p>  
                      Payment is only requested after confirmation (Phase‑1 workflow).  
                    </p>  
                  </div>  
                </div>  
              </SoftCard>
  
              <SoftCard>  
                <div className="text-xs font-semibold tracking-[0.14em] text-[#a07d68] uppercase">  
                  Your selection  
                </div>
  
                <div className="mt-3 rounded-2xl border border-[#ead8cd]/70 bg-white/60 p-4">  
                  <div className="text-[12px] text-[#a07d68]">For</div>  
                  <div className="mt-1 text-sm font-semibold text-[#4b3b33]">  
                    {forWhom || 'Not selected'}  
                  </div>
  
                  <div className="mt-4 text-[12px] text-[#a07d68]">Colours</div>  
                  <div className="mt-2 flex flex-wrap gap-2">  
                    {colours.length ? (  
                      colours.map((c) => (  
                        <span  
                          key={c}  
                          className="inline-flex items-center gap-2 rounded-full border border-[#ead8cd] bg-white/70 px-3 py-1 text-[12px] text-[#4b3b33]"  
                        >  
                          <span className="h-2 w-2 rounded-full bg-[#b8927c]" />  
                          {c}  
                        </span>  
                      ))  
                    ) : (  
                      <span className="text-sm text-[#7c675b]">No colours yet</span>  
                    )}  
                  </div>  
                </div>
  
                <div className="mt-4 text-[12px] text-[#a07d68]">  
                  Pro tip: If you have reference images, mention where to find them (Instagram post, etc.).  
                </div>  
              </SoftCard>  
            </div>  
          </div>  
        )}  
      </div>  
    </main>  
  );  
}  