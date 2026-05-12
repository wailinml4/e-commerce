import { create } from 'zustand'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { Product, CreateProductInput, UpdateProductInput } from '../types'
import {
  getProductsService,
  getProductsByCategoryService,
  getFeaturedProductsService,
  createProductService,
  deleteProductService,
  toggleFeaturedProductService,
  updateProductService,
  toggleStatusService,
} from '../services/product.service'

interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  isLoading: boolean
  error: string | null
  setProducts: (products: Product[]) => void
  createProduct: (productData: CreateProductInput) => Promise<void>
  getAllProducts: () => Promise<void>
  getProductsByCategory: (category: string, minPrice?: number, maxPrice?: number, sort?: string) => Promise<void>
  deleteProduct: (productId: string) => Promise<void>
  toggleFeaturedProduct: (productId: string) => Promise<void>
  toggleStatus: (productId: string) => Promise<void>
  updateProduct: (productId: string, productData: UpdateProductInput) => Promise<void>
  getFeaturedProducts: () => Promise<void>
}

export const useProductStore = create<ProductState>(set => ({
  products: [],
  featuredProducts: [],
  isLoading: false,
  error: null,

  setProducts: products => set({ products }),

  createProduct: async productData => {
    set({ isLoading: true, error: null })
    try {
      const res = await createProductService(productData)
      set(prevState => ({
        products: [...prevState.products, res.data.data],
        isLoading: false,
        error: null,
      }))
      toast.success('Product created successfully')
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to create product'
      set({ isLoading: false, error: msg })
      toast.error(msg)
    }
  },

  getAllProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getProductsService()
      set({ products: response.data.data, isLoading: false, error: null })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch products'
      set({ isLoading: false, error: msg })
      toast.error(msg)
    }
  },

  getProductsByCategory: async (category, minPrice, maxPrice, sort) => {
    set({ isLoading: true, error: null })
    try {
      const response = await getProductsByCategoryService(category, minPrice, maxPrice, sort)
      set({ products: response.data.data, isLoading: false, error: null })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch products'
      set({ error: msg, isLoading: false })
      toast.error(msg)
    }
  },

  deleteProduct: async productId => {
    set({ error: null })
    try {
      await deleteProductService({ productId })
      set(prevProducts => ({
        products: prevProducts.products.filter(product => product.id !== productId),
        error: null,
      }))
      toast.success('Product deleted successfully')
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to delete product'
      set({ error: msg })
      toast.error(msg)
    }
  },

  toggleFeaturedProduct: async productId => {
    set({ error: null })
    try {
      const res = await toggleFeaturedProductService({ productId })
      const updatedProduct = res.data.data
      set(prev => ({
        products: prev.products.map(p => (p.id === productId ? { ...p, isFeatured: updatedProduct.isFeatured } : p)),
        featuredProducts: updatedProduct.isFeatured
          ? [...prev.featuredProducts.filter(p => p.id !== productId), updatedProduct]
          : prev.featuredProducts.filter(p => p.id !== productId),
        error: null,
      }))
      toast.success('Product updated successfully')
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to update product'
      set({ error: msg })
      toast.error(msg)
    }
  },

  toggleStatus: async productId => {
    set({ error: null })
    try {
      const response = await toggleStatusService({ productId })
      set(prevProducts => ({
        products: prevProducts.products.map(product =>
          product.id === productId ? { ...product, status: response.data.data.status } : product,
        ),
        error: null,
      }))
      toast.success('Product status updated successfully')
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to update product status'
      set({ error: msg })
      toast.error(msg)
    }
  },

  updateProduct: async (productId, productData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await updateProductService({ productId, productData })
      set(prevProducts => ({
        products: prevProducts.products.map(product => (product.id === productId ? response.data.data : product)),
        isLoading: false,
        error: null,
      }))
      toast.success('Product updated successfully')
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to update product'
      set({ isLoading: false, error: msg })
      toast.error(msg)
    }
  },

  getFeaturedProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getFeaturedProductsService()
      set({
        featuredProducts: response.data.data,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch products'
      set({ error: msg, isLoading: false })
      toast.error(msg)
    }
  },
}))
