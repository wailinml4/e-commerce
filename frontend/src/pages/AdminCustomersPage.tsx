import { motion } from 'framer-motion'
import CustomerManagement from '../components/customers/CustomerManagement'

const AdminCustomersPage = () => {
  return (
    <div>
      <motion.h1
        className="text-3xl font-semibold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Customers
      </motion.h1>
      <CustomerManagement />
    </div>
  )
}

export default AdminCustomersPage
