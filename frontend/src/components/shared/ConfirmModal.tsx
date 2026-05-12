import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { ANIMATION_DURATION } from '../../constants'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  confirmButtonClass?: string
  cancelButtonClass?: string
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-600 text-white hover:bg-red-700',
  cancelButtonClass = 'bg-neutral-800 text-gray-200 hover:bg-neutral-700',
}: ConfirmModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        className="bg-neutral-950 rounded-lg max-w-md w-full border border-neutral-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: ANIMATION_DURATION.FAST }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-6">
          <p className="text-gray-300">{message}</p>
        </div>
        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3">
          <button onClick={onClose} className={`px-4 py-2 rounded-lg transition-colors ${cancelButtonClass}`}>
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded-lg transition-colors ${confirmButtonClass}`}>
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ConfirmModal
