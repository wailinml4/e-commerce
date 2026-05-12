import { LayoutDashboard, LogOut, Package, RotateCcw, ShoppingBasket, User, Users, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from 'react-router-dom'
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
  activeItem?: string
  onChange?: (tabId: string) => void
}
const AdminSidebar = ({ mobileOpen, onClose, activeItem: _activeItem, onChange: _onChange }: AdminSidebarProps) => {
  const { logout } = useAuthStore()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const handleNavClick = () => {
    if (onClose) onClose()
  }

  const SidebarContent = (
    <div className="h-full flex flex-col bg-black text-gray-100 border-r border-neutral-800">
      <div className="px-5 py-5 border-b border-neutral-800 flex items-center justify-between">
        <NavLink to="/admin" className="font-semibold tracking-wide hover:text-white">
          Admin
        </NavLink>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 rounded-lg hover:bg-neutral-900 transition-colors" aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-neutral-900 text-white' : 'text-gray-300 hover:bg-neutral-900 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="space-y-1 p-3 border-t border-neutral-800">
        <button
          type="button"
          onClick={() => {
            setIsProfileModalOpen(true)
            if (onClose) onClose()
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-neutral-900 hover:text-white transition-colors"
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-neutral-900 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden md:block w-64 h-full">{SidebarContent}</div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-72"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {SidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} variant="admin" />
    </>
  )
}

export default AdminSidebar
