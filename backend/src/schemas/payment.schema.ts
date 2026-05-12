import { z } from 'zod'

export const checkoutProductSchema = z.object({
  id: z.string().uuid('Invalid product id'),
  name: z.string().trim().min(1, 'Product name is required'),
  image: z.string().trim().min(1, 'Product image is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  quantity: z.coerce.number().int().positive('Quantity must be greater than 0'),
})

export const createCheckoutSessionSchema = z.object({
  products: z.array(checkoutProductSchema).min(1, 'Products are required'),
  couponCode: z.preprocess(value => (value === null ? undefined : value), z.string().trim().max(64, 'Coupon code is too long').optional()),
})

export const checkoutSuccessSchema = z.object({
  sessionId: z.string().trim().min(1, 'Session id is required'),
})

export type CheckoutProductInput = z.infer<typeof checkoutProductSchema>
export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>
export type CheckoutSuccessInput = z.infer<typeof checkoutSuccessSchema>
