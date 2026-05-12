import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

interface NavSearchButtonProps {
  onClick: () => void
}

const NavSearchButton = ({ onClick }: NavSearchButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
      aria-label="Open search"
    >
      <Search size={20} />
    </motion.button>
  )
}

export default NavSearchButton
