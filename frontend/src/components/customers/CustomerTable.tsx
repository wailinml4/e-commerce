import { motion } from 'framer-motion'
import { Shield, User, Eye, Trash2 } from 'lucide-react'
import { ANIMATION_DURATION, ROLE_COLORS } from '../../constants'
import type { User as UserType } from '../../types'

interface CustomerTableProps {
  users: UserType[]
  onViewOrders: (user: UserType) => void
  onDelete: (userId: string) => void
  formatDate: (date: string) => string
}

const CustomerTable = ({ users, onViewOrders, onDelete, formatDate }: CustomerTableProps) => {
  const getRoleClass = (role: string) => {
    return (ROLE_COLORS as Record<string, string>)[role] || ROLE_COLORS.customer
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-800">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Orders</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {users.map(user => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: ANIMATION_DURATION.NORMAL }}
              className="hover:bg-neutral-900"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <span className="ml-3 text-sm text-gray-200">{user.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleClass(user.role)}`}>
                  {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.createdAt ? formatDate(user.createdAt) : '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {(user as UserType & { orderCount?: number }).orderCount || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewOrders(user)}
                    className="text-blue-400 hover:text-blue-300 p-1"
                    title="View Orders"
                    aria-label="View orders"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Delete User"
                    aria-label="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomerTable
