import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

interface NavMobileMenuButtonProps {
  isOpen: boolean
  onClick: () => void
}

const NavMobileMenuButton = ({ isOpen, onClick }: NavMobileMenuButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isOpen}
    >
      {isOpen ? <X size={20} /> : <Menu size={20} />}
    </motion.button>
  )
}

export default NavMobileMenuButton
