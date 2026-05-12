import { and, eq } from 'drizzle-orm'
import { CustomError } from '../types/index.js'
import { db } from '../db/client.js'
import { coupons } from '../db/schema.js'
import { withId } from '../db/mappers.js'

export const getCouponService = async (userId: string): Promise<typeof coupons.$inferSelect | null> => {
  const result = await db
    .select()
    .from(coupons)
    .where(and(eq(coupons.userId, userId), eq(coupons.isActive, true)))
    .limit(1)
  return result[0] ? withId(result[0]) : null
}

export const validateCouponService = async (
  code: string,
  userId: string,
): Promise<{ message: string; code: string; discountPercentage: number }> => {
  const result = await db
    .select()
    .from(coupons)
    .where(and(eq(coupons.code, code), eq(coupons.userId, userId), eq(coupons.isActive, true)))
    .limit(1)
  const coupon = result[0]

  if (!coupon) {
    const error = new Error('Coupon not found') as CustomError
    error.statusCode = 404
    throw error
  }

  if (coupon.expiryDate < new Date()) {
    await db.update(coupons).set({ isActive: false, updatedAt: new Date() }).where(eq(coupons.id, coupon.id))
    const error = new Error('Coupon expired') as CustomError
    error.statusCode = 400
    throw error
  }

  return {
    message: 'Coupon is valid',
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
  }
}
