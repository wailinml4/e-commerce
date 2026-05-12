# Architecture

High-level components:

- Frontend (React / Vite or Next.js): storefront UI, product listing, cart, checkout pages, client-side validations and calls to the backend API.
- Backend (Express): REST API, request validation, business logic for cart/order/checkout, Stripe integration, and webhook handling.
- Database (SQL via Drizzle or chosen DB): stores products, SKUs/variants, users, carts, orders, coupons, and payments.
- Payment provider (Stripe): handles payments and subscriptions; backend verifies webhooks to update order/payment state.
- Media storage (Cloudinary or S3): stores product images and other media; frontend uploads and sends URLs to backend.

Flow examples:

- Add to cart: frontend → `POST /api/cart/items` → backend validates product/stock → cart updated in DB → frontend shows updated cart
- Checkout: frontend → `POST /api/checkout` → backend creates Stripe session and returns URL → user completes payment → Stripe webhook hits `/api/payments/webhook` → backend verifies webhook and creates/finalizes order
