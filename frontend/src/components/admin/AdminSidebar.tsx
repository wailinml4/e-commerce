import { LayoutDashboard, LogOut, Package, RotateCcw, ShoppingBasket, User, Users, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/useAuthStore'
import { useState } from 'react'
import ProfileModal from '../shared/ProfileModal'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: ShoppingBasket },
  { path: '/admin/orders', label: 'Orders', icon: Package },
  { path: '/admin/returns', label: 'Returns', icon: RotateCcw },
  { path: '/admin/customers', label: 'Customers', icon: Users },
]

interface AdminSidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

const AdminSidebar = ({ mobileOpen, onClose }: AdminSidebarProps) => {
  const { logout } = useAuthStore()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const location = useLocation()

  const SidebarContent = (
    <div className="h-full flex flex-col bg-[#0A0A0B] text-white/70 border-r border-white/5 relative">
      {/* Branding */}
      <div className="px-8 py-8 flex items-center gap-3 shrink-0 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <LayoutDashboard size={18} />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                isActive ? 'bg-white/5 text-white' : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-5 bg-primary rounded-full"
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  />
              )}
              <Icon size={18} className={`${isActive ? 'text-primary' : 'text-white/30 group-hover:text-white'} transition-colors`} />
              <span className={`text-sm font-medium ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 space-y-1 border-t border-white/5">
        <button
          type="button"
          onClick={() => {
            setIsProfileModalOpen(true)
            if (onClose) onClose()
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all"
        >
          <User size={18} />
          <span>Profile</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:bg-red-500/5 hover:text-red-400 transition-all"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden md:block w-64 h-full shrink-0">{SidebarContent}</div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-64"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {SidebarContent}
              <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 text-white/40" aria-label="Close sidebar">
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} variant="admin" />
    </>
  )
}

export default AdminSidebar
