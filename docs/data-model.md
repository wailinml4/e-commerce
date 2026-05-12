# Data Model

## User
- `id: number | string`
- `fullName: string`
- `email: string`
- `passwordHash: string`
- `roles: string[]` (e.g., `['user']`, `['admin']`)
- `addresses?: { label: string, addressLine1: string, addressLine2?: string, city: string, region?: string, postalCode: string, country: string }[]`
- `createdAt: Date`
- `updatedAt: Date`

## Product
- `id: number | string`
- `title: string`
- `slug: string`
- `description: string`
- `price: number` (in smallest currency unit e.g., cents)
- `currency: string`
- `stock?: number` (aggregate stock or per-variant)
- `images: string[]`
- `categories?: string[]`
- `tags?: string[]`
- `variants?: { id: string, sku: string, price?: number, stock?: number, attributes?: Record<string,string> }[]`
- `createdAt: Date`
- `updatedAt: Date`

## Cart
- `id: number | string`
- `userId?: number | string` (null for guest carts)
- `items: { productId: string, variantId?: string, quantity: number, priceAtAdd: number }[]`
- `createdAt: Date`
- `updatedAt: Date`

## Order
- `id: number | string`
- `userId: number | string`
- `items: { productId: string, variantId?: string, quantity: number, unitPrice: number }[]`
- `subtotal: number`
- `tax: number`
- `shipping: number`
- `discount: number`
- `total: number`
- `currency: string`
- `status: string` (e.g., `pending`, `paid`, `fulfilled`, `cancelled`)
- `paymentId?: string` (Stripe payment/checkout id)
- `shippingAddress: { ... }`
- `createdAt: Date`
- `updatedAt: Date`

## Coupon
- `id: number | string`
- `code: string`
- `type: 'percent' | 'fixed'`
- `value: number`
- `maxUses?: number`
- `expiresAt?: Date`
- `createdAt: Date`

## Payment
- `id: string`
- `orderId: string`
- `provider: string` (e.g., `stripe`)
- `providerPaymentId: string`
- `amount: number`
- `currency: string`
- `status: string`
- `createdAt: Date`

## Review
- `id: string`
- `productId: string`
- `userId: string`
- `rating: number`
- `title?: string`
- `body?: string`
- `createdAt: Date`

---

These shapes are implementation-agnostic; adapt types to your DB schema or ORM conventions (Drizzle, Prisma, TypeORM, etc.).
