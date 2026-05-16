import { motion } from 'framer-motion'
import { useCartStore } from '../../stores/useCartStore'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, CreditCard } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import axiosInstance from '../../config/axiosInstance'
import env from '../../config/env.js'

const stripePromise = loadStripe(env.VITE_STRIPE_PUBLISHABLE_KEY)

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart, isLoading } = useCartStore()

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
    
    try {
      const res = await axiosInstance.post('/payments/create-checkout-session', {
        products: checkoutProducts,
        couponCode: coupon ? coupon.code : null,
      })

      const session = res.data.data
      if (session.url) {
        window.location.href = session.url
        return
      }

      const stripe = await stripePromise
      if (!stripe) return
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        console.error('Stripe Error:', result.error)
      }
    } catch (error) {
      console.error('Checkout Error:', error)
    }
  }

  return (
    <motion.div
      className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <CreditCard size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Order Summary</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-app-muted font-medium">Subtotal</span>
            <span className="text-slate-900 font-bold">${formattedSubtotal}</span>
          </div>

          {savings > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-app-muted font-medium">Savings</span>
              <span className="text-green-600 font-bold">-${formattedSavings}</span>
            </div>
          )}

          {coupon && isCouponApplied && (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                  <span className="text-app-muted font-medium">Coupon Applied</span>
                  <span className="text-[10px] font-bold uppercase text-primary tracking-widest">{coupon.code}</span>
              </div>
              <span className="text-primary font-bold">-{coupon.discountPercentage}%</span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <span className="text-lg font-bold text-slate-900 uppercase tracking-widest text-[10px]">Total Amount</span>
            <span className="text-3xl font-bold text-slate-900 tracking-tighter">${formattedTotal}</span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
            <motion.button
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 text-lg font-bold text-white hover:bg-primary transition-all duration-500 shadow-2xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isLoading || cart.length === 0}
            >
              Checkout
              <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
            </motion.button>

            <Link
              to="/"
              className="flex w-full items-center justify-center gap-2 text-sm font-bold text-app-muted hover:text-slate-900 transition-colors"
            >
              Continue Shopping
            </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted opacity-60">
                <ShieldCheck size={16} />
                <span>Secure Checkout</span>
            </div>
        </div>
      </div>
    </motion.div>
  )
}

export default OrderSummary
