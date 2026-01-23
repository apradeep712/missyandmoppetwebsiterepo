'use client';
  
import { useState } from 'react';
  
export default function NewsletterSection() {  
  const [email, setEmail] = useState('');  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>(  
    'idle'  
  );
  
  const handleSubmit = (e: React.FormEvent) => {  
    e.preventDefault();  
    // later: call API to save to `leads` table  
    setStatus('submitting');  
    setTimeout(() => {  
      setStatus('done');  
    }, 700);  
  };
  
  return (  
    <section className="bg-slate-950 px-4 py-10 text-slate-50">  
      <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-sky-500 p-[1px]">  
        <div className="flex flex-col gap-4 rounded-[1.35rem] bg-slate-950/95 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8">  
          <div>  
            <h3 className="text-lg font-semibold">  
              Join the pastel playdate.  
            </h3>  
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">  
              Get early access to new drops and a welcome surprise on your  
              first order.  
            </p>  
          </div>
  
          <form  
            onSubmit={handleSubmit}  
            className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"  
          >  
            <input  
              type="email"  
              required  
              placeholder="you@example.com"  
              value={email}  
              onChange={(e) => setEmail(e.target.value)}  
              className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-white sm:w-64 sm:text-sm"  
            />  
            <button  
              type="submit"  
              disabled={status !== 'idle'}  
              className="w-full rounded-full bg-white px-5 py-2 text-xs font-medium text-slate-900 hover:bg-slate-100 disabled:opacity-60 sm:w-auto sm:text-sm"  
            >  
              {status === 'idle'  
                ? 'Get 10% off'  
                : status === 'submitting'  
                ? 'Sending...'  
                : 'Check your inbox 🎉'}  
            </button>  
          </form>  
        </div>  
      </div>  
    </section>  
  );  
}  