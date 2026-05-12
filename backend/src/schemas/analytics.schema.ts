import { z } from 'zod'

const dateString = z.string().refine(value => !Number.isNaN(Date.parse(value)), 'Invalid date')

export const dailyOrdersQuerySchema = z.object({
  startDate: dateString,
  endDate: dateString,
})

export const dashboardTrendsQuerySchema = z.object({
  period: z.enum(['7days', '30days', '12months']).optional(),
})

export type DailyOrdersQuery = z.infer<typeof dailyOrdersQuerySchema>
export type DashboardTrendsQuery = z.infer<typeof dashboardTrendsQuerySchema>
