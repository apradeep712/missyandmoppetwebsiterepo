// Serves /llms.txt — the llmstxt.org standard that helps AI assistants
// understand the site. Mirrors the robots.ts / sitemap.ts approach so the
// URLs stay correct after the domain changes at handover.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://missyandmoppet.com').replace(/\/$/, '');

export const dynamic = 'force-static';

export async function GET() {
  const body = `# Missy & Moppet

> Missy & Moppet is a children's clothing brand offering artistic, minimal, luxury clothing for little ones — from newborns to older kids. We focus on softness, comfort, unique designs, and thoughtful, age-appropriate sizing.

Missy & Moppet is based in India. Alongside the main shop, we offer newborn kits, customizable pieces, a subscription, and a try-at-home service. Orders and shipping are handled within India.

## Shop
- [Shop all products](${siteUrl}/shop): Browse the full children's clothing catalog.
- [Newborn Kit](${siteUrl}/newborn-kit): Curated essentials for newborns.
- [Customize](${siteUrl}/customize): Request custom-made pieces.
- [Subscription](${siteUrl}/subscription): A recurring box of kids' clothing.
- [Try at Home](${siteUrl}/try-at-home): Try pieces at home before buying.

## Company
- [About](${siteUrl}/about): The Missy & Moppet story and founders.
- [Contact](${siteUrl}/contact): How to reach us (email: missyandmoppet@gmail.com).
- [FAQ](${siteUrl}/faq): Answers to common questions.

## Policies
- [Terms & Conditions](${siteUrl}/terms)
- [Privacy Policy](${siteUrl}/privacy)
- [Refund & Cancellation Policy](${siteUrl}/refund-policy)
- [Shipping & Delivery Policy](${siteUrl}/shipping-policy)
- [Returns & Exchange Policy](${siteUrl}/returns)

## Contact
- Email: missyandmoppet@gmail.com
- Instagram: https://instagram.com/missyandmoppet
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
