import { desc, eq, ne } from 'drizzle-orm'
import { CustomError, HydratedOrder } from '../types/index.js'
import { db } from '../db/client.js'
import { orderItems, orders, products } from '../db/schema.js'
import { toNumber } from '../db/mappers.js'
import hydrateOrder from '../utils/hydrateOrder.js'

export const getMyOrdersService = async (userId: string): Promise<HydratedOrder[]> => {
  const orderRows = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt))
  const hydratedOrders = await Promise.all(orderRows.map(order => hydrateOrder(order.id)))
  return hydratedOrders.filter((order): order is HydratedOrder => order !== null)
}

export const getOrderByIdService = async (orderId: string, userId: string, userRole: string): Promise<HydratedOrder> => {
  const order = await hydrateOrder(orderId)

  if (!order) {
    const error = new Error('Order not found') as CustomError
    error.statusCode = 404
    throw error
  }

  if (order.userId !== userId && userRole !== 'admin') {
    const error = new Error('Access denied') as CustomError
    error.statusCode = 403
    throw error
  }

  return order
}

export const cancelOrderService = async (orderId: string, userId: string): Promise<HydratedOrder> => {
  const row = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  const order = row[0]

  if (!order) {
    const error = new Error('Order not found') as CustomError
    error.statusCode = 404
    throw error
  }

  if (order.userId !== userId) {
    const error = new Error('Access denied') as CustomError
    error.statusCode = 403
    throw error
  }

  if (order.status !== 'pending') {
    const error = new Error('Only pending orders can be cancelled') as CustomError
    error.statusCode = 400
    throw error
  }

  await db.update(orders).set({ status: 'cancelled', updatedAt: new Date() }).where(eq(orders.id, orderId))

  const updatedOrder = await hydrateOrder(orderId)
  if (!updatedOrder) {
    const error = new Error('Order not found after cancellation') as CustomError
    error.statusCode = 404
    throw error
  }
  return updatedOrder
}

export const requestReturnService = async (
  orderId: string,
  userId: string,
  { returnReason, returnDescription }: { returnReason: string; returnDescription: string },
): Promise<HydratedOrder> => {
  const row = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  const order = row[0]

  if (!order) {
    const error = new Error('Order not found') as CustomError
    error.statusCode = 404
    throw error
  }

  if (order.userId !== userId) {
    const error = new Error('Access denied') as CustomError
    error.statusCode = 403
    throw error
  }

  if (order.status !== 'delivered') {
    const error = new Error('Only delivered orders can be returned') as CustomError
    error.statusCode = 400
    throw error
  }

  if (order.returnStatus !== 'none') {
    const error = new Error('Return already requested or processed') as CustomError
    error.statusCode = 400
    throw error
  }

  await db
    .update(orders)
    .set({
      returnReason,
      returnDescription,
      returnStatus: 'requested',
      returnRequestedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))

  const updatedOrder = await hydrateOrder(orderId)
  if (!updatedOrder) {
    const error = new Error('Order not found after return request') as CustomError
    error.statusCode = 404
    throw error
  }
  return updatedOrder
}

export const getAllOrdersService = async (): Promise<HydratedOrder[]> => {
  const orderRows = await db.select().from(orders).orderBy(desc(orders.createdAt))
  const hydratedOrders = await Promise.all(orderRows.map(order => hydrateOrder(order.id)))
  return hydratedOrders.filter((order): order is HydratedOrder => order !== null)
}

export const getOrderByIdAdminService = async (orderId: string): Promise<HydratedOrder> => {
  const order = await hydrateOrder(orderId)

  if (!order) {
    const error = new Error('Order not found') as CustomError
    error.statusCode = 404
    throw error
  }

  return order
}

export const updateOrderStatusService = async (orderId: string, status: string): Promise<HydratedOrder> => {
  const order = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)

  if (!order[0]) {
    const error = new Error('Order not found') as CustomError
    error.statusCode = 404
    throw error
  }

  await db
    .update(orders)
    .set({
      status: status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))

  const updatedOrder = await hydrateOrder(orderId)
  if (!updatedOrder) {
    const error = new Error('Order not found after update') as CustomError
    error.statusCode = 404
    throw error
  }
  return updatedOrder
}

export const approveReturnService = async (orderId: string): Promise<HydratedOrder> => {
  const row = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  const order = row[0]

  if (!order) {
    const error = new Error('Order not found') as CustomError
    error.statusCode = 404
    throw error
  }

  if (order.returnStatus !== 'requested') {
    const error = new Error('Only requested returns can be approved') as CustomError
    error.statusCode = 400
    throw error
  }

  await db
    .update(orders)
    .set({
      returnStatus: 'approved',
      returnProcessedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))

  const updatedOrder = await hydrateOrder(orderId)
  if (!updatedOrder) {
    const error = new Error('Order not found after return approval') as CustomError
    error.statusCode = 404
    throw error
  }
  return updatedOrder
}

export const rejectReturnService = async (orderId: string): Promise<HydratedOrder> => {
  const row = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  const order = row[0]

  if (!order) {
    const error = new Error('Order not found') as CustomError
    error.statusCode = 404
    throw error
  }

  if (order.returnStatus !== 'requested') {
    const error = new Error('Only requested returns can be rejected') as CustomError
    error.statusCode = 400
    throw error
  }

  await db
    .update(orders)
    .set({
      returnStatus: 'rejected',
      returnProcessedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))

  const updatedOrder = await hydrateOrder(orderId)
  if (!updatedOrder) {
    const error = new Error('Order not found after return rejection') as CustomError
    error.statusCode = 404
    throw error
  }
  return updatedOrder
}

export const getReturnRequestsService = async (): Promise<HydratedOrder[]> => {
  const returnOrders = await db.select().from(orders).where(ne(orders.returnStatus, 'none')).orderBy(desc(orders.returnRequestedAt))
  const hydratedOrders = await Promise.all(returnOrders.map(order => hydrateOrder(order.id)))
  return hydratedOrders.filter((order): order is HydratedOrder => order !== null)
}
