# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 e-commerce site for Missy & Moppet, a children's clothing brand. The application uses the App Router architecture with React 19, TypeScript, and Tailwind CSS 4. The main application code lives in the `ecommerce-site/` directory.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS 4, Framer Motion, GSAP, Lenis (smooth scroll)
- **Database & Auth**: Supabase (PostgreSQL + Auth with OTPless integration)
- **State Management**: Zustand (cart state)
- **Payments**: Razorpay (with mock provider for development)
- **Shipping**: Shiprocket (with mock provider for development)
- **Email**: Resend
- **Icons**: Lucide React

## Development Commands

All commands should be run from the `ecommerce-site/` directory:

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Create production build
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Architecture

### Directory Structure

- `app/` - Next.js App Router pages and layouts
  - `(shop)/` - Shop route group (shares layout)
  - `admin/` - Admin dashboard (PIN + email protected)
  - `api/` - API route handlers
  - `components/` - React components
  - `hooks/` - Custom React hooks
- `lib/` - Shared utilities and providers
  - `providers/` - Payment and shipping provider abstractions
  - `supabaseClient.ts` - Client-side Supabase instance
  - `supabaseServer.ts` - Server-side Supabase client factory
  - `supabaseAdmin.ts` - Admin Supabase client (service role)
  - `cartStore.ts` - Zustand cart state management
  - `types.ts` - Shared TypeScript types

### Key Patterns

**Provider Abstraction**: Payment and shipping providers use a two-tier system:
- Mock providers for development (enabled by default)
- Real providers (Razorpay, Shiprocket) switched via environment variables
- Located in `lib/providers/payments.ts` and `lib/providers/shipping.ts`

**Authentication**: 
- Supabase Auth with OTPless integration (`app/api/auth/otpless/route.ts`)
- Admin access requires both email whitelist (`lib/adminCheck.ts`) AND PIN gate (`app/admin/PinGate.tsx`)
- Admin emails configured in `ADMIN_EMAILS` array in `lib/adminCheck.ts`

**State Management**:
- Server state: React Server Components with Supabase queries
- Client state: Zustand store for cart (`useCartStore` in `lib/cartStore.ts`)

**Age-Based Sizing**: 
- Products have age-specific sizing defined in `lib/ageBuckets.ts`
- Age ranges from 0-3 months through 15-16 years, grouped as baby/toddler/kid
- Size calculations in `lib/ageSizing.ts`

### Database Schema (Supabase)

Key tables (inferred from API routes):
- `products` - Product catalog (id, price_cents, is_active, etc.)
- `orders` - Order records (status, currency, total_amount_cents, customer info, shipping_address, items)
- `payment_attempts` - Payment provider tracking (order_id, provider, provider_order_id, status)
- Storage: Product images uploaded to Supabase Storage via `app/api/admin/upload-product-images/route.ts`

Note: Database schema is managed in Supabase dashboard, not local migrations.

### API Routes

Order flow:
1. `POST /api/orders/create` - Creates order + payment provider order, returns payment details
2. `POST /api/orders/verify-payment` - Verifies payment signature, updates order status
3. `POST /api/shiprocket/create-shipment` - Books shipment after successful payment

Other endpoints:
- `/api/requests/customize` - Custom order requests
- `/api/requests/newborn-kits` - Newborn kit interest
- `/api/try-at-home` - Try-at-home requests
- `/api/subscription-interest` - Subscription interest
- `/api/admin/upload-product-images` - Admin product image uploads

## Environment Variables

Required environment variables (not in repo, configure in `.env.local`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Admin
NEXT_PUBLIC_ADMIN_PIN=

# Payments (optional, defaults to mock)
PAYMENTS_PROVIDER=mock              # or "razorpay"
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Shipping (optional, defaults to mock)
SHIP_PROVIDER=mock                  # or "shiprocket"
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
SHIPROCKET_PICKUP_LOCATION=

# Email
RESEND_API_KEY=
```

## Working with the Codebase

**Path aliases**: Use `@/*` to import from the `ecommerce-site` root:
```typescript
import { supabase } from '@/lib/supabaseClient';
```

**Server vs Client Components**: 
- Default to Server Components for data fetching
- Add `'use client'` only when needed (hooks, interactivity, browser APIs)
- Server-side Supabase: Use `getSupabaseServerClient()` from `lib/supabaseServer.ts`
- Client-side Supabase: Use `supabase` from `lib/supabaseClient.ts`

**Adding Admin Features**:
- Admin routes go in `app/admin/`
- Protected by layout that uses `PinGate.tsx`
- Server-side admin checks use `isAdminRequest()` from `lib/adminCheck.ts`
- Update `ADMIN_EMAILS` array to add admin users

**Currency Handling**: 
- All monetary values stored in minor units (paise/cents) in `price_cents` / `total_amount_cents` columns
- Razorpay expects paise (1 INR = 100 paise)
- Convert to major units for display: `price_cents / 100`

**Smooth Scrolling**: 
- Uses Lenis for smooth scroll behavior
- Initialized in `app/components/providers/smooth-scroll-provider.tsx`
- Available in client components via context

**CSS Modules**: 
- TypeScript definitions generated in `css-module.d.ts`
- Primarily uses Tailwind utility classes
- Global styles in `app/globals.css`
