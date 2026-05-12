import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrderStore } from '../stores/useOrderStore'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import type { Order, OrderItem } from '../types'
import ReturnRequestModal from '../components/returns/ReturnRequestModal'
import { X } from 'lucide-react'

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getOrderById, isLoading, cancelOrder, requestReturn } = useOrderStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(id!)
        setOrder(orderData)
      } catch (__error) {
        navigate('/orders')
      }
    }
    fetchOrder()
  }, [id, getOrderById, navigate])

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

  const handleCancelOrder = async () => {
    await cancelOrder(id!)
    setIsCancelModalOpen(false)
    const orderData = await getOrderById(id!)
    setOrder(orderData)
  }

  const handleReturnRequest = async (returnData: { returnReason: string; returnDescription: string }) => {
    await requestReturn(id!, returnData)
    setIsReturnModalOpen(false)
    const orderData = await getOrderById(id!)
    setOrder(orderData)
  }

  if (isLoading || !order) {
    return <LoadingSpinner variant="detail" />
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={() => navigate('/orders')}
          className="mb-6 text-gray-600 hover:text-gray-900 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          ← Back to Orders
        </motion.button>

        <motion.div
          className="bg-gray-50 rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-light text-gray-900 mb-2">Order #{order.id.slice(-8)}</h1>
              <p className="text-gray-500">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
              {order.status === 'pending' && (
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Cancel Order
                </button>
              )}
              {order.status === 'delivered' && order.returnStatus === 'none' && (
                <button
                  onClick={() => setIsReturnModalOpen(true)}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Request Return
                </button>
              )}
              {order.returnStatus === 'requested' && <span className="text-gray-600 text-sm font-medium">Return Requested</span>}
              {order.returnStatus === 'approved' && <span className="text-gray-600 text-sm font-medium">Return Approved</span>}
              {order.returnStatus === 'rejected' && <span className="text-gray-600 text-sm font-medium">Return Rejected</span>}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item: OrderItem, index: number) => (
                <div key={`${order.id}-${item.product?.id || item.product}-${index}`} className="flex items-center space-x-4">
                  <img
                    src={item.image || item.product?.images?.[0]}
                    alt={item.name || item.product?.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-medium">{item.name || item.product?.name}</h3>
                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-gray-900 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-2xl font-medium text-gray-900">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {isCancelModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Confirm Cancellation</h3>
                <button onClick={() => setIsCancelModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <ReturnRequestModal isOpen={isReturnModalOpen} onClose={() => setIsReturnModalOpen(false)} onSubmit={handleReturnRequest} />
      </div>
    </div>
  )
}

export default OrderDetailsPage
