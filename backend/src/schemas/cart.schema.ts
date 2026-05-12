import { z } from 'zod'

export const addToCartSchema = z.object({
  productId: z.string().uuid('Invalid product id'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
})

export const cartProductParamsSchema = z.object({
  id: z.string().uuid('Invalid product id'),
})

export const updateCartQuantitySchema = z.object({
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
})

export type CartProductParams = z.infer<typeof cartProductParamsSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartQuantityInput = z.infer<typeof updateCartQuantitySchema>
