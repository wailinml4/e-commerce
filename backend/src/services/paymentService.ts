import { and, eq, inArray } from 'drizzle-orm'
import stripe from '../config/stripe.js'
import { clearCartService } from './cartService.js'
import { CustomError, CheckoutSessionResponse, CheckoutSuccessResponse } from '../types/index.js'
import { db } from '../db/client.js'
import { coupons, orderItems, orders, payments, products } from '../db/schema.js'
import env from '../config/env.js'

export const createCheckoutSessionService = async (
  checkoutProducts: { id: string; name: string; image: string; price: number; quantity: number }[],
  couponCode: string,
  userId: string,
): Promise<CheckoutSessionResponse> => {
  if (!Array.isArray(checkoutProducts) || checkoutProducts.length === 0) {
    const error = new Error('Invalid or empty products array') as CustomError
    error.statusCode = 400
    throw error
  }

  let totalAmount = 0

  const lineItems = checkoutProducts.map(product => {
    const amount = Math.round(product.price * 100)
    totalAmount += amount * product.quantity

    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: amount,
      },
      quantity: product.quantity || 1,
    }
  })

  let coupon: typeof coupons.$inferSelect | null = null
  if (couponCode) {
    const foundCoupon = await db
      .select()
      .from(coupons)
      .where(and(eq(coupons.code, couponCode), eq(coupons.userId, userId), eq(coupons.isActive, true)))
      .limit(1)
    coupon = foundCoupon[0] || null
    if (coupon) {
      totalAmount -= Math.round((totalAmount * (coupon.discountPercentage ?? 0)) / 100)
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${env.FRONTEND_URL}/purchasesuccess?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.FRONTEND_URL}/purchase-cancel`,
    discounts: coupon
      ? [
          {
            coupon: await createStripeCoupon(coupon.discountPercentage ?? 0),
          },
        ]
      : [],
    metadata: {
      userId: userId.toString(),
      couponCode: couponCode || '',
      products: JSON.stringify(
        checkoutProducts.map(p => ({
          id: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
      ),
    },
  })

  if (totalAmount >= 20000) {
    await createNewCoupon(userId)
  }

  return { id: session.id, url: session.url!, totalAmount: totalAmount / 100 }
}

export const checkoutSuccessService = async (sessionId: string): Promise<CheckoutSuccessResponse> => {
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== 'paid') {
    const error = new Error('Payment not successful') as CustomError
    error.statusCode = 400
    throw error
  }

  const existingOrder = await db.select().from(orders).where(eq(orders.stripeSessionId, sessionId)).limit(1)
  if (existingOrder[0]) {
    return {
      success: true,
      message: 'Order already exists',
      orderId: existingOrder[0].id,
    }
  }

  const metadataUserId = session.metadata?.userId
  if (!metadataUserId) {
    const error = new Error('Session metadata missing userId') as CustomError
    error.statusCode = 400
    throw error
  }
  if (session.metadata?.couponCode) {
    await db
      .update(coupons)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(coupons.code, session.metadata.couponCode), eq(coupons.userId, metadataUserId)))
  }

  const orderProducts = JSON.parse(session.metadata?.products || '[]')
  const productIds = orderProducts.map((product: { id: string }) => product.id)
  const productDocs = await db
    .select({ id: products.id, name: products.name, images: products.images })
    .from(products)
    .where(inArray(products.id, productIds))
  const productsById = new Map(productDocs.map(product => [product.id, product]))

  const createdOrder = await db
    .insert(orders)
    .values({
      userId: metadataUserId,
      totalAmount: ((session.amount_total || 0) / 100).toString(),
      stripeSessionId: sessionId,
    })
    .returning()
  const newOrder = createdOrder[0]!
  await db.insert(orderItems).values(
    orderProducts.map((product: { id: string; quantity: number; price: number }) => {
      const productDoc = productsById.get(product.id)

      if (!productDoc) {
        const error = new Error(`Product not found for order item: ${product.id}`) as CustomError
        error.statusCode = 404
        throw error
      }

      const productImage = productDoc.images?.[0]
      if (!productImage) {
        const error = new Error(`Product image missing for order item: ${product.id}`) as CustomError
        error.statusCode = 400
        throw error
      }

      return {
        orderId: newOrder.id,
        productId: product.id,
        name: productDoc.name,
        quantity: product.quantity,
        price: product.price.toString(),
        image: productImage,
      }
    }),
  )

  await db.insert(payments).values({
    orderId: newOrder.id,
    userId: metadataUserId,
    amount: ((session.amount_total || 0) / 100).toString(),
    currency: session.currency || 'usd',
    status: 'completed',
    method: 'stripe',
    paymentProvider: 'stripe',
    stripePaymentIntentId: session.payment_intent as string,
  })

  await clearCartService(metadataUserId)

  return {
    success: true,
    message: 'Payment successful, order created, and coupon deactivated if used.',
    orderId: newOrder.id,
  }
}

async function createStripeCoupon(discountPercentage: number): Promise<string> {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: 'once',
  })

  return coupon.id
}

async function createNewCoupon(userId: string): Promise<typeof coupons.$inferSelect> {
  await db.delete(coupons).where(eq(coupons.userId, userId))

  const newCoupon = {
    code: 'GIFT' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  }
  const inserted = await db.insert(coupons).values(newCoupon).returning()
  return inserted[0]!
}
