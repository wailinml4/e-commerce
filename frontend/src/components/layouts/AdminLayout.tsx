import { Outlet } from 'react-router-dom'
import AdminSidebar from '../admin/AdminSidebar'
import { Menu } from 'lucide-react'
import { useState } from 'react'

const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-primary/30 relative">
      {/* Subtle Background Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-50" />
      </div>

      <div className="flex h-screen relative z-10">
        <AdminSidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Clean Header Bar */}
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

          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
             <div className="max-w-7xl mx-auto">
                <Outlet />
             </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
