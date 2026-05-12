import { motion } from 'framer-motion'
import { useCartStore } from '../../stores/useCartStore'
import { Link } from 'react-router-dom'
import { MoveRight } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import axiosInstance from '../../config/axiosInstance'
import env from '../../config/env.js'

const stripePromise = loadStripe(env.VITE_STRIPE_PUBLISHABLE_KEY)

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore()

  const savings = subtotal - total
  const formattedSubtotal = subtotal.toFixed(2)
  const formattedTotal = total.toFixed(2)
  const formattedSavings = savings.toFixed(2)

  const handlePayment = async () => {
    const checkoutProducts = cart.map(item => ({
      id: item.id,
      name: item.name,
      image: item.images?.[0] || item.image,
      price: Number(item.price),
      quantity: item.quantity
    }))
    
    const res = await axiosInstance.post('/payments/create-checkout-session', {
      products: checkoutProducts,
      couponCode: coupon ? coupon.code : null,
    })

    const session = res.data.data
    if (session.url) {
      try {
        window.location.href = session.url
      } catch (error) {
        console.error('Redirect error:', error)
        // Fallback: manually redirect using Link component
        window.location.pathname = '/purchase-success'
        window.location.search = `?session_id=${session.id}`
      }
      return
    }

    const stripe = await stripePromise
    if (!stripe) return
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    })

    if (result.error) {
      console.error('Error:', result.error)
    }
  }

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <p className="text-xl font-semibold text-gray-900">Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-600">Original price</dt>
            <dd className="text-base font-medium text-gray-900">${formattedSubtotal}</dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-600">Savings</dt>
              <dd className="text-base font-medium text-gray-900">-${formattedSavings}</dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-600">Coupon ({coupon.code})</dt>
              <dd className="text-base font-medium text-gray-900">-{coupon.discountPercentage}%</dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-300 pt-2">
            <dt className="text-base font-bold text-gray-900">Total</dt>
            <dd className="text-base font-bold text-gray-900">${formattedTotal}</dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-900">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 underline hover:text-gray-600 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
export default OrderSummary
