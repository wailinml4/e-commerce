import { z } from 'zod'
import { nonEmptyString } from './common.schema'

export const updateProfileSchema = z.object({
  name: nonEmptyString('Name').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export default updateProfileSchema
