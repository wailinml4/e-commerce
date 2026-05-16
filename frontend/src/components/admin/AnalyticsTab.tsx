import { useEffect, useState } from 'react'
import axiosInstance from '../../config/axiosInstance'
import { Users, Package, ShoppingCart, DollarSign, Activity } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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
    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-white/40 text-xs font-medium">Loading Analytics...</p>
        </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard title="Total Customers" value={analyticsData.users.toLocaleString()} icon={Users} trend="+12.4%" color="indigo" />
        <AnalyticsCard title="Total Products" value={analyticsData.products.toLocaleString()} icon={Package} trend="+3.1%" color="cyan" />
        <AnalyticsCard title="Total Orders" value={analyticsData.totalOrders.toLocaleString()} icon={ShoppingCart} trend="+18.5%" color="amber" />
        <AnalyticsCard title="Total Revenue" value={`$${analyticsData.totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+22.9%" color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Activity Chart */}
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <Activity size={18} className="text-primary" />
                <h3 className="text-lg font-semibold text-white/90">System Performance</h3>
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyOrdersData}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        stroke="rgba(255,255,255,0.2)" 
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fill="url(#colorRevenue)" name="Revenue" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-lg font-semibold text-white/90 mb-6">Network Health</h3>
              <div className="space-y-6">
                  {[
                      { label: "Core Uptime", value: "99.9%" },
                      { label: "Server Load", value: "12.4%" },
                      { label: "Memory Usage", value: "42.1%" }
                  ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                          <div className="flex justify-between text-xs font-medium text-white/40">
                              <span>{stat.label}</span>
                              <span className="text-white">{stat.value}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-primary/40 w-full" />
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <OrderAnalytics />
    </div>
  )
}

const AnalyticsCard = ({ title, value, icon: Icon, trend, color }: any) => {
    const colors: any = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
        amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    }

    return (
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl shadow-xl hover:bg-white/[0.04] transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${colors[color]} border`}>
                    <Icon size={20} />
                </div>
                <span className="text-emerald-400 text-xs font-bold">{trend}</span>
            </div>
            <p className="text-sm text-white/40 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white/90">{value}</h3>
        </div>
    )
}

export default AnalyticsTab
