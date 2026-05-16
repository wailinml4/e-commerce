import { motion, AnimatePresence } from 'framer-motion'
import { User, Eye, Trash2, Shield } from 'lucide-react'
import StatusBadge from '../shared/StatusBadge'
import type { User as UserType } from '../../types'

interface CustomerTableProps {
  users: UserType[]
  onViewOrders: (user: UserType) => void
  onDelete: (userId: string) => void
  formatDate: (date: string) => string
}

const CustomerTable = ({ users, onViewOrders, onDelete, formatDate }: CustomerTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/5">
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Customer</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Email Address</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Role</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Joined Date</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {users.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group hover:bg-white/[0.03] transition-colors"
              >
                {/* Customer Info */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <User size={16} className="text-white/40" />
                    </div>
                    <div className="text-sm font-semibold text-white/90">{user.name}</div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-5">
                  <span className="text-sm text-white/50">{user.email}</span>
                </td>

                {/* Role */}
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                       <StatusBadge status={user.role} type="role" variant="spatial" />
                       {user.role === 'admin' && <Shield size={14} className="text-primary" />}
                   </div>
                </td>

                {/* Joined Date */}
                <td className="px-6 py-5">
                  <span className="text-sm text-white/40 font-medium">
                    {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewOrders(user)}
                      className="p-2 rounded-xl bg-white/5 text-white/40 hover:bg-primary/10 hover:text-primary transition-all border border-white/5"
                      title="View Orders"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2 rounded-xl bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all border border-white/5"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

export default CustomerTable
