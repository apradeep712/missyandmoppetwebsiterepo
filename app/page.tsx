import { getSupabaseServerClient } from '@/lib/supabaseServer';  
import LoaderShell from './components/LoaderShell';  
import HomeHeader from './components/HomeHeader';  
import HomeHero from '@/app/components/HomeHero';
  import BrandStorySection from './components/home/BrandStorySection';
import HeroSection from './components/home/HeroSection';  
import CustomizeTeaser from './components/home/CustomizeTeaser';  
import CollectionsSection from './components/home/CollectionsSection';  
import ShopSection from './components/home/ShopSection';  
import NewbornKitTeaser from './components/home/NewbornKitTeaser';  
import CraftSection from './components/home/CraftSection';  
import SocialStrip from './components/home/SocialStrip';  
import AboutSection from './components/home/AboutSection';  
import NewsletterSection from './components/home/NewsletterSection';  
import HomeSubscriptionTrySection from './components/home/HomeSubscriptionTrySection';
  
import ScrollReveal from '@/app/components/ScrollReveal';
  
type Product = {  
  id: string;  
  name: string;  
  slug: string;  
  description: string | null;  
  price_cents: number;  
  currency: string;  
  image_url: string | null;  
};
  
async function getProducts(): Promise<Product[]> {  
  const supabase = await getSupabaseServerClient();
  
  const { data, error } = await supabase  
    .from('products')  
    .select('id, name, slug, description, price_cents, currency, image_url')  
    .eq('is_active', true)  
    .order('created_at', { ascending: false });
  
  if (error) {  
    console.error('Error loading products:', error.message);  
    return [];  
  }
  
  return (data || []) as Product[];  
}
  
export default async function Home() {  
  const products = await getProducts();
  
  return (  
    <LoaderShell>  
      <main className="min-h-screen bg-[#f9efe7] text-[#4b3b33]">  
        {/* Sticky header */}  
        <HomeHeader />
  
        {/* Full-bleed premium hero */}  
        <HomeHero />
  
        {/* Stacked "cards" below hero */}  
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-10 md:pt-14">  
          {/* HeroSection as first card (if you still need it) */}  
         
   <ScrollReveal delay={60}>  
            <section className="rounded-[32px] border border-[#ead8cd]/70 bg-white/70 px-5 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl">  
              <BrandStorySection />  
            </section>  
          </ScrollReveal>
          {/* Customize / made-to-order teaser */}  
          <ScrollReveal delay={60}>  
            <section className="rounded-[32px] border border-[#ead8cd]/70 bg-white/70 px-5 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl">  
              <CustomizeTeaser />  
            </section>  
          </ScrollReveal>
  
          {/* Collections card */}  
         
  
       
  
          {/* Newborn kit card */}  
          <ScrollReveal delay={120}>  
            <section className="rounded-[32px] border border-[#ead8cd]/70 bg-white/80 px-5 py-9 shadow-[0_22px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl">  
              <NewbornKitTeaser />  
            </section>  
          </ScrollReveal>
  
          {/* Subscription / Try-at-home promo */}  
          <ScrollReveal delay={140}>  
            <section className="rounded-[32px] border border-[#ead8cd]/70 bg-white/80 px-5 py-9 shadow-[0_22px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl">  
              <HomeSubscriptionTrySection />  
            </section>  
          </ScrollReveal>
  
          {/* Craft / how it's made */}  
          <ScrollReveal delay={160}>  
            <section className="rounded-[32px] border border-[#ead8cd]/70 bg-white/80 px-5 py-9 shadow-[0_22px_60px_rgba(0,0,0,0.16)] backdrop-blur-xl">  
              <CraftSection />  
            </section>  
          </ScrollReveal>
  
          {/* Social / Instagram strip */}  
          <ScrollReveal delay={180}>  
            <section className="rounded-[32px] border border-[#ead8cd]/70 bg-white/80 px-5 py-9 shadow-[0_18px_50px_rgba(0,0,0,0.14)] backdrop-blur-xl">  
              <SocialStrip />  
            </section>
          </ScrollReveal>
  
          {/* About card */}  
          <ScrollReveal delay={200}>  
            <section className="rounded-[32px] border border-[#ead8cd]/70 bg-white/80 px-5 py-9 shadow-[0_18px_50px_rgba(0,0,0,0.14)] backdrop-blur-xl">  
              <AboutSection />  
            </section>  
          </ScrollReveal>
  
        
        </div>  
      </main>  
    </LoaderShell>  
  );  
}  