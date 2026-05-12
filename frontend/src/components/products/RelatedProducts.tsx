import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { getRelatedProductsService } from '../../services/product.service'
import ProductCard from './ProductCard'
import LoadingSpinner from '../shared/LoadingSpinner'
import type { Product } from '../../types'

const RelatedProducts = ({ productId }: { productId: string }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await getRelatedProductsService(productId)
        // Filter out duplicates by ensuring unique product IDs
        const uniqueProducts = Array.from(new Map(response.data.data.map((product: Product) => [product.id, product])).values())
        setProducts(uniqueProducts)
      } catch (error) {
        console.error('Error fetching related products:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchRelatedProducts()
    }
  }, [productId])

  useEffect(() => {
    if (!scrollRef.current || products.length === 0) return

    let scrollPosition = 0
    const scrollSpeed = 1

    const scroll = () => {
      if (scrollRef.current) {
        scrollPosition += scrollSpeed
        if (scrollPosition >= scrollRef.current.scrollWidth / 2) {
          scrollPosition = 0
        }
        scrollRef.current.scrollLeft = scrollPosition
        requestAnimationFrame(scroll)
      }
    }

    const animationId = requestAnimationFrame(scroll)

    return () => cancelAnimationFrame(animationId)
  }, [products])

  if (loading) {
    return <LoadingSpinner variant="products" />
  }

  if (products.length === 0) {
    return null
  }

  const marqueeProducts = products.length > 1 ? [...products, ...products] : products

  return (
    <div className="mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex gap-6 overflow-x-hidden"
        style={{ scrollbarWidth: 'none' }}
        ref={scrollRef}
      >
        {marqueeProducts.map(product => (
          <div key={product.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3">
            <ProductCard product={product} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default RelatedProducts
