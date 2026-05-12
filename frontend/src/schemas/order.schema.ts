import { z } from 'zod'
import { nonEmptyString } from './common.schema'

export const requestReturnSchema = z.object({
  returnReason: nonEmptyString('Return reason'),
  returnDescription: z.string().min(1, 'Description is required').max(2000).optional(),
})

export type ReturnRequestInput = z.infer<typeof requestReturnSchema>

export default requestReturnSchema
