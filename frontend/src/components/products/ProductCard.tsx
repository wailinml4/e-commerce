import toast from 'react-hot-toast'
import { Heart, ShoppingCart } from 'lucide-react'
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
    <div className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white">
      <Link to={`/product/${product.id}`} className="relative flex aspect-square overflow-hidden rounded-2xl bg-gray-50">
        <img
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          src={product.images?.[0] || product.image}
          alt={product.name}
        />
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 bg-white/90 text-gray-900 p-2.5 rounded-full shadow-sm z-10"
          aria-label="Toggle wishlist"
        >
          <Heart size={18} className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
        </button>
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black px-3 py-2 text-xs font-medium text-white opacity-100 shadow-sm transition-all duration-200 hover:bg-gray-800 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart size={16} />
          Quick Add
        </button>
      </Link>

      <div className="pt-4 px-1">
        <div className="flex items-center justify-between">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          </Link>
          <p className="text-sm text-gray-600">${Number(product.price).toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
export default ProductCard
