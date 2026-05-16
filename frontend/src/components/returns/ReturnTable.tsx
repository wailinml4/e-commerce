import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
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
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/5">
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Order ID</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Customer</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Date</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Reason</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Amount</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {returns.map((order: Order) => (
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
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-white/40 font-medium">
                  {order.returnRequestedAt ? new Date(order.returnRequestedAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-5">
                  <span className="text-xs font-medium text-white/50 capitalize bg-white/5 px-2 py-1 rounded-lg">
                      {order.returnReason}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-white/90">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <StatusBadge status={order.returnStatus ?? 'none'} variant="spatial" />
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {order.returnStatus === 'requested' && (
                      <>
                        <button
                          onClick={() => onApprove(order.id)}
                          className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => onReject(order.id)}
                          className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
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

export default ReturnTable
