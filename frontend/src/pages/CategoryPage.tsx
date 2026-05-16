import { useEffect, useState } from 'react'
import { useProductStore } from '../stores/useProductStore'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../components/products/ProductCard'
import { SlidersHorizontal, X, Filter } from 'lucide-react'
import { getCategoryLabel } from '../constants'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const CategoryPage = () => {
  const { getProductsByCategory, products, isLoading } = useProductStore()
  const { category } = useParams<{ category: string }>()
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  const handleFilter = async () => {
    await getProductsByCategory(category!, minPrice ? Number(minPrice) : undefined, maxPrice ? Number(maxPrice) : undefined, sort)
  }

  useEffect(() => {
    handleFilter()
  }, [category, sort]) // Re-run when category or sort changes

  const clearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setSort('-createdAt')
  }

  return (
    <div className="min-h-screen bg-app-bg pt-12 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-16 text-center">
            <motion.h1
              className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-gradient-light"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {getCategoryLabel(category!)}
            </motion.h1>
            <motion.p
              className="text-app-muted text-lg font-light max-w-xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Explore our curated collection of premium products in <span className="text-primary font-bold">{getCategoryLabel(category!)}</span>.
            </motion.p>
        </div>

        {/* Action Bar */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-xl font-bold text-slate-900">{products.length}</span>
                  <span className="ml-2 text-app-muted text-sm uppercase tracking-widest font-bold">Products</span>
              </div>
          </div>
          
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className={`glass-button flex items-center gap-2 transition-all duration-500 ${isFiltersVisible ? 'bg-slate-900 text-white border-slate-900' : ''}`}
          >
            {isFiltersVisible ? <X size={18} /> : <SlidersHorizontal size={18} />}
            {isFiltersVisible ? 'Close Filters' : 'Filters'}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
            {isFiltersVisible && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="spatial-panel p-8 mb-12 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Filter size={120} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted ml-4">Min Price (USD)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                      className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted ml-4">Max Price (USD)</label>
                    <input
                      type="number"
                      placeholder="10000.00"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-primary transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted ml-4">Sort By</label>
                    <select
                      value={sort}
                      onChange={e => setSort(e.target.value)}
                      className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:border-primary appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="-createdAt">Newest</option>
                      <option value="createdAt">Oldest</option>
                      <option value="price">Price: Low to High</option>
                      <option value="-price">Price: High to Low</option>
                      <option value="name">Name: A-Z</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-4">
                  <button 
                    onClick={handleFilter} 
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary transition-all shadow-xl hover:shadow-primary/20"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-8 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
                  >
                    <X size={18} />
                    Reset
                  </button>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Results Grid */}
        {isLoading ? (
          <div className="py-24">
            <LoadingSpinner />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {products?.length === 0 ? (
              <div className="col-span-full py-32 text-center">
                <h2 className="text-4xl font-bold text-slate-200 mb-4 tracking-tight uppercase">No Products Found</h2>
                <p className="text-app-muted text-lg">No products found matching your current filters.</p>
                <button onClick={clearFilters} className="mt-8 text-primary font-bold hover:underline">Reset Filters</button>
              </div>
            ) : (
              products?.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage

