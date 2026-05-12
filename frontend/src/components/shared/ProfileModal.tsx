import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Save, Shield, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import { useAuthStore } from '../../stores/useAuthStore'
import { useUserStore } from '../../stores/useUserStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProfileSchema } from '../../schemas/user.schema.js'
import type { UpdateProfileInput } from '../../types'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  variant?: 'customer' | 'admin'
}

const ProfileModal = ({ isOpen, onClose, variant = 'customer' }: ProfileModalProps) => {
  const { user, setUser } = useAuthStore()
  const { updateProfile } = useUserStore()
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  })
  const isAdmin = variant === 'admin'

  useEffect(() => {
    if (!user) return
    reset({ name: user.name || '', email: user.email || '' })
  }, [user, isOpen, reset])

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsSaving(true)
    try {
      const updatedUser = await updateProfile(data)
      if (updatedUser) setUser(updatedUser)
      toast.success('Profile updated successfully')
      onClose()
    } catch (error) {
      toast.error((error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) return null

  const panelClass = isAdmin
    ? 'w-full max-w-2xl rounded-lg border border-neutral-800 bg-neutral-950 p-6 text-gray-100 shadow-2xl'
    : 'w-full max-w-2xl rounded-lg bg-white p-6 text-gray-900 shadow-2xl'
  const mutedTextClass = isAdmin ? 'text-gray-400' : 'text-gray-500'
  const summaryClass = isAdmin
    ? 'mb-6 grid gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4 sm:grid-cols-3'
    : 'mb-6 grid gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-3'
  const iconClass = isAdmin ? 'h-5 w-5 text-gray-400' : 'h-5 w-5 text-gray-500'
  const labelClass = isAdmin ? 'mb-2 block text-sm font-medium text-gray-300' : 'mb-2 block text-sm font-medium text-gray-700'
  const inputClass = isAdmin
    ? 'w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-gray-100 transition-colors focus:border-gray-500 focus:outline-none'
    : 'w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-gray-900 focus:outline-none'
  const closeButtonClass = isAdmin
    ? 'rounded-lg p-2 text-gray-400 transition-colors hover:bg-neutral-900 hover:text-white'
    : 'rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900'
  const submitButtonClass = isAdmin
    ? 'flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60'
    : 'flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className={panelClass}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onMouseDown={event => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Profile</h2>
                <p className={`text-sm ${mutedTextClass}`}>Manage your account details</p>
              </div>
              <button type="button" onClick={onClose} className={closeButtonClass} aria-label="Close profile">
                <X size={20} />
              </button>
            </div>
            <div className={summaryClass}>
              <div className="flex items-center gap-3">
                <User className={iconClass} />
                <div>
                  <p className={`text-xs ${mutedTextClass}`}>Name</p>
                  <p className="font-medium">{user.name || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className={iconClass} />
                <div>
                  <p className={`text-xs ${mutedTextClass}`}>Email</p>
                  <p className="font-medium">{user.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className={iconClass} />
                <div>
                  <p className={`text-xs ${mutedTextClass}`}>Role</p>
                  <p className="font-medium capitalize">{user.role || '-'}</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className={labelClass} htmlFor="profile-name">
                  Full Name
                </label>
                <input id="profile-name" type="text" {...register('name')} className={inputClass} />
                {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="profile-email">
                  Email Address
                </label>
                <input id="profile-email" type="email" {...register('email')} className={inputClass} />
                {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={isSaving} className={submitButtonClass}>
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProfileModal
