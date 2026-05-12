import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'

import AnalyticsTab from '../components/admin/AnalyticsTab'
import CreateProductForm from '../components/products/CreateProductForm'
import ProductsList from '../components/products/ProductsList'
import OrderManagement from '../components/orders/OrderManagement'
import ReturnManagement from '../components/returns/ReturnManagement'
import CustomerManagement from '../components/customers/CustomerManagement'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminProfile from '../components/admin/AdminProfile'
import { Menu } from 'lucide-react'

const AdminPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const activeTab = searchParams.get('tab') || 'create'

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId })
    setMobileSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="flex min-h-screen">
        <AdminSidebar
          activeItem={activeTab}
          onChange={handleTabChange}
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <div className="flex-1 min-w-0">
          <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-neutral-800">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-neutral-900 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="font-semibold">Admin Dashboard</div>
            <div className="w-9" />
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <motion.h1
              className="text-3xl font-semibold mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'create' && 'Create Product'}
              {activeTab === 'products' && 'Products'}
              {activeTab === 'orders' && 'Orders'}
              {activeTab === 'returns' && 'Returns'}
              {activeTab === 'analytics' && 'Analytics'}
              {activeTab === 'customers' && 'Customers'}
              {activeTab === 'profile' && 'Profile'}
            </motion.h1>

            {activeTab === 'create' && <CreateProductForm />}
            {activeTab === 'products' && <ProductsList />}
            {activeTab === 'orders' && <OrderManagement />}
            {activeTab === 'returns' && <ReturnManagement />}
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'customers' && <CustomerManagement />}
            {activeTab === 'profile' && <AdminProfile />}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminPage
