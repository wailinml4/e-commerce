import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { searchProductsService } from '../services/product.service'
import ProductCard from '../components/products/ProductCard'
import { Search, SlidersHorizontal, X, Filter, ArrowRight } from 'lucide-react'
import { CATEGORIES } from '../constants'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import type { Product } from '../types'

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt')
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await searchProductsService({
        query,
        category,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort,
      })
      setProducts(response.data.data)
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    setSearchParams({ ...Object.fromEntries(searchParams), sort: newSort })
  }

  const clearFilters = () => {
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSort('-createdAt')
    setSearchParams({ q: query })
  }

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
    setCategory(searchParams.get('category') || '')
    setMinPrice(searchParams.get('minPrice') || '')
    setMaxPrice(searchParams.get('maxPrice') || '')
    setSort(searchParams.get('sort') || '-createdAt')
  }, [searchParams])

  useEffect(() => {
    if (query || category || minPrice || maxPrice) {
      handleSearch()
    }
  }, [query, category, minPrice, maxPrice, sort])

  return (
    <div className="min-h-screen bg-app-bg pt-12 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
            <motion.h1
              className="text-4xl md:text-6xl font-black mb-4 tracking-tighter text-gradient-light"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Search <span className="text-primary italic">Results</span>
            </motion.h1>
            <p className="text-app-muted font-medium flex items-center gap-2">
                Showing {products.length} products {query && <>for <span className="text-slate-900 font-bold">"{query}"</span></>}
            </p>
        </div>

        {/* Action Bar */}
        <div className="mb-10 flex justify-between items-center">
            <div className="flex gap-2">
                {category && (
                    <span className="px-4 py-2 bg-white rounded-xl border border-slate-100 text-xs font-bold text-primary shadow-sm flex items-center gap-2">
                        {category}
                        <X size={14} className="cursor-pointer hover:text-slate-900" onClick={() => setCategory('')} />
                    </span>
                )}
            </div>
            <button
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                className={`glass-button flex items-center gap-2 transition-all duration-500 ${isFiltersVisible ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : ''}`}
            >
                {isFiltersVisible ? <X size={18} /> : <SlidersHorizontal size={18} />}
                {isFiltersVisible ? 'Close Filters' : 'Filters'}
            </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
            {isFiltersVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="spatial-panel p-8 mb-12 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-app-muted ml-4">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900 focus:outline-none focus:border-primary shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-app-muted ml-4">Min Price</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900 focus:outline-none focus:border-primary shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-app-muted ml-4">Max Price</label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900 focus:outline-none focus:border-primary shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-app-muted ml-4">Sort By</label>
                    <select
                      value={sort}
                      onChange={e => handleSortChange(e.target.value)}
                      className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-900 focus:outline-none focus:border-primary shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="-createdAt">Newest</option>
                      <option value="createdAt">Oldest</option>
                      <option value="price">Price: Low to High</option>
                      <option value="-price">Price: High to Low</option>
                      <option value="name">Name: A-Z</option>
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button onClick={handleSearch} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-primary transition-all shadow-xl hover:shadow-primary/20">
                    Apply Filter
                  </button>
                  <button
                    onClick={clearFilters}
                    className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
                  >
                    <X size={18} />
                    Reset
                  </button>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Results Area */}
        {loading ? (
          <div className="py-32">
            <LoadingSpinner variant="products" />
          </div>
        ) : (
          <div className="relative">
            {products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm"
              >
                <Search className="mx-auto mb-6 text-slate-100" size={80} />
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">No Results Found</h2>
                <p className="text-app-muted mb-8 max-w-xs mx-auto">We couldn't find any products matching your search criteria.</p>
                <button
                  onClick={clearFilters}
                  className="bg-slate-900 text-white py-4 px-10 rounded-2xl font-black hover:bg-primary transition-all shadow-xl"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
