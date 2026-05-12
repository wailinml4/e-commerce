import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle } from 'lucide-react'
import ProductsList from '../components/products/ProductsList'
import CreateProductModal from '../components/products/CreateProductModal'

const AdminProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleProductCreated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          className="text-3xl font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Products
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          Add Product
        </motion.button>
      </div>
      <ProductsList key={refreshKey} />
      <CreateProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleProductCreated} />
    </div>
  )
}

export default AdminProductsPage
