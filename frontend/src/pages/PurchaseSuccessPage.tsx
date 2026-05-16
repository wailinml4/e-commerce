import { ArrowRight, CheckCircle, Package, Calendar, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCartStore } from '../stores/useCartStore'
import { useOrderStore } from '../stores/useOrderStore'
import { checkoutSuccessService } from '../services/payment.service'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true)
  const [orderId, setOrderId] = useState<string | null>(null)
  const { resetCart, getCartItems } = useCartStore()
  const { getMyOrders } = useOrderStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId: string) => {
      try {
        const response = await checkoutSuccessService({ sessionId })
        setOrderId(response.data.data?.orderId || null)
        resetCart()
        await Promise.all([getCartItems(), getMyOrders()])
      } catch (err) {
        const message =
          (err as import('axios').AxiosError<{ message: string }>).response?.data?.message ||
          (err as Error).message ||
          'Failed to process payment confirmation'
        setError(message)
      } finally {
        setIsProcessing(false)
      }
    }

    const sessionId = new URLSearchParams(window.location.search).get('session_id')
    if (sessionId) {
      handleCheckoutSuccess(sessionId)
    } else {
      setIsProcessing(false)
      setError('No session ID found in the URL')
    }
  }, [getCartItems, getMyOrders, resetCart])

  if (isProcessing) return (
      <div className="h-screen bg-app-bg flex flex-col items-center justify-center">
          <LoadingSpinner />
          <p className="mt-8 text-app-muted font-bold animate-pulse tracking-widest uppercase text-xs">Completing Purchase</p>
      </div>
  )

  if (error) return (
    <div className="h-screen bg-app-bg flex flex-col items-center justify-center px-4">
        <div className="bg-white border border-slate-100 p-12 text-center max-w-md rounded-[3rem] shadow-xl">
            <h2 className="text-2xl font-bold text-red-500 mb-4 tracking-tight">Purchase Error</h2>
            <p className="text-app-muted mb-8">{error}</p>
            <Link to="/" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary transition-all">Return Home</Link>
        </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-app-bg overflow-hidden relative">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.05}
        style={{ zIndex: 99 }}
        numberOfPieces={200}
        colors={['#4F46E5', '#0EA5E9', '#F8F9FA']}
        recycle={false}
      />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full bg-white rounded-[3rem] shadow-xl overflow-hidden relative z-10 border border-slate-100"
      >
        <div className="p-8 sm:p-12 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.3 }}
            className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-emerald-500 border border-emerald-100"
          >
            <CheckCircle size={48} />
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tighter leading-tight">
            Purchase <br /> Successful
          </h1>

          <p className="text-app-muted text-lg font-light mb-12">
            Thank you for your order! Your payment has been confirmed and our team is now preparing your products.
          </p>
          
          <div className="space-y-4 mb-12">
              {[
                  { icon: <Package size={18} />, label: "Order ID", value: `#${orderId ? orderId.slice(-8).toUpperCase() : 'PENDING'}` },
                  { icon: <Calendar size={18} />, label: "Estimated Delivery", value: "3-5 Business Days" },
                  { icon: <Mail size={18} />, label: "Confirmation Email", value: "Sent to your inbox" }
              ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 text-app-muted font-medium text-sm">
                          {item.icon}
                          <span>{item.label}</span>
                      </div>
                      <span className="text-slate-900 font-bold text-sm">{item.value}</span>
                  </div>
              ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={'/'}
              className="flex-1 bg-slate-900 hover:bg-primary text-white font-bold py-5 px-8 rounded-2xl transition duration-500 flex items-center justify-center gap-3 shadow-2xl hover:shadow-primary/40 group"
            >
              Continue Shopping
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
            </Link>
            <Link
                to="/order-history"
                className="flex-1 bg-slate-50 text-slate-500 hover:bg-slate-100 font-bold py-5 px-8 rounded-2xl transition duration-500 flex items-center justify-center"
            >
                View Orders
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PurchaseSuccessPage
