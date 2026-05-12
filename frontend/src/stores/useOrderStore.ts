import { create } from 'zustand'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { Order, OrderStatus, ReturnRequestInput } from '../types'
import {
  getMyOrdersService,
  getOrderByIdService,
  getAllOrdersService,
  cancelOrderService,
  requestReturnService,
  approveReturnService,
  rejectReturnService,
  getReturnRequestsService,
  updateOrderStatusService,
} from '../services/order.service'

interface OrderState {
  orders: Order[]
  myOrders: Order[]
  returnRequests: Order[]
  isLoading: boolean
  error: string | null
  getMyOrders: () => Promise<void>
  getAllOrders: () => Promise<void>
  getOrderById: (orderId: string) => Promise<Order>
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<Order>
  cancelOrder: (orderId: string) => Promise<Order>
  requestReturn: (orderId: string, returnData: ReturnRequestInput) => Promise<Order>
  approveReturn: (orderId: string) => Promise<Order>
  rejectReturn: (orderId: string) => Promise<Order>
  getReturnRequests: () => Promise<Order[]>
}

export const useOrderStore = create<OrderState>(set => ({
  orders: [],
  myOrders: [],
  returnRequests: [],
  isLoading: false,
  error: null,

  getMyOrders: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await getMyOrdersService()
      set({ myOrders: res.data.data, isLoading: false, error: null })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch orders'
      set({ error: msg, isLoading: false })
      toast.error(msg)
    }
  },

  getAllOrders: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await getAllOrdersService()
      console.debug('useOrderStore.getAllOrders raw response:', res.data)
      set({ orders: res.data.data, isLoading: false, error: null })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch orders'
      set({ isLoading: false, error: msg })
      toast.error(msg)
    }
  },

  getOrderById: async orderId => {
    set({ isLoading: true, error: null })
    try {
      const res = await getOrderByIdService({ orderId })
      set({ isLoading: false, error: null })
      return res.data.data
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch order'
      set({ isLoading: false, error: msg })
      toast.error(msg)
      throw error
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ error: null })
    try {
      const res = await updateOrderStatusService({ orderId, status })
      set(state => ({
        orders: state.orders.map(order => (order.id === orderId ? { ...order, status } : order)),
        error: null,
      }))
      toast.success('Order status updated successfully')
      return res.data.data
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to update order status'
      set({ error: msg })
      toast.error(msg)
      throw error
    }
  },

  cancelOrder: async orderId => {
    set({ error: null })
    try {
      const res = await cancelOrderService({ orderId })
      set(state => ({
        myOrders: state.myOrders.map(order => (order.id === orderId ? { ...order, status: 'cancelled' as OrderStatus } : order)),
        error: null,
      }))
      toast.success('Order cancelled successfully')
      return res.data.data
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to cancel order'
      set({ error: msg })
      toast.error(msg)
      throw error
    }
  },

  requestReturn: async (orderId, returnData) => {
    set({ error: null })
    try {
      const res = await requestReturnService({ orderId, returnData })
      set(state => ({
        myOrders: state.myOrders.map(order => (order.id === orderId ? { ...order, returnStatus: 'requested', ...returnData } : order)),
        error: null,
      }))
      toast.success('Return request submitted successfully')
      return res.data.data
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to request return'
      set({ error: msg })
      toast.error(msg)
      throw error
    }
  },

  approveReturn: async orderId => {
    set({ error: null })
    try {
      const res = await approveReturnService({ orderId })
      set(state => ({
        orders: state.orders.map(order => (order.id === orderId ? { ...order, returnStatus: 'approved' } : order)),
        error: null,
      }))
      toast.success('Return approved successfully')
      return res.data.data
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to approve return'
      set({ error: msg })
      toast.error(msg)
      throw error
    }
  },

  rejectReturn: async orderId => {
    set({ error: null })
    try {
      const res = await rejectReturnService({ orderId })
      set(state => ({
        orders: state.orders.map(order => (order.id === orderId ? { ...order, returnStatus: 'rejected' } : order)),
        error: null,
      }))
      toast.success('Return rejected successfully')
      return res.data.data
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to reject return'
      set({ error: msg })
      toast.error(msg)
      throw error
    }
  },

  getReturnRequests: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await getReturnRequestsService()
      set({ returnRequests: res.data.data, isLoading: false, error: null })
      return res.data.data
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch return requests'
      set({ isLoading: false, error: msg })
      toast.error(msg)
      throw error
    }
  },
}))
