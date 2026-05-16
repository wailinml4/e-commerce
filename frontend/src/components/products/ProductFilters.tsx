import { X, RefreshCw, ArrowUpDown, Filter, Search } from 'lucide-react'
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
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {/* Search Input */}
      <div className="flex-1 min-w-[280px] relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white/5 border border-white/5 pl-12 pr-4 py-2.5 rounded-xl text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all"
          />
      </div>

      <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={16} />
            <select
              value={categoryFilter}
              onChange={e => onCategoryChange(e.target.value)}
              className="appearance-none bg-white/5 border border-white/5 rounded-xl text-white/70 pl-10 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:border-primary/40 transition-all cursor-pointer"
            >
              <option value="all" className="bg-[#111]">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.slug} value={cat.slug} className="bg-[#111]">
                  {cat.label}
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
              <option value="date-desc" className="bg-[#111]">Newest First</option>
              <option value="date-asc" className="bg-[#111]">Oldest First</option>
              <option value="name-asc" className="bg-[#111]">Name: A-Z</option>
              <option value="name-desc" className="bg-[#111]">Name: Z-A</option>
              <option value="price-asc" className="bg-[#111]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#111]">Price: High to Low</option>
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
    </div>
  )
}

export default ProductFilters
