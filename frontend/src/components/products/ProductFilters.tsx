import { X, RefreshCw, ArrowUpDown, Filter } from 'lucide-react'
import SearchInput from '../shared/SearchInput'
import { CATEGORIES } from '../../constants'

interface ProductFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  onClear: () => void
  onRefresh: () => void
  isLoading: boolean
}

const ProductFilters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  onClear,
  onRefresh,
  isLoading,
}: ProductFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <SearchInput value={searchTerm} onChange={onSearchChange} placeholder="Search by name or category..." />

      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-4 w-4 z-10" />
        <select
          value={categoryFilter}
          onChange={e => onCategoryChange(e.target.value)}
          className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-white/15 pl-10 pr-10 py-2.5 text-sm font-medium cursor-pointer"
        >
          <option value="all" className="bg-gray-900 text-gray-100">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat.slug} value={cat.slug} className="bg-gray-900 text-gray-100">
              {cat.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="relative">
        <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-4 w-4 z-10" />
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-white/15 pl-10 pr-10 py-2.5 text-sm font-medium cursor-pointer"
        >
          <option value="date-desc" className="bg-gray-900 text-gray-100">Newest</option>
          <option value="date-asc" className="bg-gray-900 text-gray-100">Oldest</option>
          <option value="name-asc" className="bg-gray-900 text-gray-100">Name: A-Z</option>
          <option value="name-desc" className="bg-gray-900 text-gray-100">Name: Z-A</option>
          <option value="price-asc" className="bg-gray-900 text-gray-100">Price: Low-High</option>
          <option value="price-desc" className="bg-gray-900 text-gray-100">Price: High-Low</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

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

export default ProductFilters
