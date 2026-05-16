import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOrderStore } from '../stores/useOrderStore'
import { useNavigate, Link } from 'react-router-dom'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { X, Package, Clock, CheckCircle, Truck, AlertCircle, ChevronRight, Ban } from 'lucide-react'

const OrderHistoryPage = () => {
  const { myOrders, getMyOrders, isLoading, cancelOrder } = useOrderStore()
  const navigate = useNavigate()
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)

  useEffect(() => {
    getMyOrders()
  }, [getMyOrders])

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'text-amber-500 bg-amber-50 border-amber-100', icon: <Clock size={14} /> }
      case 'processing':
        return { color: 'text-indigo-500 bg-indigo-50 border-indigo-100', icon: <Package size={14} /> }
      case 'shipped':
        return { color: 'text-cyan-500 bg-cyan-50 border-cyan-100', icon: <Truck size={14} /> }
      case 'delivered':
        return { color: 'text-emerald-500 bg-emerald-50 border-emerald-100', icon: <CheckCircle size={14} /> }
      case 'cancelled':
        return { color: 'text-slate-400 bg-slate-50 border-slate-100', icon: <Ban size={14} /> }
      default:
        return { color: 'text-slate-500 bg-slate-50 border-slate-100', icon: <AlertCircle size={14} /> }
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
    <div className="min-h-screen bg-app-bg pt-12 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-16">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter text-slate-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Order <span className="text-primary italic font-light">History</span>
            </motion.h1>
            <p className="text-app-muted font-medium flex items-center gap-2">
                Manage and track your recent orders.
            </p>
        </div>

        {myOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <Package className="mx-auto mb-6 text-slate-100" size={80} />
            <h2 className="text-3xl font-bold text-slate-900 mb-2">No Orders Found</h2>
            <p className="text-app-muted mb-10 max-w-xs mx-auto">You haven't placed any orders yet. Start shopping to see your history here.</p>
            <Link to="/" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary transition-all shadow-xl">
                Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {myOrders.map((order, index) => {
              const status = getStatusConfig(order.status)
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border ${status.color}`}>
                                {status.icon}
                                {order.status}
                            </span>
                            <span className="text-app-muted text-xs font-bold uppercase tracking-widest opacity-50">#{order.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Order Details</h3>
                        <p className="text-app-muted text-sm font-medium">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>

                    <div className="flex flex-col md:items-end gap-4">
                        <div className="text-left md:text-right">
                            <p className="text-3xl font-bold text-slate-900 tracking-tighter">${order.totalAmount.toFixed(2)}</p>
                            <p className="text-xs text-app-muted font-bold uppercase tracking-widest">{order.orderItems.length} Items</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {order.status === 'pending' && (
                              <button
                                onClick={e => {
                                  e.stopPropagation()
                                  handleCancelClick(order.id)
                                }}
                                className="text-xs font-bold uppercase tracking-widest text-app-muted hover:text-red-500 transition-colors"
                              >
                                Cancel Order
                              </button>
                            )}
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {cancelOrderId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-red-100">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tighter">Cancel Order</h3>
              <p className="text-app-muted text-lg font-light mb-10">Are you sure you want to cancel this order? This action cannot be undone.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCancelCancel}
                  className="px-6 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-6 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrderHistoryPage
