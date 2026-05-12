import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, Upload, Loader, X } from 'lucide-react'
import { useProductStore } from '../../stores/useProductStore'
import { CATEGORIES } from '../../constants'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import createProductSchema, { CreateProductInput } from '../../schemas/product.schema'

interface CreateProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const CreateProductModal = ({ isOpen, onClose, onSuccess }: CreateProductModalProps) => {
  const { createProduct, isLoading } = useProductStore()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
  })

  useEffect(() => {
    setValue('image', '')
  }, [setValue])

  const onSubmit = async (data: CreateProductInput) => {
    try {
      const payload = { 
        ...data, 
        image: data.image ?? '',
        status: 'active',
        isFeatured: true
      }
      await createProduct(payload)
      reset()
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setValue('image', reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <motion.div
        className="bg-neutral-950 rounded-lg max-w-xl w-full max-h-[90vh] overflow-hidden border border-neutral-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h2 className="text-xl font-semibold text-white">Create New Product</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <form id="create-product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
              <input
                {...register('name')}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-gray-600"
              />
              {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-gray-600"
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
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-gray-600"
              />
              {errors.price && <p className="text-sm text-red-400 mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <div className="relative">
                <select
                  {...register('category')}
                  className="appearance-none w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-white/15 px-3 py-2.5 text-sm font-medium cursor-pointer pr-10"
                >
                  <option value="" className="bg-gray-900 text-gray-100">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.slug} value={cat.slug} className="bg-gray-900 text-gray-100">
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Image</label>
              <div className="mt-1 flex items-center">
                <input type="file" id="image" className="sr-only" accept="image/*" onChange={handleImageChange} required />
                <label
                  htmlFor="image"
                  className="cursor-pointer bg-neutral-900 py-2 px-3 border border-neutral-800 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-neutral-800 focus:outline-none"
                >
                  <Upload className="h-5 w-5 inline-block mr-2" />
                  Upload Image
                </label>
                {errors.image ? <p className="text-sm text-red-400 ml-3">{errors.image.message}</p> : null}
                {watch('image') ? <span className="ml-3 text-sm text-gray-400">Image uploaded</span> : null}
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 text-gray-200 rounded-lg hover:bg-neutral-700 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-product-form"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Product
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default CreateProductModal
