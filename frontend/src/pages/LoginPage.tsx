import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, LogIn, Mail, Lock, ArrowRight, Loader, User } from 'lucide-react'
import { useAuthStore } from '../stores/useAuthStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schemas/auth.schema'
import { z } from 'zod'

const LoginPage = () => {
  type LoginFormValues = z.infer<typeof loginSchema>
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const { login, isLoading } = useAuthStore()

  const onSubmit = (data: LoginFormValues) => {
    login(data.email, data.password)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <div className="min-h-screen bg-app-bg text-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full" />

      <Link
        to="/"
        className="absolute left-8 top-8 bg-white/50 backdrop-blur-md border border-slate-100 px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold z-50 shadow-sm hover:bg-white transition-all"
      >
        <Home size={18} />
        Back to Home
      </Link>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="hidden lg:block">
          <motion.div variants={itemVariants} className="relative h-[650px] rounded-[3rem] overflow-hidden border border-white shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=800&q=80"
              alt="Technology"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
               <h2 className="text-4xl font-bold mb-4 tracking-tight text-slate-900">Experience <span className="text-primary italic">Innovation</span>.</h2>
               <p className="text-app-muted text-lg font-light leading-relaxed">Sign in to your account and manage your orders and products.</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="w-24 h-24 bg-white rounded-[2rem] border border-slate-100 shadow-xl flex items-center justify-center mx-auto mb-8 group hover:scale-110 transition-transform duration-500">
                <User size={48} className="text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-3 tracking-tighter text-slate-900">Sign In</h1>
            <p className="text-app-muted font-medium">Access your personal account.</p>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.25em] text-app-muted ml-5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[1.5rem] focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-slate-200 text-lg shadow-sm"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-5 mt-3">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.25em] text-app-muted ml-5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[1.5rem] focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-slate-200 text-lg shadow-sm"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-5 mt-3">{errors.password.message}</p>}
              </div>
            </div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex justify-center items-center gap-3 py-5 px-8 bg-slate-900 text-white rounded-[1.5rem] font-bold text-xl hover:bg-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-primary/40"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={24} />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={24} />
                  Sign In
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-app-muted font-medium mb-4">Don't have an account?</p>
            <Link to="/signup" className="group inline-flex items-center gap-2 font-bold text-slate-900 hover:text-primary transition-colors text-lg">
              Create Account <ArrowRight className="group-hover:translate-x-2 transition-transform" size={22} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
