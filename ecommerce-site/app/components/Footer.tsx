'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SHOP_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Newborn Kit', href: '/newborn-kit' },
  { label: 'Customize', href: '/customize' },
  { label: 'Subscription', href: '/subscription' },
  { label: 'Try at Home', href: '/try-at-home' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Survey', href: '/survey' },
];

const POLICY_LINKS = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Refund & Cancellation', href: '/refund-policy' },
  { label: 'Shipping & Delivery', href: '/shipping-policy' },
  { label: 'Returns & Exchange', href: '/returns' },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a07d68]">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-[#7c675b] transition-colors hover:text-[#4b3b33]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();

  // The storefront footer should not appear on the admin board or auth screens.
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/auth')) {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#ead8cd] bg-[#fdf7f2] text-[#4b3b33]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 space-y-4 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-xl font-bold tracking-tight">
                Missy &amp; Moppet
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[#7c675b]">
              Artistic, minimal luxury clothing for your little ones.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <a
                href="https://instagram.com/missyandmoppet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#7c675b] transition-colors hover:text-[#4b3b33]"
              >
                Instagram · @missyandmoppet
              </a>
              <a
                href="mailto:missyandmoppet@gmail.com"
                className="text-sm text-[#7c675b] transition-colors hover:text-[#4b3b33]"
              >
                missyandmoppet@gmail.com
              </a>
              <a
                href="https://wa.me/919148884999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#7c675b] transition-colors hover:text-[#4b3b33]"
              >
                WhatsApp · +91 91488 84999
              </a>
            </div>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Policies" links={POLICY_LINKS} />
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-[#ead8cd] pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#a07d68]">
            © {year} Missy &amp; Moppet · Made with love in India
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#b8927c]">
            Secure payments via Razorpay
          </p>
        </div>
      </div>
    </footer>
  );
}
