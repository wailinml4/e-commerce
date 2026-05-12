import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import React from 'react'
import axiosInstance from '../../config/axiosInstance'
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import OrderAnalytics from '../orders/OrderAnalytics'

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dailyOrdersData, setDailyOrdersData] = useState<{ date: string; orders: number; revenue: number }[]>([])

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axiosInstance.get('/analytics')
        setAnalyticsData(response.data.data)
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        const dailyResponse = await axiosInstance.get(
          `/analytics/orders?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        )
        setDailyOrdersData(dailyResponse.data.data)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard title="Total Users" value={analyticsData.users.toLocaleString()} icon={Users} color="from-gray-900 to-gray-800" />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          color="from-gray-900 to-gray-800"
        />
        <AnalyticsCard
          title="Total Orders"
          value={analyticsData.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          color="from-gray-900 to-gray-800"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="from-gray-900 to-gray-800"
        />
      </div>
      <motion.div
        className="bg-neutral-950 rounded-lg p-6 shadow-lg border border-neutral-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailyOrdersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis yAxisId="left" stroke="#9CA3AF" />
            <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#E5E7EB" activeDot={{ r: 8 }} name="Orders" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#60A5FA" activeDot={{ r: 8 }} name="Revenue" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <OrderAnalytics />
    </div>
  )
}
export default AnalyticsTab

interface AnalyticsCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
}

const AnalyticsCard = ({ title, value, icon: Icon, color }: AnalyticsCardProps) => (
  <motion.div
    className={`bg-neutral-950 rounded-lg p-6 shadow-lg overflow-hidden relative border border-neutral-800 ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-center">
      <div className="z-10">
        <p className="text-gray-400 text-sm mb-1 font-semibold">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-50" />
    <div className="absolute -bottom-4 -right-4 text-gray-500 opacity-40">
      <Icon className="h-32 w-32" />
    </div>
  </motion.div>
)
