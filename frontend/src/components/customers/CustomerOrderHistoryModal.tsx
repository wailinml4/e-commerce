import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, Calendar, DollarSign, History } from 'lucide-react'
import { useUserStore } from '../../stores/useUserStore'
import type { User as UserType, Order } from '../../types'
import StatusBadge from '../shared/StatusBadge'

interface CustomerOrderHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
}

const CustomerOrderHistoryModal = ({ isOpen, onClose, user }: CustomerOrderHistoryModalProps) => {
  const { getUserOrders } = useUserStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      fetchOrders()
    }
  }, [isOpen, user])

  const fetchOrders = async () => {
    if (!user) return
    setLoading(true)
    const userOrders = await getUserOrders(user.id)
    setOrders(userOrders)
    setLoading(false)
  }

  if (!isOpen || !user) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0A0A0B] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-10 py-8 flex items-center justify-between border-b border-white/5 shrink-0 relative z-10">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                      <History size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Order History</h2>
                    <p className="text-sm text-white/40 font-medium">Activity logs for {user.name}</p>
                  </div>
              </div>
              <button onClick={onClose} className="p-3 rounded-xl bg-white/5 text-white/30 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-10 overflow-y-auto custom-scrollbar relative z-10">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Retrieving History...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/5 border-dashed">
                  <Package className="h-12 w-12 mx-auto mb-4 text-white/10" />
                  <p className="text-white/40 text-sm font-bold uppercase tracking-widest">No transaction history detected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Package size={18} className="text-white/20 group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                                <p className="text-sm font-mono font-bold text-white/40 group-hover:text-white transition-colors uppercase tracking-widest">#{order.id.slice(-8).toUpperCase()}</p>
                                <div className="flex items-center gap-2 text-xs font-medium text-white/20 mt-1">
                                    <Calendar size={12} />
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <StatusBadge status={order.status} variant="spatial" />
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <p className="text-xs font-bold text-white/20 uppercase tracking-widest">{order.orderItems?.length || 0} Assets Transacted</p>
                        <div className="flex items-center gap-1 text-emerald-400 font-bold">
                          <DollarSign size={14} />
                          <span className="text-lg tracking-tighter">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-10 py-8 border-t border-white/5 flex justify-end shrink-0 relative z-10">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-white/5 text-white/60 rounded-xl font-bold text-sm hover:bg-white/10 hover:text-white transition-all"
              >
                Close History
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CustomerOrderHistoryModal
