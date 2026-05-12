# Project Overview

E-commerce is a full-stack application demonstrating product browsing, cart/checkout flow, subscription and one-time payments, coupons, order management, and user accounts. The backend is implemented with TypeScript + Express and the data layer uses Drizzle/SQL (or an ORM depending on deploy target). The frontend is a separate app (Vite/Next.js) that consumes the REST API and handles storefront UI.

Key features:

- Product catalog with categories, tags, and variants
- Shopping cart with quantity management and persistence
- Checkout flow (Stripe for payments, webhooks for fulfillment)
- Coupons and promotions
- Order creation and status tracking
- User accounts, addresses, and order history
- Admin analytics endpoints for revenue and order trends

## UI / UX Conventions

- All list and page loading states use shared skeleton components located in the frontend `components/loading/` directory.
- Buttons use a standardized `Button` component that supports `loading` and `disabled` states.
- Monetary values are rendered using a util that formats amounts in the configured currency.

## Where to look

- Backend: `e-commerce/backend/src` — routes, controllers, services, and database access
- Frontend: `e-commerce/frontend` (if present) — store pages, product lists, cart, checkout
- Environment: `e-commerce/backend/src/config/env.ts` (server env) and frontend `.env` files

Read the other docs for API, architecture, and data model details.
