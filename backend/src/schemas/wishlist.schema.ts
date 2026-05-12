import { z } from 'zod'

export const addToWishlistSchema = z.object({
  productId: z.string().uuid('Invalid product id'),
})

export const wishlistProductParamsSchema = z.object({
  productId: z.string().uuid('Invalid product id'),
})
export type WishlistProductParams = z.infer<typeof wishlistProductParamsSchema>
export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>
