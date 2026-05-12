# API - Full Endpoint Reference

This file lists the HTTP endpoints exposed by the e‑commerce backend, grouped by area. Paths include the `/api` prefix where applicable.

## Authentication (`/api/auth`)

- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET `/api/auth/check-auth`
- POST `/api/auth/logout`
- POST `/api/auth/forgot-password`
- POST `/api/auth/reset-password/:id`

## Products (`/api/products`)

- GET `/api/products/` - list products (query: search, category, filters, pagination)
- GET `/api/products/:productId` - product detail
- POST `/api/products/` - create product (admin)
- PUT `/api/products/:productId` - edit product (admin)
- DELETE `/api/products/:productId` - delete product (admin)
- GET `/api/products/categories` - list categories

## Cart (`/api/cart`)

- GET `/api/cart/` - get current user cart
- POST `/api/cart/items` - add item to cart
- PUT `/api/cart/items/:itemId` - update quantity
- DELETE `/api/cart/items/:itemId` - remove item
- POST `/api/cart/merge` - merge guest cart into user cart on login

## Checkout & Payments (`/api/checkout`, `/api/payments`)

- POST `/api/checkout/` - create checkout session (Stripe)
- POST `/api/payments/webhook` - Stripe webhook handler
- GET `/api/payments/status/:paymentId` - check payment status

## Orders (`/api/orders`)

- POST `/api/orders/` - create order from cart
- GET `/api/orders/` - list current user's orders
- GET `/api/orders/:orderId` - order detail
- PUT `/api/orders/:orderId/cancel` - cancel order (when allowed)
- PUT `/api/orders/:orderId/fulfill` - mark fulfilled (admin)

## Coupons (`/api/coupons`)

- POST `/api/coupons/` - create coupon (admin)
- GET `/api/coupons/:code` - validate coupon code
- GET `/api/coupons/` - list coupons (admin)

## Users (`/api/users`)

- GET `/api/users/me` - current user profile
- PUT `/api/users/me` - update user profile
- GET `/api/users/:userId/orders` - orders by user (admin or owner)

## Analytics (`/api/analytics`)

- GET `/api/analytics/revenue` - revenue summary (admin)
- GET `/api/analytics/orders` - orders summary/time series
- GET `/api/analytics/top-products` - top selling products

---

Notes:

- Routes use request validation middleware and auth middleware where appropriate.
- For request/response shapes, consult `backend/src/controllers`, `backend/src/schemas`, and the database models.
