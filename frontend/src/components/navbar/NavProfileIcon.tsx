import { motion } from 'framer-motion'
import { User } from 'lucide-react'

interface NavProfileIconProps {
  delay?: number
  asIcon?: boolean
  onClick?: () => void
}

const NavProfileIcon = ({ delay = 0, asIcon = false, onClick }: NavProfileIconProps) => {
  if (asIcon) {
    return <User size={20} className="text-gray-700 transition-colors group-hover:text-gray-900" />
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <button type="button" onClick={onClick} className="relative group" aria-label="Open profile">
        <User size={20} className="text-gray-700 group-hover:text-gray-900 transition-colors" />
      </button>
    </motion.div>
  )
}

export default NavProfileIcon
