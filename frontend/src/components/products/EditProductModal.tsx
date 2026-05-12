import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Upload } from 'lucide-react'
import { ANIMATION_DURATION } from '../../constants'
import { VALID_CATEGORIES } from '../../constants/categories'
import type { Product } from '../../types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProductSchema, UpdateProductInput } from '../../schemas/product.schema'

interface EditProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onSave: (productId: string, formData: Record<string, unknown>) => void
  isLoading: boolean
}

const EditProductModal = ({ product, isOpen, onClose, onSave, isLoading }: EditProductModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
  })

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? undefined,
        image: product.image || undefined,
        category: VALID_CATEGORIES.find(cat => cat === product.category) || undefined,
      })
    }
  }, [product, reset])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setValue('image', reader.result as string)
    reader.readAsDataURL(file)
  }

  const onSubmit = (data: UpdateProductInput) => {
    if (!product?.id) return
    onSave(product.id, data)
  }

  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        className="bg-neutral-950 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden border border-neutral-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: ANIMATION_DURATION.FAST }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h3 className="text-lg font-semibold text-white">Edit Product</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form id="edit-product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
              <input
                {...register('name')}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-gray-600"
              />
              {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                {...register('description')}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-gray-600"
                rows={3}
              />
              {errors.description && <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
              <input
                {...register('price')}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-gray-600"
              />
              {errors.price && <p className="text-sm text-red-400 mt-1">{errors.price.message}</p>}
            </div>

            <div className="mt-1 flex items-center">
              <input type="file" id="edit-image" className="sr-only" accept="image/*" onChange={handleImageChange} />
              <label
                htmlFor="edit-image"
                className="cursor-pointer bg-neutral-900 py-2 px-3 border border-neutral-800 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-neutral-800 focus:outline-none"
              >
                <Upload className="h-5 w-5 inline-block mr-2" />
                Upload Image
              </label>
              {watch('image') && <span className="ml-3 text-sm text-gray-400">Image uploaded</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <div className="relative">
                <select
                  {...register('category')}
                  className="appearance-none w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-white/15 px-3 py-2.5 text-sm font-medium cursor-pointer pr-10"
                >
                  <option value="" className="bg-gray-900 text-gray-100">Select a category</option>
                  {VALID_CATEGORIES.map(category => (
                    <option key={category} value={category} className="bg-gray-900 text-gray-100">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.category && <p className="text-sm text-red-400 mt-1">{errors.category.message}</p>}
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 text-gray-200 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-product-form"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default EditProductModal
