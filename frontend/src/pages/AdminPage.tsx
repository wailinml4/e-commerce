import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [searchParams] = useSearchParams()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const activeTab = searchParams.get('tab') || 'analytics'

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-primary/30 relative">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-50" />
      </div>

      <div className="flex h-screen relative z-10">
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header Bar */}
          <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <h1 className="text-lg font-semibold tracking-tight text-white/90">Admin Dashboard</h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-medium text-white/40 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>System Online</span>
                </div>
            </div>
          </header>

          {/* Main Dashboard Area */}
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold tracking-tight mb-1 capitalize">
                             {activeTab}
                        </h2>
                        <p className="text-white/40 text-sm font-medium">Manage and monitor your store settings and data.</p>
                    </div>

                    <div className="pb-20">
                        {activeTab === 'create' && <CreateProductForm />}
                        {activeTab === 'products' && <ProductsList />}
                        {activeTab === 'orders' && <OrderManagement />}
                        {activeTab === 'returns' && <ReturnManagement />}
                        {activeTab === 'analytics' && <AnalyticsTab />}
                        {activeTab === 'customers' && <CustomerManagement />}
                        {activeTab === 'profile' && <AdminProfile />}
                    </div>
                </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
