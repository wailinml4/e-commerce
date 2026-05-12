import { create } from 'zustand'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import axiosInstance from '../config/axiosInstance'
import type { User } from '../types'
import { loginService, signupService, logoutService, checkAuthService } from '../services/auth.service'

interface AuthState {
  user: User | null
  isLoading: boolean
  checkingAuth: boolean
  error: string | null
  signup: (args: { name: string; email: string; password: string; confirmPassword: string }) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  setUser: (userData: User) => void
  refreshToken: () => Promise<unknown>
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isLoading: false,
  checkingAuth: true,
  error: null,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ isLoading: true, error: null })
    if (password !== confirmPassword) {
      set({ isLoading: false })
      toast.error('Passwords do not match')
      return
    }
    try {
      const res = await signupService({ name, email, password })
      set({ user: res.data.data, isLoading: false, error: null })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to sign up'
      set({ isLoading: false, error: msg })
      toast.error(msg)
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await loginService({ email, password })
      set({ user: res.data.data, isLoading: false, error: null })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to log in'
      set({ isLoading: false, error: msg })
      toast.error(msg)
    }
  },

  logout: async () => {
    set({ error: null })
    try {
      await logoutService()
      set({ user: null, error: null })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to log out'
      set({ error: msg })
      toast.error(msg)
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true, error: null })
    try {
      const response = await checkAuthService()
      set({ user: response.data.data, checkingAuth: false, error: null })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to check authentication'
      set({ checkingAuth: false, user: null, error: msg })
    }
  },

  setUser: userData => {
    set({ user: userData })
  },

  refreshToken: async () => {
    set({ checkingAuth: true })
    try {
      const response = await axiosInstance.post('/auth/refresh-token')
      set({ checkingAuth: false })
      return response.data
    } catch (error) {
      set({ user: null, checkingAuth: false })
      throw error
    }
  },
}))

let refreshPromise: Promise<unknown> | null = null
const AUTH_ENDPOINTS = ['/auth/login', '/auth/signup', '/auth/refresh-token']

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean
    }
    const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => originalRequest?.url?.includes(endpoint))

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      if (originalRequest) originalRequest._retry = true
      try {
        if (refreshPromise) {
          await refreshPromise
          return axiosInstance(originalRequest!)
        }
        refreshPromise = useAuthStore.getState().refreshToken()
        await refreshPromise
        return axiosInstance(originalRequest!)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      } finally {
        refreshPromise = null
      }
    }
    return Promise.reject(error)
  },
)
