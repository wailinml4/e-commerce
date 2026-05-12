import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { ANIMATION_DURATION } from '../../constants'
import StatusBadge from '../shared/StatusBadge'
import type { Order } from '../../types'

interface ReturnTableProps {
  returns: Order[]
  onApprove: (orderId: string) => void
  onReject: (orderId: string) => void
}

const ReturnTable = ({ returns, onApprove, onReject }: ReturnTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-800">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Reason</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {returns.map((order: Order) => (
            <motion.tr
              key={order.id}
              className="hover:bg-neutral-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: ANIMATION_DURATION.NORMAL }}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">#{order.id.slice(-8)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.user?.name || order.user?.email || 'Unknown'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {order.returnRequestedAt ? new Date(order.returnRequestedAt).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">{order.returnReason}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${order.totalAmount.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={order.returnStatus ?? 'none'} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {order.returnStatus === 'requested' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        onApprove(order.id)
                      }}
                      className="text-green-400 hover:text-green-300 p-1"
                      title="Approve"
                      aria-label="Approve return"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        onReject(order.id)
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Reject"
                      aria-label="Reject return"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReturnTable
