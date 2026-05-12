import { motion } from 'framer-motion'
import { Mail, Shield, User } from 'lucide-react'
import { useAuthStore } from '../../stores/useAuthStore'

const AdminProfile = () => {
  const { user } = useAuthStore()

  return (
    <motion.div
      className="bg-neutral-950 shadow-lg rounded-lg p-8 max-w-2xl border border-neutral-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-semibold text-white mb-6">Profile</h2>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-200">
          <User className="h-5 w-5 text-gray-400" />
          <div>
            <div className="text-sm text-gray-400">Name</div>
            <div className="font-medium text-white">{user?.name || '-'}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-200">
          <Mail className="h-5 w-5 text-gray-400" />
          <div>
            <div className="text-sm text-gray-400">Email</div>
            <div className="font-medium text-white">{user?.email || '-'}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-200">
          <Shield className="h-5 w-5 text-gray-400" />
          <div>
            <div className="text-sm text-gray-400">Role</div>
            <div className="font-medium text-white">{user?.role || '-'}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminProfile
