import axiosInstance from '../config/axiosInstance'
import type { AxiosResponse } from 'axios'
import type { ApiResponse, WishlistItem } from '../types'

export const addToWishlistService = async (productId: string): Promise<AxiosResponse<ApiResponse<WishlistItem[]>>> => {
  const response = await axiosInstance.post('/wishlist', { productId })
  return response
}

export const removeFromWishlistService = async (productId: string): Promise<AxiosResponse<ApiResponse<WishlistItem[]>>> => {
  const response = await axiosInstance.delete(`/wishlist/${productId}`)
  return response
}

export const getWishlistService = async (): Promise<AxiosResponse<ApiResponse<WishlistItem[]>>> => {
  const response = await axiosInstance.get('/wishlist')
  return response
}

export const checkIfInWishlistService = async (productId: string): Promise<AxiosResponse<ApiResponse<{ inWishlist: boolean }>>> => {
  const response = await axiosInstance.get(`/wishlist/check/${productId}`)
  return response
}
