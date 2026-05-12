import { z } from 'zod'
import { nonEmptyString } from './common.schema'

export const signupSchema = z
  .object({
    name: nonEmptyString('Name').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .strict()

export const loginSchema = z
  .object({
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    password: z.string().min(1, 'Password is required'),
  })
  .strict()

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
