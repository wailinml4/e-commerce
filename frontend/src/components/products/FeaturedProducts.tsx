import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import type { Product } from '../../types'

const FeaturedProducts = ({ featuredProducts }: { featuredProducts: Product[] }) => {
  if (!featuredProducts || featuredProducts.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
    >
      {featuredProducts.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  )
}
export default FeaturedProducts
