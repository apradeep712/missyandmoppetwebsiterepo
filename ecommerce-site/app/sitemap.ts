import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://missyandmoppet.com';

// Public storefront + informational routes. Admin, auth, account, checkout,
// and API routes are intentionally excluded.
const routes = [
  '',
  '/shop',
  '/about',
  '/newborn-kit',
  '/customize',
  '/subscription',
  '/try-at-home',
  '/survey',
  '/contact',
  '/faq',
  '/terms',
  '/privacy',
  '/refund-policy',
  '/shipping-policy',
  '/returns',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === '' || path === '/shop' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/shop' ? 0.9 : 0.6,
  }));
}
