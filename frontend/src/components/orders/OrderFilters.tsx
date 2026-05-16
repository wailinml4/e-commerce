import { Calendar, ArrowUpDown, X, RefreshCw, Search, Filter } from 'lucide-react'
import { ORDER_STATUS_OPTIONS, DATE_RANGE_OPTIONS } from '../../constants'

const sortOptions = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'amount-desc', label: 'Price: High to Low' },
  { value: 'amount-asc', label: 'Price: Low to High' },
]

interface OrderFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  dateRange: string
  onDateRangeChange: (value: string) => void
  customStartDate: string
  customEndDate: string
  onCustomStartChange: (value: string) => void
  onCustomEndChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  onClear: () => void
  onRefresh: () => void
  isLoading: boolean
}

const OrderFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  customStartDate,
  customEndDate,
  onCustomStartChange,
  onCustomEndChange,
  sortBy,
  onSortChange,
  onClear,
  onRefresh,
  isLoading,
}: OrderFiltersProps) => {
  const showCustomDate = dateRange === 'custom'

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {/* Search Input */}
      <div className="flex-1 min-w-[280px] relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search orders..."
            className="w-full bg-white/5 border border-white/5 pl-12 pr-4 py-2.5 rounded-xl text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all"
          />
      </div>

      <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
            <select
              value={statusFilter}
              onChange={e => onStatusChange(e.target.value)}
              className="appearance-none bg-white/5 border border-white/5 rounded-xl text-white/70 pl-10 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:border-primary/40 transition-all cursor-pointer"
            >
              <option value="all" className="bg-[#111]">All Statuses</option>
              {ORDER_STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#111]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
            <select
              value={dateRange}
              onChange={e => onDateRangeChange(e.target.value)}
              className="appearance-none bg-white/5 border border-white/5 rounded-xl text-white/70 pl-10 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:border-primary/40 transition-all cursor-pointer"
            >
              {DATE_RANGE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#111]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
              className="appearance-none bg-white/5 border border-white/5 rounded-xl text-white/70 pl-10 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:border-primary/40 transition-all cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#111]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onClear}
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all"
            title="Clear Filters"
          >
            <X size={18} />
          </button>

          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
      </div>

      {showCustomDate && (
        <div className="w-full flex gap-4 mt-2">
          <input
            type="date"
            value={customStartDate}
            onChange={e => onCustomStartChange(e.target.value)}
            className="bg-white/5 border border-white/5 text-white/70 px-4 py-2 rounded-xl focus:outline-none focus:border-primary/40"
          />
          <input
            type="date"
            value={customEndDate}
            onChange={e => onCustomEndChange(e.target.value)}
            className="bg-white/5 border border-white/5 text-white/70 px-4 py-2 rounded-xl focus:outline-none focus:border-primary/40"
          />
        </div>
      )}
    </div>
  )
}

export default OrderFilters
