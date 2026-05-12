import axiosInstance from '../config/axiosInstance'
import type { AxiosResponse } from 'axios'
import type { ApiResponse, Order, GetOrdersParams, ReturnRequestInput, OrderStatus } from '../types'
import { requestReturnSchema } from '../schemas/order.schema'

export const getMyOrdersService = async (): Promise<AxiosResponse<ApiResponse<Order[]>>> => {
  const response = await axiosInstance.get('/orders/my-orders')
  return response
}

export const getOrderByIdService = async ({ orderId }: { orderId: string }): Promise<AxiosResponse<ApiResponse<Order>>> => {
  const response = await axiosInstance.get(`/orders/${orderId}`)
  return response
}

export const getAllOrdersService = async ({
  search = '',
  status = '',
  dateRange = 'all',
  sort = '',
  page = 1,
  limit = 10,
}: GetOrdersParams = {}): Promise<AxiosResponse<ApiResponse<Order[]>>> => {
  const params: Record<string, unknown> = {}
  if (search) params.search = search
  if (status) params.status = status
  if (dateRange) params.dateRange = dateRange
  if (sort) params.sort = sort
  params.page = page
  params.limit = limit
  const response = await axiosInstance.get('/orders', { params })
  return response
}

export const getOrderByIdAdminService = async ({ orderId }: { orderId: string }): Promise<AxiosResponse<ApiResponse<Order>>> => {
  const response = await axiosInstance.get(`/orders/${orderId}`)
  return response
}

export const updateOrderStatusService = async ({ orderId, status }: { orderId: string; status: OrderStatus }): Promise<AxiosResponse<ApiResponse<Order>>> => {
  const response = await axiosInstance.put(`/orders/${orderId}/status`, {
    status,
  })
  return response
}

export const cancelOrderService = async ({ orderId }: { orderId: string }): Promise<AxiosResponse<ApiResponse<Order>>> => {
  const response = await axiosInstance.post(`/orders/${orderId}/cancel`)
  return response
}

export const requestReturnService = async ({ orderId, returnData }: { orderId: string; returnData: ReturnRequestInput }): Promise<AxiosResponse<ApiResponse<Order>>> => {
  requestReturnSchema.parse(returnData)
  const response = await axiosInstance.post(`/orders/${orderId}/request-return`, returnData)
  return response
}

export const approveReturnService = async ({ orderId }: { orderId: string }): Promise<AxiosResponse<ApiResponse<Order>>> => {
  const response = await axiosInstance.put(`/orders/${orderId}/approve-return`)
  return response
}

export const rejectReturnService = async ({ orderId }: { orderId: string }): Promise<AxiosResponse<ApiResponse<Order>>> => {
  const response = await axiosInstance.put(`/orders/${orderId}/reject-return`)
  return response
}

export const getReturnRequestsService = async (): Promise<AxiosResponse<ApiResponse<Order[]>>> => {
  const response = await axiosInstance.get('/orders/returns')
  return response
}
