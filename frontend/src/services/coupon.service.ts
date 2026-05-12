import axiosInstance from '../config/axiosInstance'
import type { AxiosResponse } from 'axios'
import type { ApiResponse, Coupon } from '../types'

export const getCouponService = async (): Promise<AxiosResponse<ApiResponse<Coupon | null>>> => {
  const response = await axiosInstance.get('/coupons')
  return response
}

export const validateCouponService = async ({ code }: { code: string }): Promise<AxiosResponse<ApiResponse<Coupon>>> => {
  const response = await axiosInstance.post('/coupons/validate', { code })
  return response
}
