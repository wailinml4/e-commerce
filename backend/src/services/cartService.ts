import { and, eq } from 'drizzle-orm'
import { CustomError, CartItemResponse } from '../types/index.js'
import { db } from '../db/client.js'
import { cartItems, carts, products } from '../db/schema.js'
import { toNumber } from '../db/mappers.js'

export const getCartProductsService = async (userId: string): Promise<CartItemResponse[]> => {
  const cart = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1)
  if (!cart[0]) {
    return []
  }
  const joined = await db
    .select()
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cart[0].id))
  return joined.map(({ cart_items, products: product }) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: toNumber(product.price),
    category: product.category,
    ...(product.brand ? { brand: product.brand } : {}),
    images: product.images,
    ratings: toNumber(product.ratings),
    numReviews: product.numReviews,
    isFeatured: product.isFeatured,
    quantity: cart_items.quantity,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }))
}

export const addToCartService = async (userId: string, productId: string): Promise<CartItemResponse[]> => {
  const foundProduct = await db.select().from(products).where(eq(products.id, productId)).limit(1)
  const product = foundProduct[0]
  if (!product) {
    const error = new Error('Product not found') as CustomError
    error.statusCode = 404
    throw error
  }

  let cart = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1)

  if (!cart[0]) {
    const insertedCart = await db.insert(carts).values({ userId, totalAmount: '0' }).returning()
    cart = insertedCart
    const cartId = cart[0]!.id
    await db.insert(cartItems).values({
      cartId,
      productId,
      quantity: 1,
      price: product.price,
    })
  } else {
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.cartId, cart[0].id), eq(cartItems.productId, productId)))
      .limit(1)
    if (existingItem[0]) {
      await db
        .update(cartItems)
        .set({ quantity: existingItem[0].quantity + 1, updatedAt: new Date() })
        .where(eq(cartItems.id, existingItem[0].id))
    } else {
      await db.insert(cartItems).values({
        cartId: cart[0].id,
        productId,
        quantity: 1,
        price: product.price,
      })
    }
  }
  return getCartProductsService(userId)
}

export const clearCartService = async (userId: string): Promise<CartItemResponse[]> => {
  const cart = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1)

  if (!cart[0]) {
    return []
  }
  await db.delete(cartItems).where(eq(cartItems.cartId, cart[0].id))

  return []
}

export const removeFromCartService = async (userId: string, productId: string): Promise<CartItemResponse[]> => {
  const cart = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1)

  if (!cart[0]) {
    return []
  }
  await db.delete(cartItems).where(and(eq(cartItems.cartId, cart[0].id), eq(cartItems.productId, productId)))
  return getCartProductsService(userId)
}

export const updateQuantityService = async (userId: string, productId: string, quantity: number): Promise<CartItemResponse[]> => {
  const cart = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1)

  if (!cart[0]) {
    const error = new Error('Cart not found') as CustomError
    error.statusCode = 404
    throw error
  }

  const existingItem = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cart[0].id), eq(cartItems.productId, productId)))
    .limit(1)

  if (!existingItem[0]) {
    const error = new Error('Product not found in cart') as CustomError
    error.statusCode = 404
    throw error
  }

  if (quantity === 0) {
    await db.delete(cartItems).where(eq(cartItems.id, existingItem[0].id))
  } else {
    await db.update(cartItems).set({ quantity, updatedAt: new Date() }).where(eq(cartItems.id, existingItem[0].id))
  }
  return getCartProductsService(userId)
}
