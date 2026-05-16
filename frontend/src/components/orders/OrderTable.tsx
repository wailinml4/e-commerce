import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { Order, OrderStatus } from '../../types'

interface OrderTableProps {
  orders: Order[]
  onStatusChange: (orderId: string, status: OrderStatus) => void
}

const OrderTable = ({ orders, onStatusChange }: OrderTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/5">
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Order ID</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Customer</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Date</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Items</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Total</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {orders.map((order: Order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group hover:bg-white/[0.03] transition-colors"
              >
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-white/60">#{order.id.slice(-8).toUpperCase()}</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-semibold text-white/90">{order.user?.name || 'Unknown'}</div>
                  <div className="text-[11px] text-white/30">{order.user?.email}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-white/60">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-bold text-white/50 uppercase tracking-wider">
                      {order.orderItems.length} items
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-white/90">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-5 text-right">
                    <div className="relative inline-block group/select">
                      <select
                        value={order.status}
                        onChange={e => onStatusChange(order.id, e.target.value as OrderStatus)}
                        className="appearance-none bg-white/5 border border-white/10 rounded-xl text-white/70 pl-3 pr-8 py-2 text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-primary/50 transition-all cursor-pointer hover:bg-white/10"
                      >
                        <option value="pending" className="bg-[#111]">Pending</option>
                        <option value="processing" className="bg-[#111]">Processing</option>
                        <option value="shipped" className="bg-[#111]">Shipped</option>
                        <option value="delivered" className="bg-[#111]">Delivered</option>
                        <option value="cancelled" className="bg-[#111]">Cancelled</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-white/20">
                        <ChevronRight size={14} className="rotate-90" />
                      </div>
                    </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

export default OrderTable
