import { z } from 'zod'
import { nonEmptyString } from './common.schema'
export const applyCouponSchema = z
  .object({
    code: nonEmptyString('Coupon code'),
  })
  .strict()

export const checkoutProductSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    image: z.string().optional(),
  })
  .strict()

export const createCheckoutSchema = z
  .object({
    products: z.array(checkoutProductSchema).min(1, 'Cart is empty'),
    couponCode: z.string().optional().nullable(),
  })
  .strict()

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>

export default createCheckoutSchema
