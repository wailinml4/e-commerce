import { z } from 'zod'
import { nonEmptyString } from './common.schema'
import { VALID_CATEGORIES } from '../constants/categories'

export const createProductSchema = z.object({
  name: nonEmptyString('Name').max(200, 'Name is too long'),
  description: nonEmptyString('Description').max(5000, 'Description is too long'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  category: z.enum(VALID_CATEGORIES, {
    message: 'Invalid category. Must be one of: phone, laptop, tablet, audio, watch'
  }),
  image: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  isFeatured: z.boolean().optional(),
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>

export default createProductSchema
