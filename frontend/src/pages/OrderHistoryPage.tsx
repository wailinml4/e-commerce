import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useOrderStore } from '../stores/useOrderStore'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { X } from 'lucide-react'

const OrderHistoryPage = () => {
  const { myOrders, getMyOrders, isLoading, cancelOrder } = useOrderStore()
  const navigate = useNavigate()
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)

  useEffect(() => {
    getMyOrders()
  }, [getMyOrders])

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

  const handleCancelClick = (orderId: string) => {
    setCancelOrderId(orderId)
  }

  const handleConfirmCancel = async () => {
    if (cancelOrderId) {
      await cancelOrder(cancelOrderId)
      setCancelOrderId(null)
    }
  }

  const handleCancelCancel = () => {
    setCancelOrderId(null)
  }

  if (isLoading) {
    return <LoadingSpinner variant="orders" />
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl font-light mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          My Orders
        </motion.h1>

        {myOrders.length === 0 ? (
          <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className="text-gray-400 text-lg">No orders yet</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {myOrders.map(order => (
              <motion.div
                key={order.id}
                className="bg-gray-50 rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Order #{order.id.slice(-8)}</h3>
                    <p className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">
                    {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                  </p>
                  <div className="flex items-center space-x-4">
                    {order.status === 'pending' && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleCancelClick(order.id)
                        }}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                      >
                        Cancel Order
                      </button>
                    )}
                    <p className="text-gray-900 font-medium">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {cancelOrderId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Cancellation</h3>
              <button onClick={handleCancelCancel} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelCancel}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default OrderHistoryPage
