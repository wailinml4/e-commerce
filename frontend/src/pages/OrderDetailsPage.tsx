import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrderStore } from '../stores/useOrderStore'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import type { Order, OrderItem } from '../types'
import ReturnRequestModal from '../components/returns/ReturnRequestModal'
import { ChevronLeft, Package, Calendar, CreditCard, User, AlertCircle, RefreshCcw } from 'lucide-react'

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
        return 'bg-amber-100 text-amber-700'
      case 'processing':
        return 'bg-blue-100 text-blue-700'
      case 'shipped':
        return 'bg-purple-100 text-purple-700'
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
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
    <div className="min-h-screen bg-app-bg pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={() => navigate('/orders')}
          className="group mb-8 flex items-center gap-2 text-app-muted hover:text-slate-900 transition-all font-bold uppercase tracking-widest text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </motion.button>

        <motion.div
          className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tighter">Order Details</h1>
                  <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-xs font-mono font-bold">#{order.id.slice(-8).toUpperCase()}</span>
              </div>
              <p className="text-app-muted font-medium">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              
              {order.status === 'pending' && (
                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  className="px-5 py-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all text-xs font-bold uppercase tracking-widest border border-slate-100"
                >
                  Cancel Order
                </button>
              )}
              
              {order.status === 'delivered' && order.returnStatus === 'none' && (
                <button
                  onClick={() => setIsReturnModalOpen(true)}
                  className="px-5 py-2 bg-primary text-white rounded-xl hover:brightness-110 transition-all text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <RefreshCcw size={14} />
                  Request Return
                </button>
              )}

              {order.returnStatus && order.returnStatus !== 'none' && (
                  <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold uppercase tracking-widest border border-amber-100 flex items-center gap-2">
                      <RefreshCcw size={14} />
                      Return {order.returnStatus}
                  </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4 text-slate-400">
                      <User size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Customer Details</span>
                  </div>
                  <p className="font-bold text-slate-900">{order.user?.name || 'Customer'}</p>
                  <p className="text-sm text-app-muted">{order.user?.email || 'N/A'}</p>
              </div>

              <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3 mb-4 text-slate-400">
                      <CreditCard size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Payment Summary</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 tracking-tighter">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-app-muted">Total including taxes</p>
              </div>
          </div>

          {/* Items Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
                <Package size={18} className="text-slate-400" />
                <h2 className="text-lg font-bold text-slate-900">Order Items</h2>
            </div>
            <div className="space-y-4">
              {order.orderItems.map((item: OrderItem, index: number) => (
                <div key={index} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={item.image || item.product?.images?.[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-900 font-bold">{item.name}</h3>
                    <p className="text-app-muted text-sm font-medium">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-slate-900 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-app-muted">${item.price.toFixed(2)} / item</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
            <span className="text-app-muted font-bold uppercase tracking-widest text-xs">Final Total</span>
            <span className="text-4xl font-bold text-slate-900 tracking-tighter">${order.totalAmount.toFixed(2)}</span>
          </div>
        </motion.div>

        {/* Cancellation Modal */}
        {isCancelModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <motion.div
              className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Cancel Order?</h3>
              <p className="text-app-muted mb-8">This will permanently cancel your order. Are you sure you want to proceed?</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Yes, Cancel
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
