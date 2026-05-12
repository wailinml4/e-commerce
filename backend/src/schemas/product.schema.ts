import { z } from 'zod'
import { nonEmptyString, optionalPriceFiltersSchema } from './common.schema.js'
import { VALID_CATEGORIES, Category } from '../constants/categories.js'

export const productParamsSchema = z.object({
  id: z.string().uuid('Invalid product id'),
})

export const productCategoryParamsSchema = z.object({
  category: z.enum(VALID_CATEGORIES, {
    message: 'Invalid category. Must be one of: phone, laptop, tablet, audio, watch'
  }),
})

export const productCategoryQuerySchema = optionalPriceFiltersSchema

export const productSearchQuerySchema = optionalPriceFiltersSchema.extend({
  query: z.string().trim().max(100, 'Search query is too long').optional(),
  category: z.string().trim().max(100, 'Category is too long').optional(),
})

export const productSuggestionsQuerySchema = z.object({
  query: z.string().trim().max(100, 'Search query is too long').optional(),
})

export const createProductSchema = z.object({
  name: nonEmptyString('Name').max(200, 'Name is too long'),
  description: nonEmptyString('Description').max(5000, 'Description is too long'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  image: z.string().trim().optional(),
  category: z.enum(VALID_CATEGORIES, {
    message: 'Invalid category. Must be one of: phone, laptop, tablet, audio, watch'
  }),
})

export const updateProductSchema = z
  .object({
    name: nonEmptyString('Name').max(200, 'Name is too long').optional(),
    description: nonEmptyString('Description').max(5000, 'Description is too long').optional(),
    price: z.coerce.number().positive('Price must be greater than 0').optional(),
    image: z.string().trim().optional(),
    category: z.enum(VALID_CATEGORIES, {
    message: 'Invalid category. Must be one of: phone, laptop, tablet, audio, watch'
  }).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  })
  .refine(value => Object.keys(value).length > 0, 'At least one product field is required')
export type ProductParams = z.infer<typeof productParamsSchema>
export type ProductCategoryParams = z.infer<typeof productCategoryParamsSchema>
export type ProductCategoryQuery = z.infer<typeof productCategoryQuerySchema>
export type ProductSearchQuery = z.infer<typeof productSearchQuerySchema>
export type ProductSuggestionsQuery = z.infer<typeof productSuggestionsQuerySchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
