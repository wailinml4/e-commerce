import { Calendar, ArrowUpDown, X, RefreshCw } from 'lucide-react'
import SearchInput from '../shared/SearchInput'
import SelectFilter from '../shared/SelectFilter'
import { ORDER_STATUS_OPTIONS, DATE_RANGE_OPTIONS } from '../../constants'

const sortOptions = [
  { value: 'date-desc', label: 'Date: Newest' },
  { value: 'date-asc', label: 'Date: Oldest' },
  { value: 'amount-desc', label: 'Amount: Highest' },
  { value: 'amount-asc', label: 'Amount: Lowest' },
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
    <div className="flex flex-col md:flex-row gap-3 mb-6 flex-wrap">
      <SearchInput value={searchTerm} onChange={onSearchChange} placeholder="Search orders..." className="md:w-64" />

      <SelectFilter value={statusFilter} onChange={onStatusChange} options={ORDER_STATUS_OPTIONS} />

      <SelectFilter value={dateRange} onChange={onDateRangeChange} options={DATE_RANGE_OPTIONS} icon={Calendar} />

      {showCustomDate && (
        <div className="flex gap-2">
          <input
            type="date"
            value={customStartDate}
            onChange={e => onCustomStartChange(e.target.value)}
            className="bg-neutral-900 text-gray-200 px-3 py-2 rounded-lg border border-neutral-800 focus:outline-none focus:border-gray-600"
          />
          <input
            type="date"
            value={customEndDate}
            onChange={e => onCustomEndChange(e.target.value)}
            className="bg-neutral-900 text-gray-200 px-3 py-2 rounded-lg border border-neutral-800 focus:outline-none focus:border-gray-600"
          />
        </div>
      )}

      <SelectFilter value={sortBy} onChange={onSortChange} options={sortOptions} icon={ArrowUpDown} />

      <button
        onClick={onClear}
        className="bg-white/10 backdrop-blur-md border border-white/20 text-gray-100 px-4 py-2.5 rounded-lg hover:bg-white/15 hover:border-white/30 hover:shadow-xl transition-all duration-200 shadow-lg flex items-center font-medium"
      >
        <X className="h-4 w-4 mr-2" />
        Clear
      </button>

      <button
        onClick={onRefresh}
        className="bg-white/10 backdrop-blur-md border border-white/20 text-gray-100 px-4 py-2.5 rounded-lg hover:bg-white/15 hover:border-white/30 hover:shadow-xl transition-all duration-200 shadow-lg flex items-center font-medium"
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </button>
    </div>
  )
}

export default OrderFilters
