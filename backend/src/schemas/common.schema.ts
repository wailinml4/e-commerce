import { z } from 'zod'

export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid id'),
})

export const productIdParamSchema = z.object({
  productId: z.string().uuid('Invalid product id'),
})

export const optionalPriceFiltersSchema = z.object({
  minPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid minimum price')
    .optional(),
  maxPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid maximum price')
    .optional(),
  sort: z.enum(['price', '-price', 'createdAt', '-createdAt', 'name']).optional(),
})

export const nonEmptyString = (fieldName = 'Field') => z.string().trim().min(1, `${fieldName} is required`)

export type UuidParam = z.infer<typeof uuidParamSchema>
export type ProductIdParam = z.infer<typeof productIdParamSchema>
export type OptionalPriceFilters = z.infer<typeof optionalPriceFiltersSchema>
