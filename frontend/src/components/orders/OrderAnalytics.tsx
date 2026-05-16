import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ShoppingBag, TrendingUp, Users, PieChart, Calendar, ChevronRight } from 'lucide-react'
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
    return null // Handled by parent loading state usually
  }

  return (
    <motion.div 
        className="space-y-10" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/5" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">Secondary Telemetry</h2>
          <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenue Flow" value={`$${analytics.totalRevenue.toFixed(2)}`} icon={DollarSign} color="text-emerald-400" />
        <StatCard title="Acquisitions" value={analytics.totalOrders} icon={ShoppingBag} color="text-primary" />
        <StatCard title="Median Valuation" value={`$${analytics.averageOrderValue.toFixed(2)}`} icon={TrendingUp} color="text-amber-400" />
        <StatCard title="Unique Entities" value={new Set(orders.map(o => o.user?.id)).size} icon={Users} color="text-cyan-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Temporal Analysis */}
        <motion.div
          className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-8">
              <Calendar size={18} className="text-primary" />
              <h3 className="text-xl font-black tracking-tight uppercase">Temporal Analysis</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                  { label: "7 Day Cycle", data: analytics.last7Days },
                  { label: "30 Day Cycle", data: analytics.last30Days }
              ].map((cycle, i) => (
                  <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">{cycle.label}</p>
                      <div className="space-y-4">
                          <div className="flex justify-between items-end">
                              <span className="text-white/40 text-xs font-bold uppercase">Orders</span>
                              <span className="text-2xl font-black tracking-tighter">{cycle.data.count}</span>
                          </div>
                          <div className="flex justify-between items-end">
                              <span className="text-white/40 text-xs font-bold uppercase">Revenue</span>
                              <span className="text-2xl font-black tracking-tighter text-emerald-400">${cycle.data.revenue.toFixed(2)}</span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-8">
              <PieChart size={18} className="text-accent" />
              <h3 className="text-xl font-black tracking-tight uppercase">Status Distribution</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(analytics.statusCounts).map(([status, count]) => (
              <div key={status} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                    <span className="text-sm font-bold uppercase tracking-widest text-white/60">{status}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-lg font-black">{count}</span>
                    <ChevronRight size={14} className="text-white/20" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <motion.div
    className="bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl group hover:bg-white/[0.04] transition-all"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center justify-between mb-6">
        <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${color}`}>
            <Icon size={20} />
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
    </div>
    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
    <p className="text-3xl font-black text-white tracking-tighter leading-none">{value}</p>
  </motion.div>
)

export default OrderAnalytics
