import { useEffect, useState } from 'react'
import { useProductStore } from '../stores/useProductStore'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/products/ProductCard'
import { SlidersHorizontal, X } from 'lucide-react'
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

  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    handleFilter()
  }

  const clearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setSort('-createdAt')
    handleFilter()
  }

  useEffect(() => {
    handleFilter()
  }, [category])

  return (
    <div className="px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-light mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {getCategoryLabel(category!)}
        </motion.h1>
        <motion.p
          className="text-center text-gray-600 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Explore our curated collection
        </motion.p>

        {/* Filters Toggle */}
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-xl font-medium">
            {products.length} {products.length === 1 ? 'product' : 'products'}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <button onClick={handleFilter} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-full transition-colors">
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
        {isLoading ? (
          <LoadingSpinner variant="products" />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {products?.length === 0 && <h2 className="text-3xl font-light text-gray-400 text-center col-span-full">No products found</h2>}

            {products?.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
export default CategoryPage
