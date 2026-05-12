import axiosInstance from '../config/axiosInstance'
import type { AxiosResponse } from 'axios'
import type { ApiResponse, Product, CreateProductInput, UpdateProductInput, GetProductsParams, SearchProductsParams } from '../types'
import { createProductSchema } from '../schemas/product.schema'

export const getProductsService = async ({ search = '', category = '', sort = '', page = 1, limit = 10 }: GetProductsParams = {}): Promise<
  AxiosResponse<ApiResponse<Product[]>>
> => {
  const params: Record<string, unknown> = {}
  if (search) params.search = search
  if (category) params.category = category
  if (sort) params.sort = sort
  params.page = page
  params.limit = limit
  const response = await axiosInstance.get('/products', { params })
  return response
}

export const getProductByIdService = async (productId: string): Promise<AxiosResponse<ApiResponse<Product>>> => {
  const response = await axiosInstance.get(`/products/${productId}`)
  return response
}

export const getProductsByCategoryService = async (
  category: string,
  minPrice?: number,
  maxPrice?: number,
  sort = '-createdAt',
  page = 1,
  limit = 10,
): Promise<AxiosResponse<ApiResponse<Product[]>>> => {
  const params: Record<string, unknown> = { page, limit, sort }
  if (minPrice !== undefined) params.minPrice = minPrice
  if (maxPrice !== undefined) params.maxPrice = maxPrice
  const response = await axiosInstance.get(`/products/category/${category}`, {
    params,
  })
  return response
}

export const getFeaturedProductsService = async (): Promise<AxiosResponse<ApiResponse<Product[]>>> => {
  const response = await axiosInstance.get('/products/featured')
  return response
}

export const getRelatedProductsService = async (productId: string): Promise<AxiosResponse<ApiResponse<Product[]>>> => {
  const response = await axiosInstance.get(`/products/${productId}/related`)
  return response
}

export const createProductService = async (productData: CreateProductInput): Promise<AxiosResponse<ApiResponse<Product>>> => {
  const parsed = createProductSchema.parse(productData)
  const response = await axiosInstance.post('/products', parsed)
  return response
}

export const updateProductService = async ({
  productId,
  productData,
}: {
  productId: string
  productData: UpdateProductInput
}): Promise<AxiosResponse<ApiResponse<Product>>> => {
  const response = await axiosInstance.put(`/products/${productId}`, productData)
  return response
}

export const deleteProductService = async ({ productId }: { productId: string }): Promise<AxiosResponse<ApiResponse<null>>> => {
  const response = await axiosInstance.delete(`/products/${productId}`)
  return response
}

export const toggleFeaturedProductService = async ({ productId }: { productId: string }): Promise<AxiosResponse<ApiResponse<Product>>> => {
  const response = await axiosInstance.patch(`/products/${productId}/toggle-featured`)
  return response
}

export const toggleStatusService = async ({ productId }: { productId: string }): Promise<AxiosResponse<ApiResponse<Product>>> => {
  const response = await axiosInstance.patch(`/products/${productId}/toggle-status`)
  return response
}

export const searchProductsService = async ({
  query,
  category,
  minPrice,
  maxPrice,
  sort,
}: SearchProductsParams): Promise<AxiosResponse<ApiResponse<Product[]>>> => {
  const params: Record<string, unknown> = {}
  if (query) params.query = query
  if (category) params.category = category
  if (minPrice !== undefined) params.minPrice = minPrice
  if (maxPrice !== undefined) params.maxPrice = maxPrice
  if (sort) params.sort = sort
  const response = await axiosInstance.get('/products/search', { params })
  return response
}

export const getSuggestionsService = async ({
  query,
}: {
  query: string
}): Promise<AxiosResponse<ApiResponse<{ id: string; name: string; image?: string }[]>>> => {
  const response = await axiosInstance.get('/products/suggestions', {
    params: { query: query },
  })
  return response
}

export const getLatestProductsService = async (): Promise<AxiosResponse<ApiResponse<Product[]>>> => {
  const response = await axiosInstance.get('/products/latest')
  return response
}
