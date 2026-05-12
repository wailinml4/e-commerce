import { motion } from 'framer-motion'
import { X, Package, Calendar, DollarSign, User } from 'lucide-react'
import { useState } from 'react'
import type { Order, OrderItem } from '../../types'

interface OrderDetailsModalProps {
  order: Order | null
  onClose: () => void
}

const OrderDetailsModal = ({ order, onClose }: OrderDetailsModalProps) => {
  if (!order) return null

  const [showRaw, setShowRaw] = useState(false)

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-gray-100 text-gray-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <motion.div
        className="bg-neutral-950 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden border border-neutral-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h3 className="text-lg font-semibold text-white">Order Details</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">Order ID</p>
                <p className="text-white font-medium">{order.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-300">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <DollarSign className="h-4 w-4 mr-2" />
                <span className="text-sm">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
            <div className="flex items-center mb-3">
              <User className="h-4 w-4 mr-2 text-gray-900" />
              <h4 className="text-white font-medium">Customer Information</h4>
            </div>
            <div className="flex justify-end mb-3">
              <button className="text-xs text-gray-400 hover:text-white" onClick={() => setShowRaw(s => !s)}>
                {showRaw ? 'Hide raw' : 'Show raw order'}
              </button>
            </div>
            <div>
              <p className="text-gray-300">
                <span className="text-gray-400">Name:</span> {order.user?.name || order.userId || 'N/A'}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Email:</span> {order.user?.email || 'N/A'}
              </p>
            </div>

            {showRaw && (
              <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 mt-4">
                <pre className="text-xs text-gray-300 overflow-x-auto">{JSON.stringify(order, null, 2)}</pre>
              </div>
            )}
          </div>

          <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
            <div className="flex items-center mb-3">
              <Package className="h-4 w-4 mr-2 text-gray-900" />
              <h4 className="text-white font-medium">Order Items</h4>
            </div>
            <div className="space-y-3">
              {order.orderItems.map((item: OrderItem, index: number) => (
                <div
                  key={`${order.id}-${item.product?.id || item.product}-${index}`}
                  className="flex items-center justify-between border-b border-neutral-800 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image || item.product?.images?.[0]}
                      alt={item.name || item.product?.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="text-white font-medium">{item.name || item.product?.name}</p>
                      <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
            <span className="text-gray-300">Total Amount</span>
            <span className="text-2xl font-bold text-white">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-neutral-800 text-gray-200 rounded-lg hover:bg-neutral-700 transition-colors">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default OrderDetailsModal
