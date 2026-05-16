import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Upload, Loader, X, Box, Info, DollarSign, Layers } from 'lucide-react'
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0A0A0B] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            {/* Header */}
            <div className="px-10 py-8 flex items-center justify-between border-b border-white/5 shrink-0 relative z-10">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                      <PlusCircle size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Create Product</h2>
                    <p className="text-xs text-white/40 font-medium">Add a new item to your inventory registry.</p>
                  </div>
              </div>
              <button onClick={onClose} className="p-3 rounded-xl bg-white/5 text-white/30 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-10 overflow-y-auto custom-scrollbar relative z-10">
              <form id="create-product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                          <Info size={14} /> Product Name
                      </label>
                      <input
                        {...register('name')}
                        placeholder="e.g. Premium Silk Scarf"
                        className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all"
                      />
                      {errors.name && <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider ml-1 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                          <DollarSign size={14} /> Price
                      </label>
                      <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-bold">$</span>
                          <input
                            {...register('price')}
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-10 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all"
                          />
                      </div>
                      {errors.price && <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider ml-1 mt-1">{errors.price.message}</p>}
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                      <Box size={14} /> Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Enter product story and specifications..."
                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/20 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  />
                  {errors.description && <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider ml-1 mt-1">{errors.description.message}</p>}
                </div>

                {/* Category & Image Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                          <Layers size={14} /> Category
                      </label>
                      <div className="relative group">
                        <select
                          {...register('category')}
                          className="appearance-none w-full bg-white/5 border border-white/5 rounded-2xl text-white/70 px-6 py-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary/40 transition-all cursor-pointer group-hover:bg-white/10"
                        >
                          <option value="" className="bg-[#111]">Select Category</option>
                          {CATEGORIES.map(cat => (
                            <option key={cat.slug} value={cat.slug} className="bg-[#111]">
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-white/20">
                           <X size={16} className="rotate-45" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                          <Upload size={14} /> Product Image
                      </label>
                      <div className="flex items-center">
                        <input type="file" id="image" className="sr-only" accept="image/*" onChange={handleImageChange} required />
                        <label
                          htmlFor="image"
                          className={`w-full cursor-pointer bg-white/5 py-4 px-6 border-2 border-dashed rounded-2xl text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${watch('image') ? 'border-primary/40 text-primary bg-primary/5' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'}`}
                        >
                          <Upload size={18} />
                          {watch('image') ? 'Image Uploaded' : 'Upload Image'}
                        </label>
                      </div>
                      {errors.image && <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider ml-1 mt-1">{errors.image.message}</p>}
                    </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-10 py-8 border-t border-white/5 flex justify-end gap-4 shrink-0 relative z-10">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 bg-white/5 text-white/60 rounded-xl font-bold text-sm hover:bg-white/10 hover:text-white transition-all"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-product-form"
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} />
                    Create Product
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CreateProductModal
