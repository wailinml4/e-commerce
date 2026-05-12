import { z } from 'zod'

export const nonEmptyString = (label = 'Field') => z.string().trim().min(1, `${label} is required`)

export const idParam = () => z.string().uuid('Invalid id')
