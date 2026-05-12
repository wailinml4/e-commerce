import axiosInstance from '../config/axiosInstance'
import type { AxiosResponse } from 'axios'
import type { ApiResponse, CartItem } from '../types'

export const getCartItemsService = async (): Promise<AxiosResponse<ApiResponse<CartItem[]>>> => {
  const response = await axiosInstance.get('/cart')
  return response
}

export const addToCartService = async ({
  productId,
  quantity = 1,
}: {
  productId: string
  quantity?: number
}): Promise<AxiosResponse<ApiResponse<CartItem[]>>> => {
  const response = await axiosInstance.post('/cart', { productId, quantity })
  return response
}

export const removeFromCartService = async (productId: string): Promise<AxiosResponse<ApiResponse<CartItem[]>>> => {
  const response = await axiosInstance.delete(`/cart/${productId}`)
  return response
}

export const updateQuantityService = async ({
  productId,
  quantity,
}: {
  productId: string
  quantity: number
}): Promise<AxiosResponse<ApiResponse<CartItem[]>>> => {
  const response = await axiosInstance.put(`/cart/${productId}`, { quantity })
  return response
}

export const clearCartService = async (): Promise<AxiosResponse<ApiResponse<CartItem[]>>> => {
  const response = await axiosInstance.delete('/cart')
  return response
}
