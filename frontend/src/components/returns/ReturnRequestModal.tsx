import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, AlertCircle } from 'lucide-react'
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-10 py-8 flex items-center justify-between border-b border-slate-50 shrink-0 relative z-10">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/5">
                      <RotateCcw size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Return Request</h2>
                    <p className="text-xs text-slate-400 font-medium">Initiate a product return protocol.</p>
                  </div>
              </div>
              <button onClick={handleClose} className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-10 relative z-10">
              <form onSubmit={handleSubmit(internalSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Return Reason
                  </label>
                  <div className="relative group">
                    <select
                      {...register('returnReason')}
                      className="appearance-none w-full bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 px-6 py-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary/40 transition-all cursor-pointer group-hover:bg-slate-100"
                    >
                      <option value="">Select a reason</option>
                      <option value="defective">Defective Product</option>
                      <option value="wrong_item">Wrong Item</option>
                      <option value="not_as_described">Not as Described</option>
                      <option value="changed_mind">Changed Mind</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none text-slate-300">
                        <X size={16} className="rotate-45" />
                    </div>
                  </div>
                  {errors.returnReason && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-1">{errors.returnReason.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Additional Details
                  </label>
                  <textarea
                    {...register('returnDescription')}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 px-6 py-4 text-sm font-medium focus:outline-none focus:border-primary/40 transition-all placeholder:text-slate-300 resize-none"
                    placeholder="Tell us more about the issue..."
                  />
                  {errors.returnDescription && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-1">{errors.returnDescription.message}</p>}
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <button
                        type="submit"
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        Submit Return Request
                    </button>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all"
                    >
                        Cancel
                    </button>
                </div>
              </form>
            </div>
            
            {/* Disclaimer */}
            <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-start gap-3">
                <AlertCircle size={16} className="text-slate-300 mt-0.5" />
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-widest">
                    Our team will review your request within 24-48 hours. Returns are subject to our standard terms and conditions.
                </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ReturnRequestModal
