import type { ReactNode } from 'react';  
import Link from 'next/link';  
import { redirect } from 'next/navigation';  
import { isAdminRequest } from '@/lib/adminCheck';  

export default async function AdminLayout({  
  children,  
}: {  
  children: ReactNode;  
}) {  
  const admin = await isAdminRequest();
  
  if (!admin) {  
    redirect('/auth');  
  }
  
  return (  
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33] pb-20 md:pb-0">  
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/95 border-b border-[#ead8cd] md:hidden sticky top-0 z-50">
        <p className="font-serif font-bold text-[#4b3b33]">Missy & Mopet Admin</p>
      </div>

      <div className="mx-auto flex flex-col md:flex-row min-h-screen max-w-6xl px-4 py-6 gap-6">  
        {/* Desktop Sidebar - Hidden on Mobile */}  
        <aside className="hidden md:block w-48 flex-shrink-0 sticky top-6 h-fit rounded-3xl border border-[#ead8cd] bg-white/95 p-4 shadow-sm">  
          <div className="mb-4">  
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8927c]">Admin</p>  
            <p className="text-sm font-semibold text-[#4b3b33]">Missy & Mopet</p>  
          </div>  
          <nav className="space-y-2 text-sm">  
            <AdminLinks />
          </nav>  
        </aside>

        {/* Mobile Navigation Bar - Bottom Sticky */}
        <nav className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-around rounded-full border border-[#ead8cd] bg-white/90 p-2 shadow-lg backdrop-blur-md md:hidden">
          <AdminLinks mobile />
        </nav>

        {/* Main content Area */}  
        <section className="flex-1 rounded-3xl border border-[#ead8cd] bg-white/95 p-4 md:p-8 shadow-sm overflow-hidden">  
          {children}  
        </section>  
      </div>  
    </main>  
  );  
}

// Sub-component to keep code clean and links consistent
function AdminLinks({ mobile = false }: { mobile?: boolean }) {
  const baseClasses = mobile 
    ? "flex flex-col items-center gap-1 px-3 py-1 text-[10px] font-bold" 
    : "block rounded-full px-3 py-1.5 hover:bg-[#fdf2e9] transition-colors";

  return (
    <>
      <Link href="/admin/products" className={baseClasses}>
        {mobile && <span className="text-lg">📦</span>} Products
      </Link>  
      <Link href="/admin/home" className={baseClasses}>
        {mobile && <span className="text-lg">✨</span>} Flyers
      </Link>  
      <Link href="/admin/requests" className={baseClasses}>
        {mobile && <span className="text-lg">💌</span>} Requests
      </Link>  
      {!mobile && (
        <Link href="/" className="mt-4 block rounded-full px-3 py-1.5 text-xs text-[#7c675b] hover:bg-[#fdf2e9]">
          ← Back to site
        </Link>
      )}
    </>
  );
}