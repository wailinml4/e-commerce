import { motion, AnimatePresence } from 'framer-motion'
import { X, Package, Calendar, DollarSign, User, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import type { Order, OrderItem } from '../../types'
import StatusBadge from '../shared/StatusBadge'

interface OrderDetailsModalProps {
  order: Order | null
  onClose: () => void
}

const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
  if (!order) return null

  const [showRaw, setShowRaw] = useState(false)

  return (
    <AnimatePresence>
      {order && (
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
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            {/* Header */}
            <div className="px-10 py-8 flex items-center justify-between border-b border-white/5 shrink-0 relative z-10">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                      <ClipboardList size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Order Details</h2>
                    <p className="text-xs text-white/40 font-medium font-mono uppercase tracking-widest">#{order.id.slice(-12).toUpperCase()}</p>
                  </div>
              </div>
              <button onClick={onClose} className="p-3 rounded-xl bg-white/5 text-white/30 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-10 overflow-y-auto custom-scrollbar relative z-10 space-y-8">
              {/* Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Temporal Stamp</span>
                      <div className="flex items-center gap-2 text-white/80">
                          <Calendar size={14} className="text-primary" />
                          <span className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Financial Total</span>
                      <div className="flex items-center gap-2 text-white/80">
                          <DollarSign size={14} className="text-emerald-400" />
                          <span className="text-sm font-bold text-emerald-400">${order.totalAmount.toFixed(2)}</span>
                      </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Process Status</span>
                      <div className="mt-1">
                          <StatusBadge status={order.status} variant="spatial" />
                      </div>
                  </div>
              </div>

              {/* Customer Section */}
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <User size={16} className="text-white/20" />
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Customer Information</h4>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <User size={20} className="text-white/20" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-white/90">{order.user?.name || 'Anonymous Entity'}</p>
                        <p className="text-sm text-white/30">{order.user?.email || 'N/A'}</p>
                    </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                    <Package size={16} className="text-white/20" />
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Asset Manifest</h4>
                </div>
                <div className="space-y-4">
                  {order.orderItems.map((item: OrderItem, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-black">
                            <img
                              src={item.image || item.product?.images?.[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white/90">{item.name}</p>
                          <p className="text-xs text-white/30 font-medium">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                          <p className="text-sm font-bold text-white/90">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-[10px] font-medium text-white/20">${item.price.toFixed(2)} / unit</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw Data Toggle */}
              <div className="flex justify-center">
                  <button 
                    onClick={() => setShowRaw(!showRaw)}
                    className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors"
                  >
                    {showRaw ? 'Hide Raw Data' : 'Show Raw Order Data'}
                  </button>
              </div>

              {showRaw && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-6 rounded-2xl bg-black border border-white/5"
                >
                  <pre className="text-[10px] font-mono text-white/40 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(order, null, 2)}</pre>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-10 py-8 border-t border-white/5 flex justify-between items-center shrink-0 relative z-10">
              <div>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Total Valuation</p>
                  <p className="text-3xl font-bold text-white tracking-tighter">${order.totalAmount.toFixed(2)}</p>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-white/5 text-white/60 rounded-xl font-bold text-sm hover:bg-white/10 hover:text-white transition-all"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default OrderDetailsModal
