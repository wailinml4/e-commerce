import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useAuthStore } from '../../stores/useAuthStore'

const NavDashboardLink = ({ delay = 0 }) => {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  if (!isAdmin) return null

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Link
        to="/secret-dashboard"
        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        aria-label="Admin dashboard"
      >
        <Lock size={16} />
        <span>Dashboard</span>
      </Link>
    </motion.div>
  )
}

export default NavDashboardLink
