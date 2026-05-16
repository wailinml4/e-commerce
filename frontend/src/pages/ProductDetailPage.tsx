import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProductByIdService } from '../services/product.service'
import { useCartStore } from '../stores/useCartStore'
import { useAuthStore } from '../stores/useAuthStore'
import { ShoppingCart, ArrowLeft, ShieldCheck, Zap, RefreshCcw, Star, ChevronRight } from 'lucide-react'
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
      window.scrollTo(0, 0)
      try {
        const response = await getProductByIdService(id!)
        setProduct(response.data.data)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product details')
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
      <div className="min-h-screen flex items-center justify-center bg-app-bg text-slate-900">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-200 mb-6 uppercase tracking-tight">Product Not Found</h2>
          <Link to="/" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary transition-all inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Return to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg pt-12 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center text-app-muted hover:text-slate-900 mb-12 transition-all group font-bold uppercase tracking-widest text-xs">
          <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Image Gallery Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-xl bg-white border border-slate-100 group">
              <motion.img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                  <span className="px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-sm text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    {capitalizeCategory(product.category)}
                  </span>
                  <span className="px-5 py-2 rounded-full bg-slate-900/10 backdrop-blur-md border border-white/20 shadow-sm text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">
                    Premium Quality
                  </span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square rounded-2xl bg-white border border-slate-100 shadow-sm opacity-50 hover:opacity-100 transition-opacity cursor-pointer overflow-hidden">
                         <img src={product.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                    </div>
                ))}
            </div>
          </motion.div>

          {/* Product Info Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-5 space-y-10"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                 <Star size={16} className="fill-primary" />
                 <span>Top Rated Product</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[1.1]">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                  <p className="text-4xl font-bold text-slate-900 tracking-tighter">${product.price.toFixed(2)}</p>
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-lg uppercase tracking-wider">In Stock</span>
              </div>
            </div>

            <p className="text-app-muted text-xl font-light leading-relaxed">
              {product.description}
            </p>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-[2] bg-slate-900 text-white py-6 px-10 rounded-[2rem] font-bold text-xl hover:bg-primary transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl hover:shadow-primary/40 active:scale-95"
              >
                <ShoppingCart size={24} />
                <span>Add to Cart</span>
              </button>
              <button className="flex-1 bg-slate-50 text-slate-500 rounded-[2rem] font-bold hover:bg-slate-100 transition-all">
                 Compare
              </button>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    { icon: <ShieldCheck size={20} className="text-primary" />, title: "Secure Checkout", desc: "Encrypted payments" },
                    { icon: <Zap size={20} className="text-orange-500" />, title: "Fast Delivery", desc: "Ships within 24 hours" },
                    { icon: <RefreshCcw size={20} className="text-slate-400" />, title: "Easy Returns", desc: "30-day trial period" }
                ].map((f, i) => (
                    <div key={i} className="p-5 rounded-3xl bg-white border border-slate-100 flex items-center gap-4 shadow-sm group hover:shadow-md transition-all">
                        <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-primary/5 transition-colors">{f.icon}</div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{f.title}</p>
                            <p className="text-xs text-app-muted">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-900 mb-6">Product Specifications</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-200/50">
                  <span className="text-app-muted font-medium">Category</span>
                  <span className="text-slate-900 font-bold">{capitalizeCategory(product.category)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200/50">
                  <span className="text-app-muted font-medium">Price</span>
                  <span className="text-slate-900 font-bold">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-app-muted font-medium">Product ID</span>
                  <span className="text-slate-900 font-bold opacity-50 text-xs tracking-widest uppercase">{product.id.substring(0, 8)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-32">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">You May Also Like</h2>
                <Link to="/" className="text-sm font-bold text-primary flex items-center gap-2 hover:underline">
                    View More <ChevronRight size={16} />
                </Link>
            </div>
            <RelatedProducts productId={id!} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
