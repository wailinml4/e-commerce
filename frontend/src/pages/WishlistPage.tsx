import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
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
    <div className="px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-light flex items-center">
              <Heart className="mr-3 text-gray-400" size={32} />
              My Wishlist
            </h1>
            <span className="text-gray-500">{wishlist.length} items</span>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="mx-auto mb-4 text-gray-300" size={64} />
              <h2 className="text-2xl font-light text-gray-400 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-6">Start adding products you love!</p>
              <Link
                to="/"
                className="inline-block bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-full font-medium transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map(item => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={item.product as unknown as Product} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default WishlistPage
