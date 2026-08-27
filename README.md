# Missy & Moppet — E-commerce Site

A Next.js 16 storefront for **Missy & Moppet**, a children's clothing brand: product catalog,
age-based sizing, cart, checkout, order management, and a PIN-protected admin dashboard.

> **The application lives in [`ecommerce-site/`](ecommerce-site/).** The repository root only holds
> documentation and editor config — there is no runnable app at the root. Always work from inside
> `ecommerce-site/`.

## Tech stack

| Area | Technology |
|------|------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Framer Motion, GSAP, Lenis (smooth scroll) |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| Cart state | Zustand |
| Payments | Razorpay — **mock mode by default** (no live keys yet) |
| Shipping | Shiprocket — **mock mode by default** (no live keys yet) |
| Email | Resend (sandbox sender for now) |
| Hosting | Vercel |

## Quick start

```bash
cd ecommerce-site
npm install
cp .env.example .env.local   # then fill in real values — see SETUP.md
npm run dev                  # http://localhost:3000
```

Other commands (run from `ecommerce-site/`):

```bash
npm run build    # production build
npm start        # run the production build
npm run lint     # ESLint
```

## Current status (what's live vs. mock)

- **Payments:** Razorpay keys are `placeholder` → orders are placed directly with
  `payment_status = "created"`. Staff confirm payment manually in the admin dashboard
  ("Mark payment received"). The online "Complete Payment Now" button appears automatically only
  once real Razorpay keys are configured.
- **Shipping:** Shiprocket credentials are empty → shipments are mocked. Real shipments book only
  once credentials are added.
- **Email:** Resend uses the sandbox sender `onboarding@resend.dev`, which only reliably delivers
  to the Resend account owner's inbox until a domain is verified. Owner order-alerts go to
  `missyandmoppet@gmail.com`.
- **Admin access is intentionally shared:** the admin dashboard is gated by a single PIN + email
  whitelist, not per-user roles. This is a deliberate choice (many staff share the portal).
- **Supabase RLS is intentionally OFF** for now — see `SECURITY-NOTES.md` before scaling.

## Documentation

| Document | What it's for |
|----------|---------------|
| [SETUP.md](SETUP.md) | Local dev setup, environment variables, testing the buy flow |
| [MIGRATION-GUIDE.md](MIGRATION-GUIDE.md) | **Handover reference** — how to move every service (Supabase, Resend, Vercel, domain, Razorpay, Shiprocket, OTPless) to the client's own accounts, incl. Supabase billing/egress notes |
| [HANDOVER-CHECKLIST.md](HANDOVER-CHECKLIST.md) | **Transfer-day runbook** — the ordered, tickable checklist for the actual handover, including key rotation |
| [SECURITY-NOTES.md](SECURITY-NOTES.md) | Security review findings and recommended follow-ups (nothing fixed silently) |
| [CLAUDE.md](CLAUDE.md) | Architecture notes and conventions for working in this codebase |
| [`ecommerce-site/.env.example`](ecommerce-site/.env.example) | Template of every environment variable (no secrets) |

## Project layout

```
missyandmoppetwebsiterepo/
├── ecommerce-site/          ← the actual Next.js app (run everything from here)
│   ├── app/                 ← App Router pages, layouts, API routes
│   │   ├── admin/           ← PIN-protected admin dashboard
│   │   ├── api/             ← route handlers (checkout, survey, admin actions, webhooks)
│   │   └── components/      ← shared React components
│   ├── lib/                 ← Supabase clients, providers, cart store, helpers
│   ├── public/              ← static assets (images, video)
│   └── .env.example         ← environment variable template
├── README.md                ← you are here
├── SETUP.md
├── MIGRATION-GUIDE.md
├── HANDOVER-CHECKLIST.md
├── SECURITY-NOTES.md
└── CLAUDE.md
```

## Handing this project to the client

This project currently runs on the **original developer's personal accounts** (Supabase, Resend,
Vercel). Before or at handover, everything must move to the client's own accounts and all old keys
must be rotated. Follow **[MIGRATION-GUIDE.md](MIGRATION-GUIDE.md)** for the how-to and
**[HANDOVER-CHECKLIST.md](HANDOVER-CHECKLIST.md)** for the day-of runbook.

## Database schema

The schema is managed **manually in the Supabase dashboard** — there are no migration files in this
repo. The app expects these tables: `products`, `orders`, `order_items`, `shipments`,
`payment_attempts`, `requests`, and `survey`. Column requirements can be read off the API routes in
[`ecommerce-site/app/api/`](ecommerce-site/app/api/). The `CREATE TABLE` for the `survey` table is
in `MIGRATION-GUIDE.md`.
