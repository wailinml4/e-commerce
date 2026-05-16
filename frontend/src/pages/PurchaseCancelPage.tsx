import { XCircle, ArrowLeft, LifeBuoy } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const PurchaseCancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-app-bg relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-slate-200 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-red-50 blur-[120px] rounded-full opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-lg w-full bg-white rounded-[3rem] shadow-spatial-lg overflow-hidden relative z-10 border border-slate-100"
      >
        <div className="p-10 sm:p-16 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-slate-300 border border-slate-100">
            <XCircle size={56} />
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter text-gradient-light">Acquisition Aborted</h1>
          <p className="text-app-muted text-lg font-light mb-12">Your order has been cancelled and no assets have been transferred. Your funds remain secure.</p>
          
          <div className="spatial-panel p-8 mb-12 bg-slate-50/50 flex flex-col items-center gap-4">
            <LifeBuoy className="text-primary/40" size={32} />
            <p className="text-sm text-app-muted text-center leading-relaxed">
              Encountered a technical boundary or changed your mind? Our support collective is available 24/7 to assist with your journey.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              to={'/'}
              className="w-full bg-slate-900 hover:bg-primary text-white font-black py-5 px-8 rounded-2xl transition duration-500 flex items-center justify-center gap-3 shadow-2xl hover:shadow-primary/40 group"
            >
              <ArrowLeft className="group-hover:-translate-x-2 transition-transform" size={20} />
              Return to Nexus Store
            </Link>
            <button className="text-app-muted font-bold hover:text-slate-900 transition-colors text-sm">
                Speak to an Operative
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PurchaseCancelPage
