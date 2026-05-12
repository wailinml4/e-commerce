import axiosInstance from '../config/axiosInstance'
import type { AxiosResponse } from 'axios'
import type { ApiResponse, CartItem, CheckoutSession } from '../types'
import { createCheckoutSchema } from '../schemas/cart.schema'

export const createCheckoutSessionService = async ({
  products,
  couponCode,
}: {
  products: CartItem[]
  couponCode?: string
}): Promise<AxiosResponse<ApiResponse<CheckoutSession>>> => {
  const parsed = createCheckoutSchema.parse({ products, couponCode })
  const response = await axiosInstance.post('/payments/create-checkout-session', parsed)
  return response
}

export const checkoutSuccessService = async ({
  sessionId,
}: {
  sessionId: string
}): Promise<AxiosResponse<ApiResponse<{ orderId: string }>>> => {
  const response = await axiosInstance.post('/payments/checkout-success', {
    sessionId,
  })
  return response
}
