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
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-white/90">Products</h1>
            <p className="text-sm text-white/40 mt-1">Manage and monitor your product inventory.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/20 hover:brightness-110 active:scale-95"
        >
          <PlusCircle size={20} />
          Add Product
        </button>
      </div>

      {/* Main Content Area */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] border border-white/5 rounded-3xl p-6"
      >
          <ProductsList key={refreshKey} />
      </motion.div>

      <CreateProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleProductCreated} />
    </div>
  )
}

export default AdminProductsPage
