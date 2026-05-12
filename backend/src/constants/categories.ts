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
