import { Request } from 'express'

export interface BaseDocument {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface IUser {
  name: string
  email: string
  password: string
  role: 'customer' | 'admin'
}

export interface IUserDocument extends BaseDocument, IUser {
  comparePassword(candidatePassword: string): Promise<boolean>
}

export interface IProduct {
  name: string
  description: string
  price: number
  category: string
  brand: string | null
  images: string[]
  ratings: number
  numReviews: number
  isFeatured?: boolean
  status: 'active' | 'inactive'
}

export interface IProductDocument extends BaseDocument, IProduct {}

export interface ICartItem {
  product: string
  quantity: number
  price: number
}

export interface ICart {
  user: string
  items: ICartItem[]
  totalAmount: number
}

export interface ICartDocument extends BaseDocument, ICart {}

export interface IOrderItem {
  product: string
  name: string
  quantity: number
  price: number
  image: string
}

export interface IOrder {
  user: string
  orderItems: IOrderItem[]
  totalAmount: number
  stripeSessionId: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  returnReason?: string
  returnDescription?: string
  returnStatus?: 'none' | 'requested' | 'approved' | 'rejected'
  returnRequestedAt?: Date
  returnProcessedAt?: Date
}

export interface IOrderDocument extends BaseDocument, IOrder {}

export interface ICoupon {
  code: string
  discountPercentage: number
  expiryDate: Date
  isActive: boolean
  userId: string
}

export interface ICouponDocument extends BaseDocument, ICoupon {}

export interface IPayment {
  order: string
  user: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  method: 'stripe' | 'paypal' | 'cod'
  paymentProvider: string
  providerSessionId?: string
  providerTransactionId?: string
  failureReason?: string
  metadata?: Record<string, unknown>
  stripePaymentIntentId?: string
  refundId?: string
}

export interface IPaymentDocument extends BaseDocument, IPayment {}

export interface IWishlistItem {
  product: string
  addedAt: Date
}

export interface IWishlist {
  user: string
  items: IWishlistItem[]
}

export interface IWishlistDocument extends BaseDocument, IWishlist {}

export interface JWTPayload {
  userId: string
  iat?: number
  exp?: number
}

export interface AuthenticatedRequest extends Request {
  user?: IUserDocument
}

export interface CustomError extends Error {
  statusCode?: number
  code?: string
}

export interface EnvConfig {
  NODE_ENV: string
  PORT: string
  DATABASE_URL: string
  REDIS_URL: string
  JWT_SECRET: string
  JWT_REFRESH_SECRET: string
  ACCESS_TOKEN_SECRET: string
  REFRESH_TOKEN_SECRET: string
  STRIPE_SECRET_KEY: string
  STRIPE_PUBLISHABLE_KEY: string
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
  FRONTEND_URL: string
}

export interface IAnalytics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  topProducts: Array<{
    productId: string
    name: string
    sales: number
    revenue: number
  }>
  recentOrders: IOrderDocument[]
  salesByPeriod: Array<{
    period: string
    sales: number
    revenue: number
  }>
}

export interface IAnalyticsDocument extends BaseDocument, IAnalytics {}

export interface HydratedOrderItem {
  id: string
  orderId: string
  productId: string
  name: string
  quantity: number
  price: number
  image: string
  createdAt: Date
  updatedAt: Date
  product: IProductDocument
}

export interface HydratedOrder {
  id: string
  userId: string
  user: { id: string; name: string; email: string } | null
  totalAmount: number
  stripeSessionId: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  returnReason: string | null
  returnDescription: string | null
  returnStatus: 'none' | 'requested' | 'approved' | 'rejected'
  returnRequestedAt: Date | null
  returnProcessedAt: Date | null
  createdAt: Date
  updatedAt: Date
  orderItems: HydratedOrderItem[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  createdAt?: Date
  updatedAt?: Date
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: IUserDocument
  accessToken: string
  refreshToken: string
}

export interface SignupData {
  email: string
  password: string
  name: string
}

export interface LoginData {
  email: string
  password: string
}

export interface CartItemResponse {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand?: string
  images: string[]
  ratings: number
  numReviews: number
  isFeatured: boolean
  quantity: number
  createdAt: Date
  updatedAt: Date
}

export interface SearchParams {
  query?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  image?: string
  category: string
}

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  image: string
  category: string
  status?: string
}

export interface UpdateProductData {
  name?: string
  description?: string
  price?: number
  image?: string
  category?: string
  status?: string
}

export interface ReturnRequestData {
  returnReason: string
  returnDescription: string
}

export interface ProductData {
  id: string
  name: string
  image: string
  price: number
  quantity: number
}

export interface CheckoutSessionResponse {
  id: string
  url: string
  totalAmount: number
}

export interface CheckoutSuccessResponse {
  success: boolean
  message: string
  orderId: string
}

export interface HydratedWishlistItem {
  product: any
  addedAt: Date
}

export interface HydratedWishlist {
  id: string
  user: string
  items: HydratedWishlistItem[]
}

export interface UpdateProfileData {
  name?: string
  email?: string
}

export interface DateRanges {
  todayStart: Date
  monthStart: Date
  yearStart: Date
}

export interface AnalyticsData {
  users: number
  products: number
  totalOrders: number
  totalRevenue: number
}

export interface DailyOrderData {
  date: string
  orders: number
  revenue: number
}

export interface DashboardMetrics {
  today: {
    revenue: number
    products: number
    orders: number
    returns: number
    customers: number
  }
  thisMonth: {
    revenue: number
    products: number
    orders: number
    returns: number
    customers: number
  }
  thisYear: {
    revenue: number
    products: number
    orders: number
    returns: number
    customers: number
  }
}

export interface TrendData {
  revenue: Array<{ id: string; revenue: number }>
  orders: Array<{ id: string; orders: number }>
  returns: Array<{ id: string; returns: number }>
  customers: Array<{ id: string; customers: number }>
}

export interface NewItemsData {
  products: any[]
  orders: any[]
  returns: any[]
  customers: any[]
}

export interface TopSellingProduct {
  name: string
  images: string[]
  price: number
  totalSold: number
  totalRevenue: number
}

export interface TopCustomer {
  name: string
  email: string
  totalSpent: number
  totalOrders: number
}

export interface HighReturnProduct {
  name: string
  images: string[]
  price: number
  totalReturns: number
  returnRate: number
}

export interface InsightsData {
  topSellingProducts: TopSellingProduct[]
  topCustomers: TopCustomer[]
  highReturnProducts: HighReturnProduct[]
}
