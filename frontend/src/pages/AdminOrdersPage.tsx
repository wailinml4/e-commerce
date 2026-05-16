import { motion } from 'framer-motion'
import OrderManagement from '../components/orders/OrderManagement'

const AdminOrdersPage = () => {
  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div>
          <h1 className="text-3xl font-bold tracking-tight text-white/90">Orders</h1>
          <p className="text-sm text-white/40 mt-1">Monitor and manage customer order fulfillment.</p>
      </div>

      {/* Main Content Area */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-2xl"
      >
          <OrderManagement />
      </motion.div>
    </div>
  )
}

export default AdminOrdersPage
