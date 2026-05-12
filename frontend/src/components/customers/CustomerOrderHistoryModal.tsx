import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Package, Calendar, DollarSign } from 'lucide-react'
import { useUserStore } from '../../stores/useUserStore'
import type { User, Order } from '../../types'

interface CustomerOrderHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900 text-yellow-200'
      case 'processing':
        return 'bg-blue-900 text-blue-200'
      case 'shipped':
        return 'bg-purple-900 text-purple-200'
      case 'delivered':
        return 'bg-green-900 text-green-200'
      case 'cancelled':
        return 'bg-red-900 text-red-200'
      default:
        return 'bg-gray-700 text-gray-300'
    }
  }

  const formatAmount = (value: number | string | undefined) => {
    const num = Number(value ?? 0)
    return Number.isFinite(num) ? num.toFixed(2) : '0.00'
  }

  if (!isOpen || !user) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <motion.div
        className="bg-neutral-950 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden border border-neutral-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <h3 className="text-lg font-semibold text-white">Order History</h3>
            <p className="text-sm text-gray-400">
              {user.name} ({user.email})
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders found for this customer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div key={order.id || `order-${index}`} className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Order ID: {order.id ? order.id.slice(-8).toUpperCase() : 'N/A'}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="border-t border-neutral-800 pt-3">
                    <p className="text-sm text-gray-400 mb-2">{order.orderItems?.length || 0} item(s)</p>
                    <div className="flex items-center text-gray-200">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-medium">${formatAmount(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default CustomerOrderHistoryModal
