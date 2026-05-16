import { useEffect, useState } from 'react'
import {
  getDashboardMetricsService,
  getDashboardTrendsService,
  getDashboardNewItemsService,
  getDashboardInsightsService,
} from '../services/analytics.service'
import { getOrderByIdAdminService } from '../services/order.service'
import { DollarSign, Package, ShoppingCart, RotateCcw, Users, Activity } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import OrderDetailsModal from '../components/orders/OrderDetailsModal'
import ReturnDetailsModal from '../components/returns/ReturnDetailsModal'

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState<any>(null)
  const [trends, setTrends] = useState<any>(null)
  const [newItems, setNewItems] = useState<any>(null)
  const [insights, setInsights] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [revenuePeriod, setRevenuePeriod] = useState('7days')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [selectedReturn, setSelectedReturn] = useState<any>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsRes, trendsRes, newItemsRes, insightsRes] = await Promise.all([
          getDashboardMetricsService(),
          getDashboardTrendsService(revenuePeriod),
          getDashboardNewItemsService(),
          getDashboardInsightsService(),
        ])

        setMetrics(metricsRes.data.data)
        setTrends(trendsRes.data.data)
        setNewItems(newItemsRes.data.data)
        setInsights(insightsRes.data.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  useEffect(() => {
    const fetchTrendsData = async () => {
      try {
        const trendsRes = await getDashboardTrendsService(revenuePeriod)
        setTrends(trendsRes.data.data)
      } catch (error) {
        console.error('Error fetching trends data:', error)
      }
    }

    if (revenuePeriod && !isLoading) {
      fetchTrendsData()
    }
  }, [revenuePeriod])

  const handleOrderClick = async (item: any) => {
    try {
      const response = await getOrderByIdAdminService({ orderId: item.id })
      setSelectedOrder(response.data.data)
    } catch (error) {
      console.error('Error fetching order details:', error)
    }
  }

  const handleReturnClick = async (item: any) => {
    try {
      const response = await getOrderByIdAdminService({ orderId: item.id })
      setSelectedReturn(response.data.data)
    } catch (error) {
      console.error('Error fetching return details:', error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white/90">Dashboard</h1>
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
              {[
                { value: '7days', label: '7 Days' },
                { value: '30days', label: '30 Days' },
                { value: '12months', label: '12 Months' }
              ].map(period => (
                <button
                  key={period.value}
                  onClick={() => setRevenuePeriod(period.value)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    revenuePeriod === period.value
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {period.label}
                </button>
              ))}
          </div>
      </div>

      {/* Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <DashboardCard title="Total Revenue" value={`$${metrics.thisYear.revenue.toLocaleString()}`} icon={DollarSign} color="text-indigo-400" />
          <DashboardCard title="Total Products" value={metrics.thisYear.products.toLocaleString()} icon={Package} color="text-cyan-400" />
          <DashboardCard title="Total Orders" value={metrics.thisYear.orders.toLocaleString()} icon={ShoppingCart} color="text-amber-400" />
          <DashboardCard title="Total Returns" value={metrics.thisYear.returns.toLocaleString()} icon={RotateCcw} color="text-rose-400" />
          <DashboardCard title="Total Customers" value={metrics.thisYear.customers.toLocaleString()} icon={Users} color="text-emerald-400" />
        </div>
      )}

      {/* Charts Section */}
      {trends && (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Activity size={18} className="text-primary" />
            <h3 className="text-lg font-semibold text-white/90">Revenue Trend</h3>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends.revenue.map((item: any) => ({ date: item.id, revenue: item.revenue ?? 0 }))}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
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
                  dy={10}
                  tickFormatter={(val) => val.length > 10 ? new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : val}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                  tickFormatter={v => `$${v}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tables Section */}
      {newItems && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NewItemsList title="Recent Orders" items={newItems.orders.filter((o: any) => o.status === 'pending' || o.status === 'processing')} onOrderClick={handleOrderClick} />
          <NewItemsList title="Recent Returns" items={newItems.returns.filter((r: any) => r.returnStatus === 'requested')} onOrderClick={handleReturnClick} />
        </div>
      )}

      {/* Insights Section */}
      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InsightList title="Top Selling Products" items={insights.topSellingProducts} type="product" />
          <InsightList title="Top Customers" items={insights.topCustomers} type="customer" />
          <InsightList title="High Return Products" items={insights.highReturnProducts} type="return" />
        </div>
      )}

      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      <ReturnDetailsModal order={selectedReturn} onClose={() => setSelectedReturn(null)} />
    </div>
  )
}

const DashboardCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl shadow-xl">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <p className="text-sm text-white/40 mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-white/90">{value}</h3>
  </div>
)

const NewItemsList = ({ title, items, onOrderClick }: any) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-white/90">{title}</h3>
      <button className="text-xs text-primary hover:underline">View All</button>
    </div>
    <div className="space-y-4">
      {items.slice(0, 5).map((item: any) => (
        <div key={item.id} onClick={() => onOrderClick(item)} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
          <div className="text-sm font-medium text-white/70">#{item.id.slice(-8)}</div>
          <div className="text-sm text-white/90 font-semibold">{item.user?.name || 'Unknown'}</div>
          <div className="text-sm text-white/60">${item.totalAmount}</div>
        </div>
      ))}
      {items.length === 0 && <p className="text-sm text-white/20 text-center py-4">No new items</p>}
    </div>
  </div>
)

const InsightList = ({ title, items, type }: any) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
    <h3 className="text-lg font-semibold text-white/90 mb-6">{title}</h3>
    <div className="space-y-4">
      {items.slice(0, 5).map((item: any, i: number) => (
        <div key={i} className="flex items-center justify-between">
          <div className="text-sm text-white/70">{item.name}</div>
          <div className="text-sm font-bold text-white/90">
             {type === 'product' ? `${item.unitsSold || 0} sold` : type === 'customer' ? `$${(item.totalSpent || 0).toLocaleString()}` : `${item.returnRate || 0}% rate`}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default AdminDashboardPage
