import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="relative pt-32 pb-16 border-t border-slate-100 overflow-hidden bg-slate-50/50">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-3xl font-bold tracking-tighter mb-8 block text-gradient-light">nova</Link>
            <p className="text-app-muted text-lg max-w-sm mb-8 leading-relaxed">
              We are more than a store. We are a collective of visionaries building the tools for tomorrow.
            </p>
            <div className="flex gap-4">
               {[1, 2, 3, 4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all cursor-pointer shadow-sm" />
               ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-bold mb-8 uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-app-muted hover:text-primary transition-colors font-medium">Home</Link></li>
              <li><Link to="/category/all" className="text-app-muted hover:text-primary transition-colors font-medium">Store</Link></li>
              <li><Link to="/about" className="text-app-muted hover:text-primary transition-colors font-medium">About</Link></li>
              <li><Link to="/contact" className="text-app-muted hover:text-primary transition-colors font-medium">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-8 uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/shipping" className="text-app-muted hover:text-primary transition-colors font-medium">Shipping</Link></li>
              <li><Link to="/returns" className="text-app-muted hover:text-primary transition-colors font-medium">Returns</Link></li>
              <li><Link to="/privacy" className="text-app-muted hover:text-primary transition-colors font-medium">Privacy</Link></li>
              <li><Link to="/terms" className="text-app-muted hover:text-primary transition-colors font-medium">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-app-muted text-sm font-bold tracking-widest uppercase">&copy; 2024 NOVA COLLECTIVE. ALL RIGHTS RESERVED.</p>
          <div className="text-app-muted text-sm flex items-center gap-2 font-bold uppercase tracking-widest">
              MADE WITH <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-primary">❤️</motion.span> BY NOVA TEAM
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
