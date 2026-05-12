import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { requestReturnSchema, type ReturnRequestInput } from '../../schemas/order.schema.js'

interface ReturnRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { returnReason: string; returnDescription: string }) => void
}

const ReturnRequestModal = ({ isOpen, onClose, onSubmit }: ReturnRequestModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReturnRequestInput>({
    resolver: zodResolver(requestReturnSchema),
  })

  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  if (!isOpen) return null

  const internalSubmit = (values: { returnReason: string; returnDescription?: string }) => {
    onSubmit({
      returnReason: values.returnReason,
      returnDescription: values.returnDescription || '',
    })
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg border border-gray-200"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Request Return</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(internalSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Return Reason</label>
            <div className="relative">
              <select
                {...register('returnReason')}
                className="appearance-none w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-white/15 px-4 py-2.5 text-sm font-medium cursor-pointer pr-10"
              >
                <option value="" className="bg-gray-900 text-gray-100">Select a reason</option>
                <option value="defective" className="bg-gray-900 text-gray-100">Defective Product</option>
                <option value="wrong_item" className="bg-gray-900 text-gray-100">Wrong Item</option>
                <option value="not_as_described" className="bg-gray-900 text-gray-100">Not as Described</option>
                <option value="changed_mind" className="bg-gray-900 text-gray-100">Changed Mind</option>
                <option value="other" className="bg-gray-900 text-gray-100">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.returnReason && <p className="text-sm text-red-400 mt-1">{errors.returnReason.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
            <textarea
              {...register('returnDescription')}
              className="w-full bg-white text-gray-900 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 h-32"
              placeholder="Please provide details about your return request..."
            ></textarea>
            {errors.returnDescription && <p className="text-sm text-red-500 mt-1">{errors.returnDescription.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              Submit Request
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default ReturnRequestModal
