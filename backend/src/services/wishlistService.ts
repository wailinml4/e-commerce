import { and, eq } from 'drizzle-orm'
import { CustomError, HydratedWishlistItem, HydratedWishlist } from '../types/index.js'
import { db } from '../db/client.js'
import { products, wishlistItems, wishlists } from '../db/schema.js'

export const addToWishlistService = async (userId: string, productId: string): Promise<HydratedWishlist | null> => {
  let wishlist = await db.select().from(wishlists).where(eq(wishlists.userId, userId)).limit(1)
  if (!wishlist[0]) {
    wishlist = await db.insert(wishlists).values({ userId }).returning()
  }
  const wishlistId = wishlist[0]!.id
  const existingItem = await db
    .select()
    .from(wishlistItems)
    .where(and(eq(wishlistItems.wishlistId, wishlistId), eq(wishlistItems.productId, productId)))
    .limit(1)
  if (existingItem[0]) {
    const error = new Error('Product already in wishlist') as CustomError
    error.statusCode = 400
    throw error
  }

  const product = await db.select().from(products).where(eq(products.id, productId)).limit(1)
  if (!product[0]) {
    const error = new Error('Product not found') as CustomError
    error.statusCode = 404
    throw error
  }

  await db.insert(wishlistItems).values({ wishlistId, productId, addedAt: new Date() })
  return getWishlistService(userId)
}

export const removeFromWishlistService = async (userId: string, productId: string): Promise<{ message: string }> => {
  const wishlist = await db.select().from(wishlists).where(eq(wishlists.userId, userId)).limit(1)

  if (!wishlist[0]) {
    const error = new Error('Wishlist not found') as CustomError
    error.statusCode = 404
    throw error
  }

  const deleted = await db
    .delete(wishlistItems)
    .where(and(eq(wishlistItems.wishlistId, wishlist[0].id), eq(wishlistItems.productId, productId)))
    .returning()
  if (!deleted.length) {
    const error = new Error('Product not found in wishlist') as CustomError
    error.statusCode = 404
    throw error
  }
  return { message: 'Product removed from wishlist' }
}

export const getWishlistService = async (userId: string): Promise<HydratedWishlist | null> => {
  const wishlist = await db.select().from(wishlists).where(eq(wishlists.userId, userId)).limit(1)
  if (!wishlist[0]) return null
  const items = await db
    .select()
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .where(eq(wishlistItems.wishlistId, wishlist[0].id))
  return {
    id: wishlist[0].id,
    user: userId,
    items: items.map(({ products: product, wishlist_items: item }) => ({
      product: { ...product, id: product.id },
      addedAt: item.addedAt,
    })),
  }
}

export const checkIfInWishlistService = async (userId: string, productId: string): Promise<boolean> => {
  const wishlist = await db.select().from(wishlists).where(eq(wishlists.userId, userId)).limit(1)
  if (!wishlist[0]) return false
  const wishlistItem = await db
    .select()
    .from(wishlistItems)
    .where(and(eq(wishlistItems.wishlistId, wishlist[0].id), eq(wishlistItems.productId, productId)))
    .limit(1)
  return !!wishlistItem[0]
}
