import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '../../stores/useCartStore'

const NavCartIcon = ({ delay = 0 }) => {
  const { cart } = useCartStore()
  const itemCount = cart.length

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Link to="/cart" className="relative group" aria-label={`View shopping cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}>
        <ShoppingCart size={20} className="text-gray-700 group-hover:text-gray-900 transition-colors" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </motion.div>
  )
}

export default NavCartIcon
