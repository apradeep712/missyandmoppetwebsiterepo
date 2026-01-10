import HomeHeader from '@/app/components/HomeHeader';  
import ShopShell from './ShopShell';
  
export default function ShopLayout({ children }: { children: React.ReactNode }) {  
  return (  
    <main className="min-h-screen bg-[#fdf7f2] text-[#4b3b33]">  
      <HomeHeader />  
      <ShopShell>{children}</ShopShell>  
    </main>  
  );  
}  