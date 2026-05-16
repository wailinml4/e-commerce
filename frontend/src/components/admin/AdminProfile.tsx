import { motion } from 'framer-motion'
import { Mail, Shield, User } from 'lucide-react'
import { useAuthStore } from '../../stores/useAuthStore'

const AdminProfile = () => {
  const { user } = useAuthStore()

  return (
    <motion.div
      className="bg-white/[0.02] border border-white/5 p-10 rounded-3xl shadow-2xl max-w-2xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <User size={32} className="text-primary" />
          </div>
          <div>
              <h2 className="text-2xl font-bold text-white">Admin Profile</h2>
              <p className="text-sm text-white/40 font-medium">Manage your administrative identity.</p>
          </div>
      </div>

      <div className="space-y-6">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-colors">
          <div className="p-3 rounded-xl bg-white/5 text-white/40 group-hover:text-white transition-colors">
              <User size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Full Name</div>
            <div className="text-base font-semibold text-white/90">{user?.name || '-'}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-colors">
          <div className="p-3 rounded-xl bg-white/5 text-white/40 group-hover:text-white transition-colors">
              <Mail size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Email Address</div>
            <div className="text-base font-semibold text-white/90">{user?.email || '-'}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group hover:bg-white/10 transition-colors">
          <div className="p-3 rounded-xl bg-white/5 text-white/40 group-hover:text-white transition-colors">
              <Shield size={20} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Account Role</div>
            <div className="text-base font-semibold text-white/90 flex items-center gap-2 capitalize">
                {user?.role || '-'}
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminProfile
