import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  getDashboardMetricsService,
  getDashboardTrendsService,
  getDashboardNewItemsService,
  getDashboardInsightsService,
} from '../services/analytics.service'
import { getOrderByIdAdminService } from '../services/order.service'
import { DollarSign, Package, ShoppingCart, RotateCcw, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import OrderDetailsModal from '../components/orders/OrderDetailsModal'
import ReturnDetailsModal from '../components/returns/ReturnDetailsModal'

interface PeriodMetrics {
  revenue: number
  products: number
  orders: number
  returns: number
  customers: number
}

interface DashboardMetrics {
  today: PeriodMetrics
  thisMonth: PeriodMetrics
  thisYear: PeriodMetrics
}

interface TrendItem {
  id: string
  revenue?: number
  orders?: number
  returns?: number
  customers?: number
}

interface DashboardTrends {
  revenue: TrendItem[]
  orders: TrendItem[]
  returns: TrendItem[]
  customers: TrendItem[]
}

interface DashboardNewItem {
  id: string
  name?: string
  category?: string
  price?: number
  totalAmount?: number
  status?: string
  returnStatus?: string
  returnReason?: string
  firstName?: string
  lastName?: string
  email?: string
  user?: { firstName?: string; lastName?: string; name?: string }
  createdAt?: string
}

interface DashboardNewItems {
  products: DashboardNewItem[]
  orders: DashboardNewItem[]
  returns: DashboardNewItem[]
  customers: DashboardNewItem[]
}

interface InsightItem {
  id: string
  name: string
  value?: number
  totalRevenue?: number
  revenue?: number
  unitsSold?: number
  sales?: number
  totalSold?: number
  image?: string
  orders?: number
  totalOrders?: number
  orderCount?: number
  email?: string
  totalSpent?: number
  lastOrder?: string
  returns?: number
  totalReturns?: number
  returnCount?: number
  returnRate?: number
}

interface DashboardInsights {
  topSellingProducts: InsightItem[]
  topCustomers: InsightItem[]
  highReturnProducts: InsightItem[]
}

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [trends, setTrends] = useState<DashboardTrends | null>(null)
  const [newItems, setNewItems] = useState<DashboardNewItems | null>(null)
  const [insights, setInsights] = useState<DashboardInsights | null>(null)
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

        setMetrics(metricsRes.data.data as unknown as DashboardMetrics)
        setTrends(trendsRes.data.data as unknown as DashboardTrends)
        setNewItems(newItemsRes.data.data as unknown as DashboardNewItems)
        setInsights(insightsRes.data.data as unknown as DashboardInsights)
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
        setTrends(trendsRes.data.data as unknown as DashboardTrends)
      } catch (error) {
        console.error('Error fetching trends data:', error)
      }
    }

    if (revenuePeriod) {
      fetchTrendsData()
    }
  }, [revenuePeriod])

  
  const handleOrderClick = async (item: DashboardNewItem) => {
    try {
      const response = await getOrderByIdAdminService({ orderId: item.id })
      setSelectedOrder(response.data.data)
    } catch (error) {
      console.error('Error fetching order details:', error)
    }
  }

  const handleReturnClick = async (item: DashboardNewItem) => {
    try {
      const response = await getOrderByIdAdminService({ orderId: item.id })
      setSelectedReturn(response.data.data)
    } catch (error) {
      console.error('Error fetching return details:', error)
    }
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`

  // Filter for non-processed orders (pending, processing)
  const getNonProcessedOrders = (orders: DashboardNewItem[]) => {
    return orders.filter(order => 
      order.status === 'pending' || order.status === 'processing'
    )
  }

  // Filter for non-processed returns (requested only)
  const getNonProcessedReturns = (returns: DashboardNewItem[]) => {
    return returns.filter(returnItem => 
      returnItem.returnStatus === 'requested'
    )
  }

  if (isLoading) {
    return <LoadingSpinner variant="dashboard" />
  }

  return (
    <div className="space-y-6">
      <motion.h1
        className="text-3xl font-semibold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>

      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <DashboardCard
            title="Total Revenue"
            value={formatCurrency(metrics.thisYear.revenue)}
            icon={DollarSign}
          />
          <DashboardCard
            title="Total Products"
            value={metrics.thisYear.products.toLocaleString()}
            icon={Package}
          />
          <DashboardCard
            title="Total Orders"
            value={metrics.thisYear.orders.toLocaleString()}
            icon={ShoppingCart}
          />
          <DashboardCard
            title="Total Returns"
            value={metrics.thisYear.returns.toLocaleString()}
            icon={RotateCcw}
          />
          <DashboardCard
            title="Total Customers"
            value={metrics.thisYear.customers.toLocaleString()}
            icon={Users}
          />
        </div>
      )}

      {trends && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
            <div className="flex gap-2">
              {[
                { value: '7days', label: 'Last 7 Days' },
                { value: '30days', label: 'Last 30 Days' },
                { value: '12months', label: 'Last 12 Months' }
              ].map(period => (
                <button
                  key={period.value}
                  onClick={() => setRevenuePeriod(period.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    revenuePeriod === period.value
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-800 text-gray-300 hover:bg-neutral-900'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          <TrendChart
            title=""
            data={trends.revenue.map(item => ({
              date: item.id,
              revenue: item.revenue ?? 0,
            }))}
            dataKey="revenue"
            color="#10B981"
            formatValue={v => `$${v.toLocaleString()}`}
          />
        </div>
      )}

      {newItems && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <NewItemsCard 
            title="New Orders" 
            items={getNonProcessedOrders(newItems.orders)} 
            type="order" 
            onOrderClick={handleOrderClick}
          />
          <NewItemsCard 
            title="New Returns" 
            items={getNonProcessedReturns(newItems.returns)} 
            type="return" 
            onReturnClick={handleReturnClick}
          />
        </div>
      )}

      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <InsightCard title="Top Selling Products" items={insights.topSellingProducts} type="product" />
          <InsightCard title="Top Customers" items={insights.topCustomers} type="customer" />
          <InsightCard title="High Return Products" items={insights.highReturnProducts} type="return" />
        </div>
      )}

      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
      <ReturnDetailsModal 
        order={selectedReturn} 
        onClose={() => setSelectedReturn(null)} 
      />
    </div>
  )
}

interface DashboardCardProps {
  title: string
  value: string | number
  icon: React.ElementType
}
const DashboardCard = ({ title, value, icon: Icon }: DashboardCardProps) => (
  <motion.div
    className="bg-neutral-900 rounded-lg p-4 shadow-lg border border-neutral-800"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-xs mb-1 font-semibold">{title}</p>
        <h3 className="text-white text-xl font-bold">{value}</h3>
      </div>
      <Icon className="h-8 w-8 text-gray-400" />
    </div>
  </motion.div>
)

interface TrendChartProps {
  title: string
  data: { date: string; revenue?: number }[]
  dataKey: string
  color: string
  formatValue: (v: number) => string
}
const TrendChart = ({ title, data, dataKey, color, formatValue }: TrendChartProps) => (
  <motion.div
    className="bg-neutral-950 rounded-lg p-6 shadow-lg border border-neutral-800"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {title && <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>}
    <ResponsiveContainer width="100%" height={450}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          stroke="#9CA3AF" 
          tick={{ fontSize: 12 }} 
          tickFormatter={formatValue}
        />
        <Tooltip
          formatter={(value: number) => [formatValue(value), 'Revenue']}
          contentStyle={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #374151',
          }}
        />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          fill={color}
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </motion.div>
)

interface NewItemsCardProps {
  title: string
  items: DashboardNewItem[]
  type: string
  onOrderClick?: (item: DashboardNewItem) => void
  onReturnClick?: (item: DashboardNewItem) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'processing':
      return 'bg-blue-500/20 text-blue-400'
    case 'shipped':
      return 'bg-purple-500/20 text-purple-400'
    case 'delivered':
      return 'bg-green-500/20 text-green-400'
    case 'cancelled':
      return 'bg-red-500/20 text-red-400'
    case 'requested':
      return 'bg-orange-500/20 text-orange-400'
    case 'approved':
      return 'bg-green-500/20 text-green-400'
    case 'rejected':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

const NewItemsCard = ({ title, items, type, onOrderClick, onReturnClick }: NewItemsCardProps) => {
  const renderOrderTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs font-medium text-gray-400 border-b border-neutral-800">
            <th className="pb-2">Order ID</th>
            <th className="pb-2">Customer</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {items.slice(0, 7).map(item => (
            <tr key={item.id} className="text-sm hover:bg-neutral-900 cursor-pointer" onClick={() => onOrderClick?.(item)}>
              <td className="py-3 text-gray-300">{item.id.slice(-8)}</td>
              <td className="py-3 text-white">{item.user?.name || item.firstName || item.lastName || 'Unknown'}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status || '')}`}>
                  {item.status}
                </span>
              </td>
              <td className="py-3 text-gray-300">${item.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderReturnTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs font-medium text-gray-400 border-b border-neutral-800">
            <th className="pb-2">Return ID</th>
            <th className="pb-2">Customer</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {items.slice(0, 7).map(item => (
            <tr key={item.id} className="text-sm hover:bg-neutral-900 cursor-pointer" onClick={() => onReturnClick?.(item)}>
              <td className="py-3 text-gray-300">{item.id.slice(-8)}</td>
              <td className="py-3 text-white">{item.user?.name || item.firstName || item.lastName || 'Unknown'}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.returnStatus || '')}`}>
                  {item.returnStatus}
                </span>
              </td>
              <td className="py-3 text-gray-300">${item.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <motion.div
      className="bg-neutral-950 rounded-lg p-6 shadow-lg border border-neutral-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
      </div>
      {items && items.length > 0 ? (
        type === 'order' ? renderOrderTable() : 
        type === 'return' ? renderReturnTable() : null
      ) : (
        <p className="text-gray-500 text-sm">
          {type === 'order' ? 'No new orders' : 
           type === 'return' ? 'No new returns' : 
           'No items'}
        </p>
      )}
    </motion.div>
  )
}

interface InsightCardProps {
  title: string
  items: InsightItem[]
  type: string
}
const InsightCard = ({ title, items, type }: InsightCardProps) => {
  
  const renderTableHeader = () => {
    if (type === 'customer') {
      return (
        <tr className="text-left text-xs font-medium text-gray-400 border-b border-neutral-800">
          <th className="pb-2">Customer</th>
          <th className="pb-2 text-right">Orders Placed</th>
          <th className="pb-2 text-right">Total Spent</th>
        </tr>
      )
    }
    if (type === 'return') {
      return (
        <tr className="text-left text-xs font-medium text-gray-400 border-b border-neutral-800">
          <th className="pb-2">Customer</th>
          <th className="pb-2 text-right">Returns</th>
          <th className="pb-2 text-right">Return Rate</th>
        </tr>
      )
    }
    return null
  }

  const renderTableRow = (item: InsightItem, index: number) => {
    // Debug: log item data to understand why numbers are zero
    console.log(`${type} item data:`, item);
    
    if (type === 'customer') {
      return (
        <tr key={index} className="text-sm">
          <td className="py-2">
            <div className="flex items-center gap-2">
              <span className="text-white">{item.name}</span>
            </div>
          </td>
          <td className="py-2 text-right text-gray-300">
            {item.orders || item.value || item.totalOrders || item.orderCount || 0}
          </td>
          <td className="py-2 text-right text-gray-300">
            ${(item.totalSpent || item.revenue || item.totalRevenue || 0).toFixed(2).toLocaleString()}
          </td>
        </tr>
      )
    }
    if (type === 'return') {
      return (
        <tr key={index} className="text-sm">
          <td className="py-2">
            <div className="flex items-center gap-2">
              <span className="text-white">{item.name}</span>
            </div>
          </td>
          <td className="py-2 text-right text-gray-300">
            {item.returns || item.value || item.totalReturns || item.returnCount || 0}
          </td>
          <td className="py-2 text-right text-gray-300">{item.returnRate || 0}%</td>
        </tr>
      )
    }
    if (type === 'product') {
      return (
        <tr key={index} className="text-sm">
          <td className="py-2">
            <div className="flex items-center gap-2">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
              )}
              <span className="text-white">{item.name}</span>
            </div>
          </td>
          <td className="py-2 text-right text-gray-300">
            {item.unitsSold || item.sales || item.value || item.totalSold || 0}
          </td>
          <td className="py-2 text-right text-gray-300">
            ${item.totalRevenue ? item.totalRevenue.toLocaleString() : '0'}
          </td>
        </tr>
      )
    }
    return null
  }

  return (
    <motion.div
      className="bg-neutral-950 rounded-lg p-6 shadow-lg border border-neutral-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {type === 'product' && <TrendingUp className="h-4 w-4 text-green-500" />}
        {type === 'customer' && <ArrowUpRight className="h-4 w-4 text-blue-500" />}
        {type === 'return' && <ArrowDownRight className="h-4 w-4 text-orange-500" />}
      </div>
      {type === 'product' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-400 border-b border-neutral-800">
                <th className="pb-2">Product</th>
                <th className="pb-2 text-right">Sales</th>
                <th className="pb-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {items && items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index} className="text-sm">
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded" />
                        )}
                        <span className="text-white">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-2 text-right text-gray-300">{item.unitsSold || 0}</td>
                    <td className="py-2 text-right text-gray-300">${item.totalRevenue ? item.totalRevenue.toLocaleString() : '0'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500 text-sm">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : type === 'customer' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>{renderTableHeader()}</thead>
            <tbody className="divide-y divide-neutral-800">
              {items && items.length > 0 ? (
                items.map(renderTableRow)
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500 text-sm">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : type === 'return' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>{renderTableHeader()}</thead>
            <tbody className="divide-y divide-neutral-800">
              {items && items.length > 0 ? (
                items.map(renderTableRow)
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500 text-sm">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>{renderTableHeader()}</thead>
            <tbody className="divide-y divide-neutral-800">
              {items && items.length > 0 ? (
                items.map(renderTableRow)
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500 text-sm">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}

export default AdminDashboardPage
