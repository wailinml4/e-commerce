import { motion } from 'framer-motion'
import { X, RotateCcw, Package, User, Calendar, DollarSign } from 'lucide-react'
import type { Order, OrderItem } from '../../types'

interface ReturnDetailsModalProps {
  order: Order | null
  onClose: () => void
}

const ReturnDetailsModal = ({ order, onClose }: ReturnDetailsModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getReturnStatusColor = (status: string) => {
    switch (status) {
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

  if (!order) return null

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
          <h3 className="text-lg font-semibold text-white">Return Details</h3>
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
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getReturnStatusColor(order.returnStatus ?? '')}`}>
                {order.returnStatus}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-300">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">{order.returnRequestedAt ? new Date(order.returnRequestedAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <DollarSign className="h-4 w-4 mr-2" />
                <span className="text-sm">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
            <div className="flex items-center mb-3">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              <h4 className="text-white font-medium">Customer Information</h4>
            </div>
            <div>
              <p className="text-gray-300">
                <span className="text-gray-400">Name:</span> {order.user?.name || 'N/A'}
              </p>
              <p className="text-gray-300">
                <span className="text-gray-400">Email:</span> {order.user?.email || 'N/A'}
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
            <div className="flex items-center mb-3">
              <RotateCcw className="h-4 w-4 mr-2 text-orange-400" />
              <h4 className="text-white font-medium">Return Reason</h4>
            </div>
            <p className="text-gray-300 capitalize">{order.returnReason}</p>
            {order.returnDescription && (
              <div className="mt-2 pt-2 border-t border-neutral-800">
                <p className="text-gray-400 text-sm">Description:</p>
                <p className="text-gray-300">{order.returnDescription}</p>
              </div>
            )}
          </div>

          <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
            <div className="flex items-center mb-3">
              <Package className="h-4 w-4 mr-2 text-gray-400" />
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

export default ReturnDetailsModal
