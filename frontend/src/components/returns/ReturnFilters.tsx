import { Filter, ArrowUpDown, X, RefreshCw } from 'lucide-react'
import SearchInput from '../shared/SearchInput'
import SelectFilter from '../shared/SelectFilter'
import { RETURN_STATUS_OPTIONS } from '../../constants'

const sortOptions = [
  { value: 'date-desc', label: 'Date: Newest' },
  { value: 'date-asc', label: 'Date: Oldest' },
  { value: 'amount-desc', label: 'Amount: Highest' },
  { value: 'amount-asc', label: 'Amount: Lowest' },
]

interface ReturnFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  onClear: () => void
  onRefresh: () => void
  isLoading: boolean
}

const ReturnFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  onClear,
  onRefresh,
  isLoading,
}: ReturnFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <SearchInput value={searchTerm} onChange={onSearchChange} placeholder="Search returns..." className="md:w-64" />

      <SelectFilter value={statusFilter} onChange={onStatusChange} options={RETURN_STATUS_OPTIONS} icon={Filter} />

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

export default ReturnFilters
