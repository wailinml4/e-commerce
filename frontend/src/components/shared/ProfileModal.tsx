import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Save, Shield, User, X, Loader } from 'lucide-react'
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
      toast.error((error as AxiosError<{ message: string }>).response?.data?.message || 'Update failed')
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border ${isAdmin ? 'bg-[#0A0A0B] border-white/10' : 'bg-white border-slate-200 text-slate-900'}`}
            onMouseDown={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`px-10 py-8 flex items-center justify-between border-b shrink-0 relative z-10 ${isAdmin ? 'border-white/5' : 'border-slate-100'}`}>
              <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isAdmin ? 'bg-primary/10 border border-primary/20 text-primary shadow-primary/10' : 'bg-primary/5 border border-primary/10 text-primary'}`}>
                      <User size={24} />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold tracking-tight ${isAdmin ? 'text-white' : 'text-slate-900'}`}>Edit Profile</h2>
                    <p className={`text-sm font-medium ${isAdmin ? 'text-white/40' : 'text-slate-400'}`}>Update your account information.</p>
                  </div>
              </div>
              <button onClick={onClose} className={`p-3 rounded-xl transition-colors ${isAdmin ? 'bg-white/5 text-white/30 hover:text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-900'}`}>
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-10 space-y-8 relative z-10">
                {/* Info Bar */}
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-[2rem] border ${isAdmin ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="space-y-1">
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${isAdmin ? 'text-white/20' : 'text-slate-400'}`}>Current Name</p>
                        <p className={`text-sm font-bold ${isAdmin ? 'text-white/90' : 'text-slate-700'}`}>{user.name || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${isAdmin ? 'text-white/20' : 'text-slate-400'}`}>Email Address</p>
                        <p className={`text-sm font-bold ${isAdmin ? 'text-white/90' : 'text-slate-700'}`}>{user.email || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${isAdmin ? 'text-white/20' : 'text-slate-400'}`}>Account Role</p>
                        <div className="flex items-center gap-2">
                            <Shield size={14} className="text-primary" />
                            <p className={`text-sm font-bold capitalize ${isAdmin ? 'text-white/90' : 'text-slate-700'}`}>{user.role}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${isAdmin ? 'text-white/40' : 'text-slate-500'}`}>
                          Update Name
                        </label>
                        <div className="relative">
                            <User size={18} className={`absolute left-6 top-1/2 -translate-y-1/2 ${isAdmin ? 'text-white/20' : 'text-slate-300'}`} />
                            <input 
                                type="text" 
                                {...register('name')} 
                                className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 ${isAdmin ? 'bg-white/5 border-white/5 text-white focus:border-primary/40 focus:ring-primary/10 placeholder:text-white/20' : 'bg-white border-slate-200 text-slate-900 focus:border-primary focus:ring-primary/5 shadow-sm'}`} 
                            />
                        </div>
                        {errors.name && <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider ml-1 mt-1">{errors.name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${isAdmin ? 'text-white/40' : 'text-slate-500'}`}>
                          Update Email
                        </label>
                        <div className="relative">
                            <Mail size={18} className={`absolute left-6 top-1/2 -translate-y-1/2 ${isAdmin ? 'text-white/20' : 'text-slate-300'}`} />
                            <input 
                                type="email" 
                                {...register('email')} 
                                className={`w-full pl-14 pr-6 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 ${isAdmin ? 'bg-white/5 border-white/5 text-white focus:border-primary/40 focus:ring-primary/10 placeholder:text-white/20' : 'bg-white border-slate-200 text-slate-900 focus:border-primary focus:ring-primary/5 shadow-sm'}`} 
                            />
                        </div>
                        {errors.email && <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider ml-1 mt-1">{errors.email.message}</p>}
                      </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className={`flex w-full items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-95 disabled:opacity-50 ${isAdmin ? 'bg-primary text-white hover:brightness-110 shadow-primary/20' : 'bg-slate-900 text-white hover:bg-primary shadow-slate-900/10'}`}
                  >
                    {isSaving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                    {isSaving ? 'Updating Profile...' : 'Save Changes'}
                  </button>
                </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ProfileModal
