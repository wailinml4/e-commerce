export type UserRole = 'customer' | 'admin'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type ReturnStatus = 'none' | 'requested' | 'approved' | 'rejected'
export type ProductStatus = 'active' | 'inactive'

export interface CheckoutSession {
  sessionId: string
  url?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  orderCount?: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  images?: string[]
  category: string
  isFeatured: boolean
  isActive: boolean
  status?: ProductStatus
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  id: string
  productId?: string
  name: string
  description: string
  price: number
  image?: string
  images: string[]
  quantity: number
}

export interface Coupon {
  id: string
  code: string
  discountPercentage: number
  expirationDate: string
  isActive: boolean
}

export interface OrderItem {
  id: string
  productId?: string
  name: string
  image: string
  price: number
  quantity: number
  product?: {
    id: string
    name: string
    images?: string[]
  }
}

export interface Order {
  id: string
  userId?: string
  user?: {
    id: string
    name: string
    email: string
  }
  totalAmount: number
  status: OrderStatus
  orderItems: OrderItem[]
  returnStatus?: ReturnStatus
  returnReason?: string
  returnDescription?: string
  returnRequestedAt?: string
  stripeSessionId?: string
  couponCode?: string
  discount?: number
  createdAt: string
  updatedAt?: string
}

export interface WishlistItem {
  id: string
  productId: string
  createdAt?: string
  product: {
    id: string
    name: string
    price: number | string
    image?: string
    images?: string[]
    description?: string
  }
}

export interface Suggestion {
  id: string
  name: string
  image?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedApiResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages?: number
}

export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

export interface SelectOption {
  value: string
  label: string
}

export interface Category {
  slug: string
  label: string
}

export interface CreateProductInput {
  name: string
  description: string
  price: string | number
  category: string
  image: string
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface UpdateProfileInput {
  name: string
  email: string
}

export interface ReturnRequestInput {
  returnReason: string
  returnDescription?: string
}

export interface GetProductsParams {
  search?: string
  category?: string
  sort?: string
  page?: number
  limit?: number
}

export interface GetOrdersParams {
  search?: string
  status?: string
  dateRange?: string
  sort?: string
  page?: number
  limit?: number
}

export interface GetProductsByCategoryParams {
  minPrice?: number
  maxPrice?: number
  sort?: string
  page?: number
  limit?: number
}

export interface SearchProductsParams {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
}

export interface DailyOrdersParams {
  startDate?: string
  endDate?: string
}
