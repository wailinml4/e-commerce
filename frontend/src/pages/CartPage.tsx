import { Link } from 'react-router-dom'
import { useCartStore } from '../stores/useCartStore'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Trash2, ArrowRight, Sparkles } from 'lucide-react'
import CartItem from '../components/cart/CartItem'
import PeopleAlsoBought from '../components/shop/PeopleAlsoBought'
import OrderSummary from '../components/orders/OrderSummary'
import GiftCouponCard from '../components/cart/GiftCouponCard'

const CartPage = () => {
  const { cart, clearCart, isLoading } = useCartStore()

  return (
    <div className="min-h-screen bg-app-bg pt-12 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
            <motion.h1
              className="text-4xl md:text-6xl font-black mb-2 tracking-tighter text-slate-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Your <span className="text-primary italic font-light">Cart</span>
            </motion.h1>
            <p className="text-app-muted font-medium flex items-center gap-2">
                You have <span className="text-slate-900 font-bold">{cart.length} items</span> in your shopping cart.
            </p>
        </div>

        {cart.length === 0 ? (
          <EmptyCartUI />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Cart Items</h2>
                <button
                  type="button"
                  onClick={clearCart}
                  disabled={isLoading}
                  className="group flex items-center gap-2 text-app-muted hover:text-red-500 transition-colors font-bold text-sm"
                >
                  <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
                  Clear Cart
                </button>
              </div>
              
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                    {cart.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <CartItem item={item} />
                    </motion.div>
                    ))}
                </AnimatePresence>
              </div>
              
              <div className="mt-16">
                  <div className="flex items-center gap-3 mb-8">
                      <div className="h-px flex-1 bg-slate-100" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-app-muted">You May Also Like</span>
                      <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  {cart.length > 0 && <PeopleAlsoBought productId={cart[0]?.id} />}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <OrderSummary />
                <GiftCouponCard />
                
                {/* Trust Badge */}
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm border border-slate-100">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Quality Guarantee</p>
                        <p className="text-xs text-app-muted">Secured transactions & lifetime support.</p>
                    </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const EmptyCartUI = () => (
  <motion.div
    className="flex flex-col items-center justify-center bg-white rounded-[3rem] border border-slate-100 p-12 py-24 shadow-sm"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100">
        <ShoppingCart className="h-16 w-16 text-slate-200" />
    </div>
    <h3 className="text-4xl font-bold text-slate-900 mb-4 tracking-tighter">Your cart is empty</h3>
    <p className="text-app-muted mb-10 text-center max-w-sm text-lg font-light">It seems you haven't added any products to your cart yet.</p>
    <Link 
        className="group bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary transition-all duration-500 flex items-center gap-3 shadow-2xl hover:shadow-primary/40" 
        to="/"
    >
      Start Shopping
      <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
    </Link>
  </motion.div>
)

export default CartPage
