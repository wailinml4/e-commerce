import axiosInstance from '../config/axiosInstance'
import type { AxiosResponse } from 'axios'
import type { ApiResponse, User, Order, UpdateProfileInput, UserRole } from '../types'
import updateProfileSchema from '../schemas/user.schema'

export const getProfileService = async (): Promise<AxiosResponse<ApiResponse<User>>> => {
  const response = await axiosInstance.get('/users/profile')
  return response
}

export const updateProfileService = async (userData: UpdateProfileInput): Promise<AxiosResponse<ApiResponse<User>>> => {
  updateProfileSchema.parse(userData)
  const response = await axiosInstance.put('/users/profile', userData)
  return response
}

export const getAllUsersService = async (): Promise<AxiosResponse<ApiResponse<User[]>>> => {
  const response = await axiosInstance.get('/users')
  return response
}

export const deleteUserService = async (userId: string): Promise<AxiosResponse<ApiResponse<null>>> => {
  const response = await axiosInstance.delete(`/users/${userId}`)
  return response
}

export const updateUserRoleService = async (userId: string, role: UserRole): Promise<AxiosResponse<ApiResponse<User>>> => {
  const response = await axiosInstance.put(`/users/${userId}/role`, { role })
  return response
}

export const getUserOrdersService = async (userId: string): Promise<AxiosResponse<ApiResponse<Order[]>>> => {
  const response = await axiosInstance.get(`/users/${userId}/orders`)
  return response
}
