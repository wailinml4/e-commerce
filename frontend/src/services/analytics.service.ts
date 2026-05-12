import axiosInstance from '../config/axiosInstance'
import type { AxiosResponse } from 'axios'
import type { ApiResponse, DailyOrdersParams } from '../types'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
}

interface DailyOrderData {
  date: string
  orders: number
  revenue: number
}

interface DashboardMetrics {
  revenue: number
  orders: number
  products: number
  users: number
}

interface DashboardTrends {
  period: string
  data: { label: string; value: number }[]
}

interface DashboardNewItems {
  newUsers: number
  newOrders: number
  newProducts: number
}

interface DashboardInsights {
  topProducts: { id: string; name: string; revenue: number }[]
  categoryBreakdown: { category: string; count: number }[]
}

export const getAnalyticsDataService = async (): Promise<AxiosResponse<ApiResponse<AnalyticsData>>> => {
  const response = await axiosInstance.get('/analytics')
  return response
}

export const getDailyOrdersDataService = async ({
  startDate,
  endDate,
}: DailyOrdersParams): Promise<AxiosResponse<ApiResponse<DailyOrderData[]>>> => {
  const params: Record<string, string> = {}
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate
  const response = await axiosInstance.get('/analytics/orders', { params })
  return response
}

export const getDashboardMetricsService = async (): Promise<AxiosResponse<ApiResponse<DashboardMetrics>>> => {
  const response = await axiosInstance.get('/analytics/dashboard/metrics')
  return response
}

export const getDashboardTrendsService = async (period = 'monthly'): Promise<AxiosResponse<ApiResponse<DashboardTrends>>> => {
  const response = await axiosInstance.get('/analytics/dashboard/trends', {
    params: { period },
  })
  return response
}

export const getDashboardNewItemsService = async (): Promise<AxiosResponse<ApiResponse<DashboardNewItems>>> => {
  const response = await axiosInstance.get('/analytics/dashboard/new-items')
  return response
}

export const getDashboardInsightsService = async (): Promise<AxiosResponse<ApiResponse<DashboardInsights>>> => {
  const response = await axiosInstance.get('/analytics/dashboard/insights')
  return response
}
