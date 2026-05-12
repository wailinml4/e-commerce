import {} from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '../schemas/auth.schema'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Home, UserPlus, Mail, Lock, User, ArrowRight, Loader, Cpu } from 'lucide-react'
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
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
      <Link
        to="/"
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900"
      >
        <Home size={16} />
        Home
      </Link>
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="hidden lg:block">
          <motion.div variants={itemVariants} className="relative h-[600px] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
              alt="Technology"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <Cpu size={64} className="mx-auto mb-4 text-gray-400" />
            <h1 className="text-4xl md:text-5xl font-light mb-2">Create Account</h1>
            <p className="text-gray-600 font-light">Join us and access cutting-edge technology</p>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 transition-all"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <motion.button
              variants={itemVariants}
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-4 px-6 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Sign Up
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.p variants={itemVariants} className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-gray-900 hover:text-gray-700 transition-colors">
              Login here <ArrowRight className="inline" size={16} />
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
export default SignUpPage
