import { STATUS_COLORS, ROLE_COLORS } from '../../constants'

interface StatusBadgeProps {
  status: string
  type?: 'status' | 'role'
}

const StatusBadge = ({ status, type = 'status' }: StatusBadgeProps) => {
  const getStatusClass = () => {
    if (type === 'role') {
      return (ROLE_COLORS as Record<string, string>)[status] || ROLE_COLORS.customer
    }
    return (STATUS_COLORS as Record<string, string>)[status] || STATUS_COLORS.inactive
  }

  return <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass()}`}>{status}</span>
}

export default StatusBadge
