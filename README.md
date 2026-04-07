# Deal Bazaar

Production-ready e-commerce marketplace built with:

- Next.js App Router + TypeScript
- Tailwind CSS (v4)
- Supabase (Auth, PostgreSQL, Storage)
- Mobile-first responsive UI
- Light and dark theme support

## Features

- Home page with hero slider, categories, featured/trending/flash deals, banners, trust badges, newsletter
- Full product system with details, gallery, specs, related products, featured toggle
- Search, category filter, price filter, sorting, pagination
- Cart drawer + cart page with quantity management and totals
- Checkout with bank transfer/card UI/COD coming soon messaging
- Payment proof upload and admin verification flow
- Auth: register, login, logout
- Account area: dashboard, profile, addresses, orders, order details, wishlist
- Admin panel: dashboard, products CRUD, category management, orders + payment verification, user list
- Policy pages: privacy, terms, shipping, refund
- Route protection for checkout/account/admin

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Configure environment

```bash
cp .env.example .env.local
```

Then fill:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

3. Run database migration in Supabase SQL editor:

- `supabase/migrations/20260407_init.sql`
- Optional starter categories: `supabase/seed.sql`

4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Folder Structure

```txt
src/
  app/
    (main)/                    # storefront + account + policy pages
    admin/                     # protected admin panel
    api/                       # route handlers (checkout, upload, CRUD)
  components/
    admin/                     # admin UI blocks
    account/                   # account UI blocks
    cart/                      # cart drawer/page components
    forms/                     # login/register/checkout/profile/forms
    home/                      # homepage sections
    layout/                    # navbar/footer/providers/policy shell
    product/                   # product cards/gallery/filters/pagination
    ui/                        # reusable primitives
  contexts/                    # cart and wishlist client state
  lib/
    supabase/                  # server/browser/admin clients
    services/                  # product/category/order/admin data access
    validations/               # zod schemas
    auth/api-auth utilities
  types/                       # domain and Supabase database types
supabase/
  migrations/
  seed.sql
middleware.ts                  # route protection + Supabase session refresh
```

## Core API Routes

- `POST /api/checkout` create order + order items + payment
- `POST /api/upload/payment-proof` secure proof upload to Supabase Storage
- `GET /api/orders` list current user orders
- `PATCH /api/orders/:id/status` admin updates order status
- `PATCH /api/orders/:id/payment-status` admin payment approve/reject/review
- `POST /api/products` admin create product
- `PATCH /api/products/:id` admin update product
- `DELETE /api/products/:id` admin delete product
- `POST /api/categories` admin create category
- `DELETE /api/categories/:id` admin delete category
- `POST /api/auth/logout` logout

## Production Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Storage bucket `payment-proofs` is private with RLS policies.
- Payment proof upload is restricted to image types and 5MB max.
- Admin routes are protected both in middleware and API checks.
- Add a payment gateway in `/api/checkout` for real card processing.
