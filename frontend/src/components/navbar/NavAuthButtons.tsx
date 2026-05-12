import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../stores/useAuthStore'

const NavAuthButtons = ({ delay = 0 }) => {
  const { user, logout } = useAuthStore()

  if (user) {
    return (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
        <button onClick={logout} className="text-gray-700 hover:text-gray-900 transition-colors font-medium" aria-label="Log out">
          Log Out
        </button>
      </motion.div>
    )
  }

  return (
    <div className="hidden md:flex items-center gap-3">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
        <Link to="/signup" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
          Sign Up
        </Link>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay + 0.1 }}>
        <Link to="/login" className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
          Login
        </Link>
      </motion.div>
    </div>
  )
}

export default NavAuthButtons
