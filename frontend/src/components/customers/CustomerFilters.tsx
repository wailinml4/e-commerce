import { Shield, ArrowUpDown, X, RefreshCw } from 'lucide-react'
import SearchInput from '../shared/SearchInput'
import SelectFilter from '../shared/SelectFilter'
import { ROLE_FILTER_OPTIONS } from '../../constants'

interface CustomerFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  roleFilter: string
  onRoleChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  onClear: () => void
  onRefresh: () => void
  isLoading: boolean
}

const sortOptions = [
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
  { value: 'date-desc', label: 'Joined: Newest' },
  { value: 'date-asc', label: 'Joined: Oldest' },
]

const CustomerFilters = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleChange,
  sortBy,
  onSortChange,
  onClear,
  onRefresh,
  isLoading,
}: CustomerFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <SearchInput value={searchTerm} onChange={onSearchChange} placeholder="Search by name or email..." />
      <SelectFilter value={roleFilter} onChange={onRoleChange} options={ROLE_FILTER_OPTIONS} icon={Shield} />
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

export default CustomerFilters
