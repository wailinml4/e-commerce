import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { CartItem, Coupon, Product } from '../types'
import {
  getCartItemsService,
  addToCartService,
  removeFromCartService,
  updateQuantityService,
  clearCartService,
} from '../services/cart.service'
import { getCouponService, validateCouponService } from '../services/coupon.service'
import { useAuthStore } from './useAuthStore'
import { LOGIN_TOAST_MESSAGE } from '../constants'

interface CartState {
  cart: CartItem[]
  coupon: Coupon | null
  total: number
  subtotal: number
  isCouponApplied: boolean
  isLoading: boolean
  error: string | null
  getMyCoupon: () => Promise<void>
  applyCoupon: (code: string) => Promise<void>
  removeCoupon: () => void
  getCartItems: () => Promise<void>
  clearCart: () => Promise<void>
  resetCart: () => void
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  calculateTotals: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  isLoading: false,
  error: null,

  getMyCoupon: async () => {
    set({ error: null })
    try {
      const response = await getCouponService()
      set({ coupon: response.data.data, error: null })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch coupon'
      set({ error: msg })
      toast.error(msg)
    }
  },

  applyCoupon: async code => {
    set({ error: null })
    try {
      const response = await validateCouponService({ code })
      set({ coupon: response.data.data, isCouponApplied: true, error: null })
      get().calculateTotals()
      toast.success('Coupon applied successfully')
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to apply coupon'
      set({ error: msg })
      toast.error(msg)
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false, error: null })
    get().calculateTotals()
    toast.success('Coupon removed successfully')
  },

  getCartItems: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await getCartItemsService()
      set({ cart: res.data.data, isLoading: false, error: null })
      get().calculateTotals()
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch cart'
      set({ cart: [], isLoading: false, error: msg })
      toast.error(msg)
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await clearCartService()
      set({
        cart: response.data.data,
        coupon: null,
        isCouponApplied: false,
        total: 0,
        subtotal: 0,
        isLoading: false,
        error: null,
      })
      toast.success('Cart cleared successfully')
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to clear cart'
      set({ isLoading: false, error: msg })
      toast.error(msg)
    }
  },

  resetCart: () => {
    set({
      cart: [],
      coupon: null,
      isCouponApplied: false,
      total: 0,
      subtotal: 0,
      error: null,
    })
  },

  addToCart: async (product, quantity = 1) => {
    const user = useAuthStore.getState().user
    if (!user) {
      toast.error(LOGIN_TOAST_MESSAGE, { id: 'login' })
      return
    }
    set({ isLoading: true, error: null })
    try {
      await addToCartService({ productId: product.id, quantity })
      toast.success('Product added to cart')
      get().getCartItems()
      get().calculateTotals()
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to add product to cart'
      set({ isLoading: false, error: msg })
      toast.error(msg)
    } finally {
      set({ isLoading: false })
    }
  },

  removeFromCart: async productId => {
    set({ isLoading: true, error: null })
    try {
      await removeFromCartService(productId)
      set(prevState => ({
        cart: prevState.cart.filter(item => item.id !== productId),
        error: null,
      }))
      get().calculateTotals()
      toast.success('Product removed from cart')
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to remove product from cart'
      set({ isLoading: false, error: msg })
      toast.error(msg)
    } finally {
      set({ isLoading: false })
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId)
      return
    }
    set({ isLoading: true, error: null })
    try {
      await updateQuantityService({ productId, quantity })
      set(prevState => ({
        cart: prevState.cart.map(item => (item.id === productId ? { ...item, quantity } : item)),
        error: null,
      }))
      get().calculateTotals()
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to update quantity'
      set({ isLoading: false, error: msg })
      toast.error(msg)
    } finally {
      set({ isLoading: false })
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get()
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    let total = subtotal
    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100)
      total = subtotal - discount
    }
    set({ subtotal, total })
  },
}))
