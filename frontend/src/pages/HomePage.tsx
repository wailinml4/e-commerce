import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Cpu } from 'lucide-react'
import { useProductStore } from '../stores/useProductStore'
import FeaturedProducts from '../components/products/FeaturedProducts'
import LatestProducts from '../components/products/LatestProducts'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { VALID_CATEGORIES, capitalizeCategory } from '../constants/categories'

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
        staggerChildren: 0.15,
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

  const wordContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden -mt-24 md:-mt-32"
        id="hero"
      >
        <div className="absolute inset-0 bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80"
            alt="Hero"
            className="w-full h-full object-cover opacity-90"
            onLoad={() => setHeroImageLoaded(true)}
          />
        </div>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            variants={wordContainerVariants}
            initial="hidden"
            animate="visible"
            className="text-6xl md:text-8xl font-light text-white mb-6 tracking-tight"
          >
            {'Elevate Your Tech'.split(' ').map((word, index) => (
              <motion.span key={index} variants={wordVariants} className="inline-block mr-[0.25em]">
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            variants={wordContainerVariants}
            initial="hidden"
            animate="visible"
            className="text-xl md:text-2xl text-gray-100 mb-10 font-light"
          >
            {'Discover cutting-edge technology crafted for the modern innovator'.split(' ').map((word, index) => (
              <motion.span key={index} variants={wordVariants} className="inline-block mr-[0.25em]">
                {word}
              </motion.span>
            ))}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/category/phone"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              {'Explore Tech'.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: [0, 1, 0, 1, 0, 1],
                    y: [30, 0, 0, 0, 0, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.7 + index * 0.05,
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/category/laptop"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors duration-300"
            >
              {'Discover More'.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: [0, 1, 0, 1, 0, 1],
                    y: [30, 0, 0, 0, 0, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.7 + index * 0.05,
                    times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {isLoading ? (
        <LoadingSpinner variant="products" />
      ) : (
        featuredProducts.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="py-24"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div variants={itemVariants} className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-light mb-4">Featured Technology</h2>
                <p className="text-gray-600 font-light">Curated tech that defines innovation</p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <FeaturedProducts featuredProducts={featuredProducts} />
              </motion.div>
            </div>
          </motion.div>
        )
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="py-24"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4">New Arrivals</h2>
            <p className="text-gray-600 font-light">Latest tech innovations just for you</p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <LatestProducts />
          </motion.div>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 px-4 bg-black text-white"
        id="cta"
      >
        <div className="max-w-4xl mx-auto text-center">
          <Cpu size={64} className="mx-auto mb-6 text-gray-400" />
          <h2 className="text-4xl md:text-5xl font-light mb-4">Ready to Innovate?</h2>
          <p className="text-gray-400 mb-8 font-light">Explore our full collection and find your perfect tech solution</p>
          <Link
            to="/category/phone"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors duration-300"
          >
            Browse Tech
            <ArrowRight size={20} />
          </Link>
        </div>
      </motion.section>

      <footer className="bg-gray-100 py-16 px-4" id="footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="font-semibold mb-4">nova</h3>
            <p className="text-gray-600 font-light text-sm">Elevating technology with cutting-edge solutions for the modern innovator.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {VALID_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link to={`/category/${category}`} className="hover:text-gray-900 transition-colors">
                    {capitalizeCategory(category)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/about" className="hover:text-gray-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/terms" className="hover:text-gray-900 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>&copy; 2024 nova. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
export default HomePage
