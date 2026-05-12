import { and, desc, eq, gte, ne, sql } from 'drizzle-orm'
import { db } from '../db/client.js'
import { orderItems, orders, products, users } from '../db/schema.js'
import { toNumber } from '../db/mappers.js'
import {
  DateRanges,
  AnalyticsData,
  DailyOrderData,
  DashboardMetrics,
  TrendData,
  NewItemsData,
  TopSellingProduct,
  TopCustomer,
  HighReturnProduct,
  InsightsData,
} from '../types/index.js'
import getDateRanges from '../utils/getDateRanges.js'
import getDatesInRange from '../utils/getDatesInRange.js'

export const getAnalyticsDataService = async (): Promise<AnalyticsData> => {
  const totalUsers = await db.$count(users)
  const totalProducts = await db.$count(products)
  const allOrders = await db.select({ totalAmount: orders.totalAmount }).from(orders)
  const _totalOrders = allOrders.length
  const totalRevenue = allOrders.reduce((sum, order) => sum + toNumber(order.totalAmount), 0)

  return {
    users: totalUsers,
    products: totalProducts,
    totalOrders: _totalOrders,
    totalRevenue,
  }
}

export const getDailyOrdersDataService = async (startDate: Date, endDate: Date): Promise<DailyOrderData[]> => {
  const rows = await db
    .select({ createdAt: orders.createdAt, totalAmount: orders.totalAmount })
    .from(orders)
    .where(and(gte(orders.createdAt, startDate), sql`${orders.createdAt} <= ${endDate}`))
  const dailyOrdersData = rows.reduce<Record<string, { orders: number; revenue: number }>>((acc, row) => {
    const key = row.createdAt.toISOString().split('T')[0]!
    if (!acc[key]) acc[key] = { orders: 0, revenue: 0 }
    acc[key].orders += 1
    acc[key].revenue += toNumber(row.totalAmount)
    return acc
  }, {})

  const dateArray = getDatesInRange(startDate, endDate)

  return dateArray.map(date => {
    const foundData = dailyOrdersData[date]

    return {
      date,
      orders: foundData?.orders || 0,
      revenue: foundData?.revenue ?? 0,
    }
  })
}

export const getDashboardMetricsService = async (): Promise<DashboardMetrics> => {
  const { todayStart, monthStart, yearStart } = getDateRanges()

  const totalProducts = await db.$count(products)
  const _totalOrders = await db.$count(orders)
  const _totalCustomers = await db.$count(users, eq(users.role, 'customer'))
  const _totalReturns = await db.$count(orders, ne(orders.returnStatus, 'none'))

  const todayRows = await db.select({ totalAmount: orders.totalAmount }).from(orders).where(gte(orders.createdAt, todayStart))
  const todayOrders = todayRows.length
  const todayRevenue = [
    {
      total: todayRows.reduce((sum, row) => sum + toNumber(row.totalAmount), 0),
    },
  ]
  const todayReturns = await db.$count(orders, and(ne(orders.returnStatus, 'none'), gte(orders.returnRequestedAt, todayStart)))
  const todayCustomers = await db.$count(users, and(eq(users.role, 'customer'), gte(users.createdAt, todayStart)))

  const monthRows = await db.select({ totalAmount: orders.totalAmount }).from(orders).where(gte(orders.createdAt, monthStart))
  const monthOrders = monthRows.length
  const monthRevenue = [
    {
      total: monthRows.reduce((sum, row) => sum + toNumber(row.totalAmount), 0),
    },
  ]
  const monthReturns = await db.$count(orders, and(ne(orders.returnStatus, 'none'), gte(orders.returnRequestedAt, monthStart)))
  const monthCustomers = await db.$count(users, and(eq(users.role, 'customer'), gte(users.createdAt, monthStart)))

  const yearRows = await db.select({ totalAmount: orders.totalAmount }).from(orders).where(gte(orders.createdAt, yearStart))
  const yearOrders = yearRows.length
  const yearRevenue = [
    {
      total: yearRows.reduce((sum, row) => sum + toNumber(row.totalAmount), 0),
    },
  ]
  const yearReturns = await db.$count(orders, and(ne(orders.returnStatus, 'none'), gte(orders.returnRequestedAt, yearStart)))
  const yearCustomers = await db.$count(users, and(eq(users.role, 'customer'), gte(users.createdAt, yearStart)))

  return {
    today: {
      revenue: todayRevenue[0]?.total || 0,
      products: totalProducts,
      orders: todayOrders,
      returns: todayReturns,
      customers: todayCustomers,
    },
    thisMonth: {
      revenue: monthRevenue[0]?.total || 0,
      products: totalProducts,
      orders: monthOrders,
      returns: monthReturns,
      customers: monthCustomers,
    },
    thisYear: {
      revenue: yearRevenue[0]?.total || 0,
      products: totalProducts,
      orders: yearOrders,
      returns: yearReturns,
      customers: yearCustomers,
    },
  }
}

export const getDashboardTrendsService = async (period: string = '7days'): Promise<TrendData> => {
  const now = new Date()
  let startDate: Date
  let dateFormat: string

  if (period === '7days') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
    dateFormat = 'daily'
  } else if (period === '30days') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
    dateFormat = 'daily'
  } else if (period === '12months') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)
    dateFormat = 'monthly'
  } else {
    // Default to 7 days
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
    dateFormat = 'daily'
  }

  const formatDate = (date: Date) => {
    if (dateFormat === 'daily') {
      // Return day name for 7days, day number for 30days
      if (period === '7days') {
        return date.toLocaleDateString('en-US', { weekday: 'short' })
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    } else {
      // Monthly format for 12months
      return date.toLocaleDateString('en-US', { month: 'short' })
    }
  }

  // Generate complete date range
  const generateDateRange = () => {
    const dates = []
    const current = new Date(startDate)
    
    if (dateFormat === 'daily') {
      while (current <= now) {
        dates.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
    } else {
      // Monthly
      while (current <= now) {
        dates.push(new Date(current.getFullYear(), current.getMonth(), 1))
        current.setMonth(current.getMonth() + 1)
      }
    }
    return dates
  }

  const dateRange = generateDateRange()
  const orderRows = await db.select().from(orders).where(gte(orders.createdAt, startDate))
  const customerRows = await db
    .select()
    .from(users)
    .where(and(eq(users.role, 'customer'), gte(users.createdAt, startDate)))
  
  const revenueMap: Record<string, number> = {}
  const ordersMap: Record<string, number> = {}
  const returnsMap: Record<string, number> = {}
  
  for (const row of orderRows) {
    const key = formatDate(row.createdAt)
    revenueMap[key] = (revenueMap[key] || 0) + toNumber(row.totalAmount)
    ordersMap[key] = (ordersMap[key] || 0) + 1
    if (row.returnStatus !== 'none' && row.returnRequestedAt) {
      const returnKey = formatDate(row.returnRequestedAt)
      returnsMap[returnKey] = (returnsMap[returnKey] || 0) + 1
    }
  }
  
  const customersMap: Record<string, number> = {}
  for (const row of customerRows) {
    const key = formatDate(row.createdAt)
    customersMap[key] = (customersMap[key] || 0) + 1
  }

  // Create complete trend data with zero values for missing dates
  const revenueTrend = dateRange.map(date => ({
    id: formatDate(date),
    revenue: revenueMap[formatDate(date)] || 0
  }))
  
  const ordersTrend = dateRange.map(date => ({
    id: formatDate(date),
    orders: ordersMap[formatDate(date)] || 0
  }))
  
  const returnsTrend = dateRange.map(date => ({
    id: formatDate(date),
    returns: returnsMap[formatDate(date)] || 0
  }))
  
  const customersTrend = dateRange.map(date => ({
    id: formatDate(date),
    customers: customersMap[formatDate(date)] || 0
  }))

  return {
    revenue: revenueTrend,
    orders: ordersTrend,
    returns: returnsTrend,
    customers: customersTrend,
  }
}

export const getDashboardNewItemsService = async (): Promise<NewItemsData> => {
  const newProducts = await db.select().from(products).orderBy(desc(products.createdAt)).limit(5)

  const newOrders = await db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(5)

  const newReturns = await db
    .select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      returnReason: orders.returnReason,
      returnStatus: orders.returnStatus,
      returnRequestedAt: orders.returnRequestedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .where(ne(orders.returnStatus, 'none'))
    .orderBy(desc(orders.returnRequestedAt))
    .limit(5)

  const newCustomers = await db.select().from(users).where(eq(users.role, 'customer')).orderBy(desc(users.createdAt)).limit(5)

  return {
    products: newProducts,
    orders: newOrders,
    returns: newReturns,
    customers: newCustomers,
  }
}

export const getDashboardInsightsService = async (): Promise<InsightsData> => {
  const allOrderItems = await db.select().from(orderItems)
  const allProducts = await db.select().from(products)
  const productById = new Map(allProducts.map(p => [p.id, p]))
  const soldByProduct = new Map<string, { totalSold: number; totalRevenue: number }>()
  for (const item of allOrderItems) {
    const current = soldByProduct.get(item.productId) ?? {
      totalSold: 0,
      totalRevenue: 0,
    }
    current.totalSold += item.quantity
    current.totalRevenue += item.quantity * toNumber(item.price)
    soldByProduct.set(item.productId, current)
  }
  const topSellingProducts = [...soldByProduct.entries()]
    .map(([productId, metrics]) => ({
      product: productById.get(productId),
      ...metrics,
    }))
    .filter(x => x.product)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5)
    .map(x => ({
      name: x.product!.name,
      images: x.product!.images,
      price: toNumber(x.product!.price),
      totalSold: x.totalSold,
      totalRevenue: x.totalRevenue,
    }))

  const allOrders = await db.select().from(orders)
  const allUsers = await db.select().from(users)
  const userById = new Map(allUsers.map(u => [u.id, u]))
  const spentByUser = new Map<string, { totalSpent: number; totalOrders: number }>()
  for (const order of allOrders) {
    const current = spentByUser.get(order.userId) ?? {
      totalSpent: 0,
      totalOrders: 0,
    }
    current.totalSpent += toNumber(order.totalAmount)
    current.totalOrders += 1
    spentByUser.set(order.userId, current)
  }
  const topCustomers = [...spentByUser.entries()]
    .map(([userId, metrics]) => ({ user: userById.get(userId), ...metrics }))
    .filter(x => x.user)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5)
    .map(x => ({
      name: x.user!.name,
      email: x.user!.email,
      totalSpent: x.totalSpent,
      totalOrders: x.totalOrders,
    }))

  const returnedOrderIds = new Set((await db.select({ id: orders.id }).from(orders).where(ne(orders.returnStatus, 'none'))).map(x => x.id))
  const returnByProduct = new Map<string, number>()
  for (const item of allOrderItems) {
    if (returnedOrderIds.has(item.orderId)) {
      returnByProduct.set(item.productId, (returnByProduct.get(item.productId) ?? 0) + item.quantity)
    }
  }
  const highReturnProducts = [...returnByProduct.entries()]
    .map(([productId, totalReturns]) => {
      const sold = soldByProduct.get(productId)?.totalSold ?? totalReturns
      const product = productById.get(productId)
      return {
        product,
        totalReturns,
        returnRate: sold ? Number(((totalReturns / sold) * 100).toFixed(2)) : 0,
      }
    })
    .filter(x => x.product)
    .sort((a, b) => b.totalReturns - a.totalReturns)
    .slice(0, 5)
    .map(x => ({
      name: x.product!.name,
      images: x.product!.images,
      price: toNumber(x.product!.price),
      totalReturns: x.totalReturns,
      returnRate: x.returnRate,
    }))

  return {
    topSellingProducts,
    topCustomers,
    highReturnProducts,
  }
}
