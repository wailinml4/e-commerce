import { Link } from 'react-router-dom'
import { useCartStore } from '../stores/useCartStore'
import { motion } from 'framer-motion'
import { ShoppingCart, Trash2 } from 'lucide-react'
import CartItem from '../components/cart/CartItem'
import PeopleAlsoBought from '../components/shop/PeopleAlsoBought'
import OrderSummary from '../components/orders/OrderSummary'
import GiftCouponCard from '../components/cart/GiftCouponCard'

const CartPage = () => {
  const { cart, clearCart, isLoading } = useCartStore()

  return (
    <div className="px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {cart.length === 0 ? (
          <EmptyCartUI />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">Items</h2>
                <button
                  type="button"
                  onClick={clearCart}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  Clear Cart
                </button>
              </div>
              
              <div className="space-y-4">
                {cart.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              {cart.length > 0 && <PeopleAlsoBought productId={cart[0]?.id} />}
            </div>

            <div className="lg:col-span-1">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <OrderSummary />
                <GiftCouponCard />
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default CartPage

const EmptyCartUI = () => (
  <motion.div
    className="flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200 p-12 py-16"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <ShoppingCart className="h-24 w-24 text-gray-300 mb-6" />
    <h3 className="text-2xl font-light text-gray-900 mb-3">Your cart is empty</h3>
    <p className="text-gray-600 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet.</p>
    <Link className="inline-flex items-center rounded-full bg-gray-900 px-6 py-3 text-white font-medium transition-colors hover:bg-gray-800" to="/">
      Start Shopping
    </Link>
  </motion.div>
)
