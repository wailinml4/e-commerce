import toast from 'react-hot-toast'
import { Heart, Plus, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../stores/useAuthStore'
import { useCartStore } from '../../stores/useCartStore'
import { useWishlistStore } from '../../stores/useWishlistStore'
import { LOGIN_TOAST_MESSAGE } from '../../constants'
import { Link } from 'react-router-dom'
import type { Product } from '../../types'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuthStore()
  const { addToCart } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error(LOGIN_TOAST_MESSAGE, { id: 'login' })
      return
    }
    addToCart(product, 1)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error(LOGIN_TOAST_MESSAGE, { id: 'login' })
      return
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product.id)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -12 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-spatial hover:shadow-spatial-lg transition-all duration-700"
    >
      {/* Full Bleed Image */}
      <Link to={`/product/${product.id}`} className="absolute inset-0 block">
        <motion.img
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          src={product.images?.[0] || product.image}
          alt={product.name}
        />
        
        {/* Dynamic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </Link>

      {/* Floating Badges (Wishlist) */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleToggleWishlist}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-red-500 transition-all duration-500 shadow-xl"
        >
          <Heart 
            size={20} 
            className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''} 
          />
        </button>
      </div>

      {/* Category Tag */}
      <div className="absolute top-7 left-7 z-20">
        <span className="px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-lg border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
          {product.category || 'Featured'}
        </span>
      </div>

      {/* Immersive Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-8 pt-20">
        <div className="flex flex-col gap-4 transform group-hover:-translate-y-2 transition-transform duration-500">
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1">
              <Link to={`/product/${product.id}`}>
                <h3 className="text-2xl font-bold text-white tracking-tight leading-tight group-hover:text-primary transition-colors mb-1">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
                <span>In Stock</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Original</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="text-2xl font-black text-white tracking-tighter">
                  ${Number(product.price).toFixed(2)}
                </p>
            </div>
          </div>

          {/* Action Row reveal on hover */}
          <div className="flex items-center gap-3 h-0 opacity-0 group-hover:h-14 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
            <button
              onClick={handleAddToCart}
              className="flex-1 h-full flex items-center justify-center gap-2 bg-white text-black rounded-2xl font-black text-sm hover:bg-primary hover:text-white transition-all duration-300 shadow-xl"
            >
              <Plus size={18} />
              Quick Add
            </button>
            <Link
              to={`/product/${product.id}`}
              className="h-full aspect-square flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl hover:bg-white hover:text-black transition-all duration-300"
            >
              <ArrowUpRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
