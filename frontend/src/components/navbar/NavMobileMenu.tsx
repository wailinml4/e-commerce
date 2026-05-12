import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../stores/useAuthStore'
import { useCartStore } from '../../stores/useCartStore'
import { useWishlistStore } from '../../stores/useWishlistStore'

interface NavMobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onProfileClick: () => void
}

const NavMobileMenu = ({ isOpen, onClose, onProfileClick }: NavMobileMenuProps) => {
  const { user, logout } = useAuthStore()
  const { cart } = useCartStore()
  const { wishlist } = useWishlistStore()
  const isAdmin = user?.role === 'admin'

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden mt-4 bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-6"
    >
      <div className="flex flex-col gap-4">
        {user && (
          <>
            <Link to="/cart" className="text-gray-700 hover:text-gray-900 transition-colors font-medium" onClick={onClose}>
              Cart {cart.length > 0 && `(${cart.length})`}
            </Link>
            <Link to="/orders" className="text-gray-700 hover:text-gray-900 transition-colors font-medium" onClick={onClose}>
              My Orders
            </Link>
            <Link to="/wishlist" className="text-gray-700 hover:text-gray-900 transition-colors font-medium" onClick={onClose}>
              Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </Link>
            <button
              type="button"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
              onClick={() => {
                onProfileClick?.()
                onClose()
              }}
            >
              Profile
            </button>
          </>
        )}
        {isAdmin && (
          <Link to="/secret-dashboard" className="text-gray-700 hover:text-gray-900 transition-colors font-medium" onClick={onClose}>
            Dashboard
          </Link>
        )}
        {user ? (
          <button
            onClick={() => {
              logout()
              onClose()
            }}
            className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-left"
          >
            Log Out
          </button>
        ) : (
          <>
            <Link to="/signup" className="text-gray-700 hover:text-gray-900 transition-colors font-medium" onClick={onClose}>
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              onClick={onClose}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default NavMobileMenu
