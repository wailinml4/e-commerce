import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Cpu, Sparkles, Shield, Zap } from 'lucide-react'
import { useProductStore } from '../stores/useProductStore'
import FeaturedProducts from '../components/products/FeaturedProducts'
import LatestProducts from '../components/products/LatestProducts'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const HomePage = () => {
  const { getFeaturedProducts, featuredProducts, isLoading } = useProductStore()
  const [, setHeroImageLoaded] = useState(false)

  useEffect(() => {
    getFeaturedProducts()
  }, [getFeaturedProducts])

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <div className="min-h-screen bg-app-bg text-slate-900 selection:bg-primary/10">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative h-[90vh] flex items-center justify-center overflow-hidden"
        id="hero"
      >
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] animate-pulse-slow rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 blur-[120px] animate-pulse-slow rounded-full delay-1000" />
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase border border-slate-200 rounded-full bg-white/50 backdrop-blur-md text-primary animate-glow-pulse">
              Innovation Redefined
            </span>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter leading-tight text-gradient-light">
              The Future of <br />
              <span className="text-primary italic">Digital Craft</span>
            </h1>
            <p className="text-xl md:text-2xl text-app-muted mb-12 font-light max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of technology with our curated collection of premium devices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/category/all"
                className="group relative inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-primary transition-all duration-500 hover:shadow-[0_20px_40px_rgba(79,70,229,0.2)]"
              >
                Shop Collection
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/search?q=new"
                className="glass-button px-10 py-5 text-lg font-bold hover:border-slate-300"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating elements background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
            <motion.div 
                animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/3 left-10 text-primary"
            >
                <Cpu size={120} strokeWidth={0.5} />
            </motion.div>
            <motion.div 
                animate={{ 
                    y: [0, 20, 0],
                    rotate: [0, -5, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-20 text-accent"
            >
                <Sparkles size={100} strokeWidth={0.5} />
            </motion.div>
        </div>
      </motion.section>

      {/* Featured Section */}
      <div className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-gradient-light">Featured Products</h2>
            <p className="text-app-muted text-lg max-w-xl mx-auto">Discover our curated selection of premium technology and innovative devices.</p>
          </motion.div>

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <FeaturedProducts featuredProducts={featuredProducts} />
          )}
        </div>
      </div>

      {/* Stats/Features Section */}
      <section className="py-24 border-y border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
                { icon: <Zap className="text-primary" />, title: "Hyper Fast Delivery", desc: "Global shipping in under 48 hours for elite members." },
                { icon: <Shield className="text-accent" />, title: "Obsidian Security", desc: "Military grade encryption for every transaction you make." },
                { icon: <Sparkles className="text-slate-900" />, title: "Infinite Warranty", desc: "Lifetime support and repairs for all premium products." }
            ].map((feature, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center text-center group"
                >
                    <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-app-muted text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Latest Products */}
      <div className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gradient-light">New Arrivals</h2>
                <p className="text-app-muted text-lg">The latest drops from our design labs, fresh and ready for you.</p>
            </div>
            <Link to="/category/all" className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-slate-900 transition-colors group">
                View All <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <LatestProducts />
        </div>
      </div>

    </div>
  )
}


export default HomePage
