import type { Category, SelectOption, SortConfig } from '../types'

export const CATEGORIES: Category[] = [
  { slug: 'phone', label: 'Phone' },
  { slug: 'laptop', label: 'Laptop' },
  { slug: 'tablet', label: 'Tablet' },
  { slug: 'audio', label: 'Audio' },
  { slug: 'watch', label: 'Watch' },
]

export const getCategoryLabel = (slug: string): string => {
  const category = CATEGORIES.find(c => c.slug === slug)
  const label = category?.label ?? slug.charAt(0).toUpperCase() + slug.slice(1)
  
  // Return plural form for category page headings
  const pluralLabels: Record<string, string> = {
    'Phone': 'Phones',
    'Laptop': 'Laptops', 
    'Tablet': 'Tablets',
    'Audio': 'Audio',
    'Watch': 'Watches'
  }
  
  return pluralLabels[label] || label + 's'
}

export const getCategorySlug = (label: string): string => {
  const category = CATEGORIES.find(c => c.label.toLowerCase() === label.toLowerCase())
  return category?.slug ?? label.toLowerCase().replace(/\s+/g, '-')
}

export const CATEGORY_SLUGS = CATEGORIES.map(c => c.slug)
export const CATEGORY_LABELS = CATEGORIES.map(c => c.label)

export const DEFAULT_ITEMS_PER_PAGE = 10

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export const DEFAULT_SORT: SortConfig = {
  field: 'name',
  direction: SORT_DIRECTIONS.ASC,
}

export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
}

export const ANIMATION_DELAY = {
  NONE: 0,
  SMALL: 0.1,
  MEDIUM: 0.2,
  LARGE: 0.3,
}

export const LOGIN_TOAST_MESSAGE = 'Please login to continue'

export const STATUS_COLORS = {
  active: 'bg-green-500/20 text-green-400',
  inactive: 'bg-red-500/20 text-red-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  processing: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
  requested: 'bg-orange-500/20 text-orange-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
  featured: 'bg-yellow-500/20 text-yellow-400',
  notFeatured: 'bg-gray-500/20 text-gray-400',
}

export const ROLE_COLORS = {
  admin: 'bg-purple-900 text-purple-200',
  customer: 'bg-gray-700 text-gray-300',
}

export const ORDER_STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const RETURN_STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Status' },
  { value: 'requested', label: 'Requested' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export const ROLE_FILTER_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'customer', label: 'Customer' },
  { value: 'admin', label: 'Admin' },
]

export const DATE_RANGE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Time' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'thisYear', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
]
