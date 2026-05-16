import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'
import { useWishlistStore } from '../stores/useWishlistStore'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import ProductCard from '../components/products/ProductCard'
import type { Product } from '../types'

const WishlistPage = () => {
  const { wishlist, isLoading, getWishlist } = useWishlistStore()

  useEffect(() => {
    getWishlist()
  }, [getWishlist])

  if (isLoading) {
    return <LoadingSpinner variant="products" />
  }

  return (
    <div className="min-h-screen bg-app-bg pt-12 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          {/* Header */}
          <div className="mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter text-slate-900 flex items-center justify-center md:justify-start gap-4">
                  My <span className="text-primary italic font-light">Wishlist</span>
                </h1>
                <p className="text-app-muted text-lg font-light max-w-xl">
                  Keep track of the products you love and want to shop later.
                </p>
            </div>
            
            <div className="px-8 py-4 bg-white rounded-[2rem] border border-slate-100 shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Heart size={24} className="fill-primary" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-slate-900 leading-none">{wishlist.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-app-muted">Saved Items</p>
                </div>
            </div>
          </div>

          {wishlist.length === 0 ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2" />
              
              <div className="relative z-10">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                    <Heart className="text-slate-200" size={48} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight uppercase">Your Wishlist is Empty</h2>
                  <p className="text-app-muted mb-10 max-w-sm mx-auto text-lg font-light">You haven't saved any products yet. Explore our shop and add your favorites here!</p>
                  <Link
                    to="/"
                    className="group bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary transition-all duration-500 inline-flex items-center gap-3 shadow-2xl hover:shadow-primary/40"
                  >
                    Start Shopping
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" size={22} />
                  </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence>
                {wishlist.map(item => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative"
                  >
                    <ProductCard product={item.product as unknown as Product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default WishlistPage
