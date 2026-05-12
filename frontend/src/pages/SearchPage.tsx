import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { searchProductsService } from '../services/product.service'
import ProductCard from '../components/products/ProductCard'
import { Search, SlidersHorizontal, X } from 'lucide-react'
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
    console.log('SearchPage handleSearch called with:', {
      query,
      category,
      minPrice,
      maxPrice,
      sort,
    })
    try {
      const response = await searchProductsService({
        query,
        category,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort,
      })
      console.log('SearchPage received products:', response.data.data)
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
    handleSearch()
  }

  const clearFilters = () => {
    setCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSort('-createdAt')
    setSearchParams({ q: query })
    handleSearch()
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
    <div className="min-h-screen bg-white text-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Filters Toggle */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-xl font-medium">
            {products.length} {products.length === 1 ? 'result' : 'results'}
            {query && ` for "${query}"`}
          </h2>
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
          >
            <SlidersHorizontal size={18} />
            {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters */}
        {isFiltersVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-900"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Max Price</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Sort By</label>
                <select
                  value={sort}
                  onChange={e => handleSortChange(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-900 focus:outline-none focus:border-gray-900"
                >
                  <option value="-createdAt">Newest</option>
                  <option value="createdAt">Oldest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                  <option value="-name">Name: Z-A</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleSearch} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full transition-colors">
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-2 rounded-full transition-colors flex items-center"
              >
                <X size={16} className="mr-2" />
                Clear
              </button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {loading ? (
          <LoadingSpinner variant="products" />
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-20">
                <Search className="mx-auto mb-4 text-gray-300" size={64} />
                <h2 className="text-2xl font-light text-gray-400 mb-2">No products found</h2>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={clearFilters}
                  className="bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-full font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchPage
