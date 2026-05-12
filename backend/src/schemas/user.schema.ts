import { z } from 'zod'
import { nonEmptyString } from './common.schema.js'

export const userParamsSchema = z.object({
  id: z.string().uuid('Invalid user id'),
})

export const updateUserRoleSchema = z.object({
  role: z.enum(['user', 'admin']),
})

export const updateProfileSchema = z
  .object({
    name: nonEmptyString('Name').max(100, 'Name is too long').optional(),
    email: z.string().email('Invalid email address').trim().toLowerCase().optional(),
  })
  .refine(value => Object.keys(value).length > 0, 'At least one profile field is required')

export type UserParams = z.infer<typeof userParamsSchema>
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
