import axiosInstance from '../config/axiosInstance'
import type { AxiosResponse } from 'axios'
import type { ApiResponse, User } from '../types'
import { loginSchema, signupSchema } from '../schemas/auth.schema'

export const loginService = async ({ email, password }: { email: string; password: string }): Promise<AxiosResponse<ApiResponse<User>>> => {
  const parsed = loginSchema.parse({ email, password })
  const response = await axiosInstance.post('/auth/login', {
    email: parsed.email,
    password: parsed.password,
  })
  return response
}

export const signupService = async ({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}): Promise<AxiosResponse<ApiResponse<User>>> => {
  const parsed = signupSchema.parse({ name, email, password })
  const response = await axiosInstance.post('/auth/signup', {
    name: parsed.name,
    email: parsed.email,
    password: parsed.password,
  })
  return response
}

export const logoutService = async (): Promise<AxiosResponse<ApiResponse<null>>> => {
  const response = await axiosInstance.post('/auth/logout')
  return response
}

export const checkAuthService = async (): Promise<AxiosResponse<ApiResponse<User>>> => {
  const response = await axiosInstance.get('/auth/check')
  return response
}
