import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const NavWishlistIcon = ({ delay = 0 }) => {

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Link to="/wishlist" className="relative group" aria-label="View wishlist">
        <Heart size={20} className="text-gray-700 group-hover:text-gray-900 transition-colors" />
      </Link>
    </motion.div>
  )
}

export default NavWishlistIcon
