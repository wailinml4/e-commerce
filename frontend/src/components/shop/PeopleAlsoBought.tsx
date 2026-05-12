import { useEffect, useState, useRef } from 'react'
import type { AxiosError } from 'axios'
import { motion } from 'framer-motion'
import ProductCard from '../products/ProductCard'
import axiosInstance from '../../config/axiosInstance'
import toast from 'react-hot-toast'
import LoadingSpinner from '../shared/LoadingSpinner'
import type { Product } from '../../types'

interface PeopleAlsoBoughtProps {
  productId: string
}

const PeopleAlsoBought = ({ productId }: PeopleAlsoBoughtProps) => {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!productId) return

    const fetchRecommendations = async () => {
      try {
        const res = await axiosInstance.get(`/products/${productId}/related`)
        setRecommendations(res.data.data)
      } catch (error) {
        toast.error(
          (error as AxiosError<{ message: string }>).response?.data?.message || 'An error occurred while fetching recommendations',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [productId])

  useEffect(() => {
    if (!scrollRef.current || recommendations.length === 0) return

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
  }, [recommendations])

  if (isLoading) return <LoadingSpinner variant="products" />

  if (recommendations.length === 0) {
    return null
  }

  const marqueeProducts = recommendations.length > 1 ? [...recommendations, ...recommendations] : recommendations

  return (
    <div className="mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h3 className="text-2xl font-semibold text-gray-900">People also bought</h3>
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

export default PeopleAlsoBought
