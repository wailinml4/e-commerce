import { HydratedOrder } from '../types/index.js'
import { db } from '../db/client.js'
import { orderItems, orders, products, users } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { toNumber } from '../db/mappers.js'

const hydrateOrder = async (orderId: string): Promise<HydratedOrder | null> => {
  const orderRow = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  if (!orderRow[0]) return null
  const items = await db
    .select()
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId))
  
  // Fetch user data
  const userRow = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
  }).from(users).where(eq(users.id, orderRow[0].userId)).limit(1)
  
  return {
    ...orderRow[0],
    id: orderRow[0].id,
    user: userRow[0] || null,
    totalAmount: toNumber(orderRow[0].totalAmount),
    orderItems: items.map(({ order_items, products: product }) => ({
      ...order_items,
      id: order_items.id,
      price: toNumber(order_items.price),
      product: {
        ...product,
        price: toNumber(product.price),
        ratings: toNumber(product.ratings),
        brand: product.brand,
      },
    })),
  }
}

export default hydrateOrder
