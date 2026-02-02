import type { ReactNode } from 'react';  
import Link from 'next/link';  
import PinGate from './PinGate'; // Ensure PinGate.tsx is in the same folder

export default function AdminLayout({  
  children,  
}: {  
  children: ReactNode;  
}) {  
  return (  
    <PinGate>
      <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33] pb-20 md:pb-0 font-sans">  
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/95 border-b border-[#ead8cd] md:hidden sticky top-0 z-50 backdrop-blur-md">
          <p className="font-serif font-bold text-[#4b3b33]">Missy & Moppet Admin</p>
        </div>

        <div className="mx-auto flex flex-col md:flex-row min-h-screen max-w-6xl px-4 py-6 gap-6">  
          
          {/* Desktop Sidebar */}  
          <aside className="hidden md:block w-48 flex-shrink-0 sticky top-6 h-fit rounded-[2rem] border border-[#ead8cd] bg-white/95 p-6 shadow-sm">  
            <div className="mb-8">  
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b8927c]">Admin Console</p>  
              <p className="text-sm font-serif font-bold text-[#4b3b33]">Missy & Moppet</p>  
            </div>  
            <nav className="space-y-3">  
              <AdminLinks />
            </nav>  
          </aside>

          {/* Mobile Navigation Bar */}
          <nav className="fixed bottom-6 left-6 right-6 z-50 flex items-center justify-around rounded-full border border-[#ead8cd] bg-white/90 p-2 shadow-xl backdrop-blur-lg md:hidden">
            <AdminLinks mobile />
          </nav>

          {/* Main content Area */}  
          <section className="flex-1 rounded-[2.5rem] border border-[#ead8cd] bg-white/95 p-5 md:p-10 shadow-sm overflow-hidden min-h-[80vh]">  
            {children}  
          </section>  
        </div>  
      </main>  
    </PinGate>
  );  
}

function AdminLinks({ mobile = false }: { mobile?: boolean }) {
  const baseClasses = mobile 
    ? "flex flex-col items-center gap-1 px-4 py-2 text-[10px] font-bold uppercase tracking-tighter text-[#7c675b] transition-all active:scale-90" 
    : "group flex items-center gap-3 rounded-2xl px-4 py-2.5 text-xs font-bold text-[#7c675b] transition-all hover:bg-[#fdf7f2] hover:text-[#4b3b33]";

  return (
    <>
      <Link href="/admin/products" className={baseClasses}>
        {mobile ? <span className="text-xl">📦</span> : <span className="opacity-50 group-hover:opacity-100 transition-opacity">📦</span>}
        <span>Products</span>
      </Link>  
      {/* New Orders Link */}
      <Link href="/admin/orders" className={baseClasses}>
        {mobile ? <span className="text-xl">🛍️</span> : <span className="opacity-50 group-hover:opacity-100 transition-opacity">🛍️</span>}
        <span>Orders</span>
      </Link>
      {/* New Analytics Link */}
      <Link href="/admin/analytics" className={baseClasses}>
        {mobile ? <span className="text-xl">📊</span> : <span className="opacity-50 group-hover:opacity-100 transition-opacity">📊</span>}
        <span>Analytics</span>
      </Link>
      
      <Link href="/admin/home" className={baseClasses}>
        {mobile ? <span className="text-xl">✨</span> : <span className="opacity-50 group-hover:opacity-100 transition-opacity">✨</span>}
        <span>Flyers</span>
      </Link>  
      
      <Link href="/admin/requests" className={baseClasses}>
        {mobile ? <span className="text-xl">💌</span> : <span className="opacity-50 group-hover:opacity-100 transition-opacity">💌</span>}
        <span>Requests</span>
      </Link>  

      {!mobile && (
        <div className="pt-6 mt-6 border-t border-[#fdf7f2]">
          <Link href="/" className="flex items-center gap-2 px-4 text-[10px] font-bold uppercase tracking-widest text-[#b8927c] hover:text-[#4b3b33] transition-colors">
            ← Storefront
          </Link>
        </div>
      )}
    </>
  );
}