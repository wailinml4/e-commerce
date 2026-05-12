import { create } from 'zustand'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { WishlistItem } from '../types'
import { addToWishlistService, removeFromWishlistService, getWishlistService, checkIfInWishlistService } from '../services/wishlist.service'

interface WishlistState {
  wishlist: WishlistItem[]
  isLoading: boolean
  error: string | null
  getWishlist: () => Promise<void>
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  checkIfInWishlist: (productId: string) => Promise<boolean>
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],
  isLoading: false,
  error: null,

  getWishlist: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await getWishlistService()
      const data = res.data.data
      set({
        wishlist: Array.isArray(data) ? data : ((data as { items?: WishlistItem[] }).items ?? []),
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch wishlist'
      set({ wishlist: [], isLoading: false, error: msg })
      toast.error(msg)
    }
  },

  addToWishlist: async productId => {
    set({ isLoading: true, error: null })
    try {
      await addToWishlistService(productId)
      toast.success('Product added to wishlist')
      get().getWishlist()
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to add product to wishlist'
      set({ isLoading: false, error: msg })
      toast.error(msg)
    } finally {
      set({ isLoading: false })
    }
  },

  removeFromWishlist: async productId => {
    set({ error: null })
    try {
      await removeFromWishlistService(productId)
      toast.success('Product removed from wishlist')
      set(prevState => ({
        wishlist: prevState.wishlist.filter(item => item.product.id !== productId),
        error: null,
      }))
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to remove product from wishlist'
      set({ error: msg })
      toast.error(msg)
    }
  },

  checkIfInWishlist: async productId => {
    set({ error: null })
    try {
      const res = await checkIfInWishlistService(productId)
      set({ error: null })
      return res.data.data.inWishlist
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to check wishlist'
      set({ error: msg })
      return false
    }
  },

  isInWishlist: productId => {
    const { wishlist } = get()
    return wishlist.some(item => item.product.id === productId)
  },
}))
