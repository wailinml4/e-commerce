import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '../schemas/auth.schema'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Home, UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../stores/useAuthStore'

const SignUpPage = () => {
  const signupFormSchema = signupSchema
    .extend({
      confirmPassword: z.string().min(1, 'Confirm password is required'),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })

  type SignupFormValues = z.infer<typeof signupFormSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
  })

  const { signup, isLoading } = useAuthStore()

  const onSubmit = (data: SignupFormValues) => {
    signup(data)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full" />

      <Link
        to="/"
        className="absolute left-8 top-8 bg-white/50 backdrop-blur-md border border-slate-100 px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold z-50 shadow-sm hover:bg-white transition-all"
      >
        <Home size={18} />
        Back to Home
      </Link>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="hidden lg:block">
          <motion.div variants={itemVariants} className="relative h-[750px] rounded-[3rem] overflow-hidden border border-white shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
              alt="Technology"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12">
               <h2 className="text-4xl font-bold mb-4 tracking-tight text-slate-900">Start your <span className="text-primary italic">journey</span>.</h2>
               <p className="text-app-muted text-lg font-light leading-relaxed">Join our community and discover the next generation of premium products.</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="w-20 h-20 bg-white rounded-3xl border border-slate-100 shadow-xl flex items-center justify-center mx-auto mb-6 group hover:scale-110 transition-transform duration-500">
                <UserPlus size={40} className="text-primary" />
            </div>
            <h1 className="text-5xl font-bold mb-3 tracking-tighter text-slate-900">Create Account</h1>
            <p className="text-app-muted font-medium">Join us and start shopping today.</p>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted ml-4">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-slate-200 shadow-sm"
                  placeholder="Full Name"
                />
                {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-4 mt-2">{errors.name.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted ml-4">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-slate-200 shadow-sm"
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-4 mt-2">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted ml-4">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-slate-200 shadow-sm"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-4 mt-2">{errors.password.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-muted ml-4">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-slate-200 shadow-sm"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-4 mt-2">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full flex justify-center items-center gap-3 py-5 px-6 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-primary/40"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div variants={itemVariants} className="mt-10 text-center">
            <p className="text-app-muted font-medium mb-4">Already have an account?</p>
            <Link to="/login" className="group inline-flex items-center gap-2 font-bold text-slate-900 hover:text-primary transition-colors text-lg">
              Sign In <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUpPage
