import { motion } from 'framer-motion'
import ReturnManagement from '../components/returns/ReturnManagement'

const AdminReturnsPage = () => {
  return (
    <div>
      <motion.h1
        className="text-3xl font-semibold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Returns
      </motion.h1>
      <ReturnManagement />
    </div>
  )
}

export default AdminReturnsPage
