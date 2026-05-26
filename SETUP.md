# Setup Guide - Missy & Moppet E-commerce

## Quick Start

1. **Clone and Install**
   ```bash
   cd ecommerce-site
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your actual credentials (see below).

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Environment Configuration

### Required (Minimum Setup)

#### Supabase (Database & Auth)
1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

#### Admin PIN
```bash
NEXT_PUBLIC_ADMIN_PIN=your-secure-pin
```
Choose a secure PIN for admin dashboard access.

### Optional (Development Mode)

For development, you can use **mock mode** for payments and shipping:

```bash
# Mock Payments (no real transactions)
NEXT_PUBLIC_RAZORPAY_KEY_ID=placeholder
RAZORPAY_KEY_ID=placeholder
RAZORPAY_KEY_SECRET=placeholder

# Mock Shipping (no real shipments)
# Leave SHIPROCKET_EMAIL empty to enable mock mode
SHIPROCKET_EMAIL=
```

### Production Setup

#### Razorpay (Payments)
1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to Settings → API Keys
3. Generate keys and add to `.env.local`:
   ```bash
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=your_secret_here
   ```

#### Shiprocket (Shipping)
1. Sign up at [shiprocket.in](https://shiprocket.in)
2. Add pickup location in Shiprocket dashboard
3. Add credentials to `.env.local`:
   ```bash
   SHIPROCKET_EMAIL=your@email.com
   SHIPROCKET_PASSWORD=your_password
   SHIPROCKET_PICKUP_LOCATION=Primary
   ```

#### Resend (Email Notifications)
1. Sign up at [resend.com](https://resend.com)
2. Get API key from dashboard
3. Add to `.env.local`:
   ```bash
   RESEND_API_KEY=re_xxxxx
   ```

#### Site URL
```bash
# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Testing the Buy Flow

### Development Mode (Mock)
1. Start dev server: `npm run dev`
2. Navigate to a product page
3. Click "Buy Now"
4. Fill in checkout form
5. Click "Complete Purchase"
6. Mock payment will auto-succeed → redirects to success page
7. Check console logs for mock shipment creation

### Production Mode (Real)
1. Ensure all production environment variables are set
2. Test with small amount first
3. Monitor:
   - Razorpay Dashboard for payments
   - Shiprocket Dashboard for shipments
   - Admin email for order notifications

## Admin Access

Admin dashboard is at `/admin` and requires:
1. **Email whitelist**: Add your email to `ADMIN_EMAILS` in `lib/adminCheck.ts`
2. **PIN**: Set via `NEXT_PUBLIC_ADMIN_PIN`
3. **Authentication**: Login via Supabase Auth

## Database Schema

The app expects these Supabase tables:
- `products` - Product catalog
- `orders` - Order records
- `order_items` - Line items per order
- `shipments` - Shipping tracking
- `payment_attempts` - Payment logs (if used)

Refer to existing API routes for column requirements.

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy

### Environment Variables Checklist
- [ ] Supabase credentials (3 variables)
- [ ] Admin PIN
- [ ] Razorpay keys (production) or "placeholder" (development)
- [ ] Shiprocket credentials (production) or empty (development)
- [ ] Resend API key
- [ ] Site URL (production domain)

## Troubleshooting

### Payment not working
- Check Razorpay keys are correct
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` matches `RAZORPAY_KEY_ID`
- For mock mode, ensure key is exactly "placeholder"

### Shipment not created
- Verify `SHIPROCKET_EMAIL` is set (empty = mock mode)
- Check Shiprocket credentials are correct
- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly
- Check server logs for errors

### Admin access denied
- Verify email is in `ADMIN_EMAILS` array in `lib/adminCheck.ts`
- Check PIN matches `NEXT_PUBLIC_ADMIN_PIN`
- Ensure you're logged in via Supabase Auth

## Support

For issues or questions, check:
- Server logs (console)
- Razorpay Dashboard → Payments
- Shiprocket Dashboard → Orders
- Supabase Dashboard → Database
