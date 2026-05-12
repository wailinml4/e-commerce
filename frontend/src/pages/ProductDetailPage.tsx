import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProductByIdService } from '../services/product.service'
import { useCartStore } from '../stores/useCartStore'
import { useAuthStore } from '../stores/useAuthStore'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import RelatedProducts from '../components/products/RelatedProducts'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import type { Product } from '../types'
import { LOGIN_TOAST_MESSAGE } from '../constants'
import { capitalizeCategory } from '../constants/categories'

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCartStore()
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductByIdService(id!)
        setProduct(response.data.data)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!user) {
      toast.error(LOGIN_TOAST_MESSAGE, { id: 'login' })
      return
    }

    if (product) {
      addToCart(product, 1)
    }
  }

  if (loading) {
    return <LoadingSpinner variant="detail" />
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-400 mb-4">Product not found</h2>
          <Link to="/" className="text-gray-900 hover:text-gray-700">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="mr-2" size={20} />
          Back to Products
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <div className="w-full h-full min-h-96 rounded-2xl shadow-lg overflow-hidden bg-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-light mb-2">{product.name}</h1>
              <p className="text-3xl font-medium text-gray-900">${product.price.toFixed(2)}</p>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-4 px-8 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-medium">Product Details</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="text-gray-900">{capitalizeCategory(product.category)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="text-gray-900">${product.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <RelatedProducts productId={id!} />
      </div>
    </div>
  )
}

export default ProductDetailPage
