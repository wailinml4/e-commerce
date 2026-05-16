import { STATUS_COLORS, ROLE_COLORS } from '../../constants'

interface StatusBadgeProps {
  status: string
  type?: 'status' | 'role'
  variant?: 'flat' | 'spatial'
}

const StatusBadge = ({ status, type = 'status', variant = 'spatial' }: StatusBadgeProps) => {
  const getStatusClass = () => {
    if (type === 'role') {
      return (ROLE_COLORS as Record<string, string>)[status] || ROLE_COLORS.customer
    }
    return (STATUS_COLORS as Record<string, string>)[status] || STATUS_COLORS.inactive
  }

  if (variant === 'spatial') {
      const colors: Record<string, string> = {
          active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          inactive: 'bg-white/5 text-white/40 border-white/10',
          pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          processing: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          shipped: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
          requested: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
          admin: 'bg-primary/10 text-primary border-primary/20',
          customer: 'bg-white/5 text-white/60 border-white/10'
      }
      
      const colorClass = colors[status.toLowerCase()] || colors.inactive

      return (
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${colorClass} backdrop-blur-md`}>
              {status}
          </span>
      )
  }

  return <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass()}`}>{status}</span>
}

export default StatusBadge
