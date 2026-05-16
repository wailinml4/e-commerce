import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmButtonClass?: string
  isLoading?: boolean
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-500 hover:bg-red-600',
  isLoading = false,
}: ConfirmModalProps) => {
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
            className="relative w-full max-w-md bg-[#0A0A0B] border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
          >
            {/* Ambient Background Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl font-bold text-white/90">{title}</h2>
            </div>

            <p className="text-white/50 text-sm leading-relaxed mb-10 relative z-10">
              {message}
            </p>

            <div className="flex items-center gap-3 relative z-10">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-white/60 font-semibold hover:bg-white/10 hover:text-white transition-all border border-white/5"
                disabled={isLoading}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50 ${confirmButtonClass}`}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : confirmText}
              </button>
            </div>
            
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmModal
