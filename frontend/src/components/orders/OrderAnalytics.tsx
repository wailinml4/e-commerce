import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import { useOrderStore } from '../../stores/useOrderStore'
import type { OrderStatus } from '../../types'

interface OrderAnalyticsData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  statusCounts: Partial<Record<OrderStatus, number>>
  last7Days: { count: number; revenue: number }
  last30Days: { count: number; revenue: number }
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color?: string
}

const StatCard = ({ title, value, icon: Icon, color = '' }: StatCardProps) => (
  <motion.div
    className={`bg-gray-700 rounded-lg p-6 ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <Icon className="h-8 w-8 text-gray-900" />
    </div>
  </motion.div>
)

const OrderAnalytics = () => {
  const { orders, getAllOrders, isLoading } = useOrderStore()
  const [analytics, setAnalytics] = useState<OrderAnalyticsData | null>(null)

  useEffect(() => {
    getAllOrders()
  }, [getAllOrders])

  useEffect(() => {
    if (orders.length > 0) {
      calculateAnalytics()
    }
  }, [orders])

  const calculateAnalytics = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalOrders = orders.length
    const averageOrderValue = totalRevenue / totalOrders

    const statusCounts = orders.reduce<Partial<Record<OrderStatus, number>>>((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})

    const last7Days = orders.filter(order => new Date(order.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    const last7DaysRevenue = last7Days.reduce((sum, order) => sum + order.totalAmount, 0)

    const last30Days = orders.filter(order => new Date(order.createdAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    const last30DaysRevenue = last30Days.reduce((sum, order) => sum + order.totalAmount, 0)

    setAnalytics({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      statusCounts,
      last7Days: { count: last7Days.length, revenue: last7DaysRevenue },
      last30Days: { count: last30Days.length, revenue: last30DaysRevenue },
    })
  }

  if (isLoading || !analytics) {
    return <div className="text-center py-12 text-gray-400">Loading analytics...</div>
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold text-white mb-6">Order Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`$${analytics.totalRevenue.toFixed(2)}`} icon={DollarSign} />
        <StatCard title="Total Orders" value={analytics.totalOrders} icon={ShoppingBag} />
        <StatCard title="Avg Order Value" value={`$${analytics.averageOrderValue.toFixed(2)}`} icon={TrendingUp} />
        <StatCard title="Total Customers" value={new Set(orders.map(o => o.user?.id)).size} icon={Users} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          className="bg-gray-700 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Last 7 Days</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Orders</span>
              <span className="text-white font-medium">{analytics.last7Days.count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Revenue</span>
              <span className="text-gray-900 font-semibold">${analytics.last7Days.revenue.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-700 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Last 30 Days</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Orders</span>
              <span className="text-white font-medium">{analytics.last30Days.count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Revenue</span>
              <span className="text-gray-900 font-semibold">${analytics.last30Days.revenue.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="bg-gray-700 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Order Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(analytics.statusCounts).map(([status, count]) => (
            <div key={status} className="bg-gray-600 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-gray-400 text-sm capitalize">{status}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default OrderAnalytics
