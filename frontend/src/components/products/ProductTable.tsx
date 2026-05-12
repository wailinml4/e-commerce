import { motion } from 'framer-motion'
import { Edit, Trash, Star } from 'lucide-react'
import { ANIMATION_DURATION } from '../../constants'
import StatusBadge from '../shared/StatusBadge'
import type { Product } from '../../types'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
  onToggleFeatured: (productId: string) => void
  onToggleStatus: (productId: string) => void
}

const ProductTable = ({ products, onEdit, onDelete, onToggleFeatured, onToggleStatus }: ProductTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-800">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Featured</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {products.map((product: Product) => (
            <motion.tr
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: ANIMATION_DURATION.NORMAL }}
              className="hover:bg-neutral-900"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full object-cover" src={product.image} alt={product.name} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm text-gray-200">{product.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{Number.isFinite(Number(product.price)) ? `$${Number(product.price).toFixed(2)}` : '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onToggleStatus(product.id)}
                  className="cursor-pointer"
                  title="Click to toggle status"
                >
                  <StatusBadge status={product.status || 'active'} />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onToggleFeatured(product.id)}
                  className={`p-1 rounded transition-colors ${product.isFeatured ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-500 hover:text-yellow-400'}`}
                  title={product.isFeatured ? 'Remove from featured' : 'Set as featured'}
                >
                  <Star className="h-5 w-5" fill={product.isFeatured ? 'currentColor' : 'none'} />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-400 hover:text-blue-300 p-1"
                    title="Edit Product"
                    aria-label="Edit product"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Delete Product"
                    aria-label="Delete product"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
