import { motion } from 'framer-motion'
import { ANIMATION_DURATION } from '../../constants'
import type { Order, OrderStatus } from '../../types'

interface OrderTableProps {
  orders: Order[]
  onStatusChange: (orderId: string, status: OrderStatus) => void
}


const OrderTable = ({ orders, onStatusChange }: OrderTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-800">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Items</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {orders.map(order => (
            <motion.tr
              key={order.id}
              className="hover:bg-neutral-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: ANIMATION_DURATION.NORMAL }}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">#{order.id.slice(-8)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.user?.name || order.user?.email || 'Unknown'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{order.orderItems.length} items</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${order.totalAmount.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative">
                  <select
                    value={order.status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => onStatusChange(order.id, e.target.value as OrderStatus)}
                    className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-white/15 px-3 py-1.5 text-xs font-medium cursor-pointer pr-8"
                  >
                    <option value="pending" className="bg-gray-900 text-gray-100">Pending</option>
                    <option value="processing" className="bg-gray-900 text-gray-100">Processing</option>
                    <option value="shipped" className="bg-gray-900 text-gray-100">Shipped</option>
                    <option value="delivered" className="bg-gray-900 text-gray-100">Delivered</option>
                    <option value="cancelled" className="bg-gray-900 text-gray-100">Cancelled</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderTable
