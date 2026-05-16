import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { getLatestProductsService } from '../../services/product.service'
import ProductCard from './ProductCard'
import LoadingSpinner from '../shared/LoadingSpinner'
import type { Product } from '../../types'

const LatestProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await getLatestProductsService()
        const fetched = response.data.data || []
        const uniqueProducts = Array.from(new Map(fetched.map(p => [p.id, p])).values())
        setProducts(uniqueProducts)
      } catch (error) {
        console.error('Error fetching latest products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestProducts()
  }, [])

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex gap-10 overflow-x-hidden"
      style={{ scrollbarWidth: 'none' }}
      ref={scrollRef}
    >
      {marqueeProducts.map(product => (
        <div key={product.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3">
          <ProductCard product={product} />
        </div>
      ))}
    </motion.div>
  )
}

export default LatestProducts
