import type { ReactNode } from 'react';  
import Link from 'next/link';  
import { redirect } from 'next/navigation';  
import { isAdminRequest } from '@/lib/adminCheck';  
import { cookies } from 'next/headers';
  
// This is a Server Component layout
  
export default async function AdminLayout({  
  children,  
}: {  
  children: ReactNode;  
}) {  
  const admin = await isAdminRequest();
  
  if (!admin) {  
    // Not logged in as admin → go to normal auth  
    redirect('/auth');  
  }
  
  // Sidebar + content  
  return (  
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33]">  
      <div className="mx-auto flex min-h-screen max-w-6xl px-4 py-6 gap-6">  
        {/* Sidebar */}  
        <aside className="w-48 flex-shrink-0 rounded-3xl border border-[#ead8cd] bg-white/95 p-4 shadow-sm">  
          <div className="mb-4">  
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8927c]">  
              Admin  
            </p>  
            <p className="text-sm font-semibold text-[#4b3b33]">  
              Missy &amp; Mopet  
            </p>  
          </div>  
          <nav className="space-y-2 text-sm">  
            <Link  
              href="/admin/products"  
              className="block rounded-full px-3 py-1.5 hover:bg-[#fdf2e9]"  
            >  
              Products  
            </Link>  
            <Link  
              href="/admin/home"  
              className="block rounded-full px-3 py-1.5 hover:bg-[#fdf2e9]"  
            >  
              Homepage flyers  
            </Link>  
            <Link  
              href="/admin/requests"  
              className="block rounded-full px-3 py-1.5 hover:bg-[#fdf2e9]"  
            >  
              Requests  
            </Link>  
            <Link  
              href="/"  
              className="mt-4 block rounded-full px-3 py-1.5 text-xs text-[#7c675b] hover:bg-[#fdf2e9]"  
            >  
              ← Back to site  
            </Link>  
          </nav>  
        </aside>
  
        {/* Main content */}  
        <section className="flex-1 rounded-3xl border border-[#ead8cd] bg-white/95 p-6 shadow-sm">  
          {children}  
        </section>  
      </div>  
    </main>  
  );  
}  