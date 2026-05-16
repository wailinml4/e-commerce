import { motion } from 'framer-motion'
import { Cpu, Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  variant?: 'products' | 'detail' | 'orders' | 'default'
}

const LoadingSpinner = ({ variant = 'default' }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
      <div className="relative">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-24 h-24 rounded-full border-2 border-slate-100 border-t-primary"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
                animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.95, 1.05, 0.95]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="text-primary"
            >
                <Cpu size={32} strokeWidth={1.5} />
            </motion.div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center"
      >
        <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 mb-2">Synchronizing</p>
        <div className="flex items-center gap-2 text-app-muted text-xs font-medium justify-center">
            <Loader2 size={12} className="animate-spin" />
            <span>Connecting to Nexus Core...</span>
        </div>
      </motion.div>
    </div>
  )
}

export default LoadingSpinner
