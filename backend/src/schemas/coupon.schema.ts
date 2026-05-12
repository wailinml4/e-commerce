import { z } from 'zod'

export const validateCouponSchema = z.object({
  code: z.string().trim().min(1, 'Coupon code is required').max(64, 'Coupon code is too long'),
})

export type ValidateCouponInput = z.infer<typeof validateCouponSchema>
