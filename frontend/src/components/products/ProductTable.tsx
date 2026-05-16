import { motion, AnimatePresence } from 'framer-motion'
import { Edit, Trash2, Star } from 'lucide-react'
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
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/5">
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Product</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Price</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Category</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest">Featured</th>
            <th className="px-6 py-4 text-[11px] font-bold text-white/30 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {products.map((product: Product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group hover:bg-white/[0.03] transition-colors"
              >
                {/* Product Info */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/5">
                        <img className="h-full w-full object-cover" src={product.image} alt={product.name} />
                    </div>
                    <div className="text-sm font-semibold text-white/90">{product.name}</div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-white/70">${Number(product.price).toFixed(2)}</span>
                </td>

                {/* Category */}
                <td className="px-6 py-5">
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">{product.category}</span>
                </td>

                {/* Status */}
                <td className="px-6 py-5">
                  <button
                    onClick={() => onToggleStatus(product.id)}
                    className="hover:scale-105 active:scale-95 transition-transform"
                    title="Toggle status"
                  >
                    <StatusBadge status={product.status || 'active'} variant="spatial" />
                  </button>
                </td>

                {/* Featured */}
                <td className="px-6 py-5">
                  <button
                    onClick={() => onToggleFeatured(product.id)}
                    className={`p-2 rounded-xl transition-all ${product.isFeatured ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/10' : 'text-white/20 hover:text-white/40'}`}
                  >
                    <Star size={18} fill={product.isFeatured ? 'currentColor' : 'none'} />
                  </button>
                </td>

                {/* Actions */}
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 rounded-xl bg-white/5 text-white/40 hover:bg-primary/10 hover:text-primary transition-all border border-white/5"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 rounded-xl bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all border border-white/5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
