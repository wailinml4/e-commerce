import { Outlet } from 'react-router-dom'
import AdminSidebar from '../admin/AdminSidebar'
import { Menu } from 'lucide-react'
import { useState } from 'react'

const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="flex min-h-screen">
        <AdminSidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

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
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
