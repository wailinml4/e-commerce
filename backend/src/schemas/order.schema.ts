import { z } from 'zod'

export const orderParamsSchema = z.object({
  id: z.string().uuid('Invalid order id'),
})

export const requestReturnSchema = z.object({
  returnReason: z.string().trim().min(1, 'Return reason is required').max(200, 'Return reason is too long'),
  returnDescription: z.string().trim().min(1, 'Return description is required').max(2000, 'Return description is too long'),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
})

export type OrderParams = z.infer<typeof orderParamsSchema>
export type RequestReturnInput = z.infer<typeof requestReturnSchema>
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
