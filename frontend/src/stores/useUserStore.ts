import { create } from 'zustand'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import type { User, Order, UpdateProfileInput, UserRole } from '../types'
import {
  getProfileService,
  updateProfileService,
  getAllUsersService,
  deleteUserService,
  updateUserRoleService,
  getUserOrdersService,
} from '../services/user.service'

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null
  users: User[]
  isUsersLoading: boolean
  getProfile: () => Promise<void>
  updateProfile: (data: UpdateProfileInput) => Promise<User>
  getAllUsers: () => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  updateUserRole: (userId: string, role: UserRole) => Promise<void>
  getUserOrders: (userId: string) => Promise<Order[]>
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  isLoading: false,
  error: null,
  users: [],
  isUsersLoading: false,

  getProfile: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await getProfileService()
      set({ user: res.data.data, isLoading: false, error: null })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch profile'
      set({ isLoading: false, error: msg })
      toast.error(msg)
    }
  },

  updateProfile: async ({ name, email }) => {
    set({ isLoading: true, error: null })
    try {
      const res = await updateProfileService({ name, email })
      set({ user: res.data.data, isLoading: false, error: null })
      return res.data.data
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to update profile'
      set({ isLoading: false, error: msg })
      toast.error(msg)
      throw error
    }
  },

  getAllUsers: async () => {
    set({ isUsersLoading: true, error: null })
    try {
      const res = await getAllUsersService()
      set({ users: res.data.data, isUsersLoading: false, error: null })
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch users'
      set({ isUsersLoading: false, error: msg })
      toast.error(msg)
    }
  },

  deleteUser: async userId => {
    set({ error: null })
    try {
      await deleteUserService(userId)
      set(state => ({
        users: state.users.filter(u => u.id !== userId),
        error: null,
      }))
      toast.success('User deleted successfully')
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to delete user'
      set({ error: msg })
      toast.error(msg)
    }
  },

  updateUserRole: async (userId, role) => {
    set({ error: null })
    try {
      const res = await updateUserRoleService(userId, role)
      set(state => ({
        users: state.users.map(u => (u.id === userId ? { ...u, role: res.data.data.role } : u)),
        error: null,
      }))
      toast.success('User role updated successfully')
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to update user role'
      set({ error: msg })
      toast.error(msg)
    }
  },

  getUserOrders: async userId => {
    set({ error: null })
    try {
      const res = await getUserOrdersService(userId)
      set({ error: null })
      return res.data.data
    } catch (error) {
      const msg = (error as AxiosError<{ message: string }>).response?.data?.message || 'Failed to fetch user orders'
      set({ error: msg })
      toast.error(msg)
      return []
    }
  },
}))
