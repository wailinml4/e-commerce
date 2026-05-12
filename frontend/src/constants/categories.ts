export const VALID_CATEGORIES = [
  'phone',
  'laptop', 
  'tablet',
  'audio',
  'watch'
] as const

export type Category = typeof VALID_CATEGORIES[number]

export const CATEGORY_DISPLAY_NAMES: Record<Category, string> = {
  phone: 'Phone',
  laptop: 'Laptop',
  tablet: 'Tablet',
  audio: 'Audio',
  watch: 'Watch'
}

export const CATEGORY_PLURAL_DISPLAY_NAMES: Record<Category, string> = {
  phone: 'Phones',
  laptop: 'Laptops',
  tablet: 'Tablets',
  audio: 'Audio',
  watch: 'Watches'
}

export const capitalizeCategory = (category: string): string => {
  return CATEGORY_DISPLAY_NAMES[category as Category] || category.charAt(0).toUpperCase() + category.slice(1)
}

export const capitalizeCategoryPlural = (category: string): string => {
  return CATEGORY_PLURAL_DISPLAY_NAMES[category as Category] || category.charAt(0).toUpperCase() + category.slice(1) + 's'
}
