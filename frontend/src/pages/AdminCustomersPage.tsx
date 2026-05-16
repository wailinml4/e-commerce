import { motion } from 'framer-motion'
import CustomerManagement from '../components/customers/CustomerManagement'

const AdminCustomersPage = () => {
  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90">Customers</h1>
          <p className="text-sm text-white/40 mt-1">Manage and monitor customer accounts and order history.</p>
      </div>

      {/* Main Content Area */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-2xl"
      >
          <CustomerManagement />
      </motion.div>
    </div>
  )
}

export default AdminCustomersPage
