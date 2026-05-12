import { ArrowRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCartStore } from '../stores/useCartStore'
import { useOrderStore } from '../stores/useOrderStore'
import { checkoutSuccessService } from '../services/payment.service'
import Confetti from 'react-confetti'

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

  if (isProcessing) return 'Processing...'

  if (error) return `Error: ${error}`

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-white">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      <div className="max-w-md w-full bg-gray-50 rounded-2xl shadow-lg overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="text-gray-900 w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-center text-gray-900 mb-2">Purchase Successful!</h1>

          <p className="text-gray-600 text-center mb-2">Thank you for your order. We're processing it now.</p>
          <p className="text-gray-900 text-center text-sm mb-6">Check your email for order details and updates.</p>
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Order number</span>
              <span className="text-sm font-medium text-gray-900">#{orderId ? orderId.slice(-8) : 'Pending'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Estimated delivery</span>
              <span className="text-sm font-medium text-gray-900">3-5 business days</span>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to={'/'}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PurchaseSuccessPage
