import { Router } from 'express'
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js'
import {
  getAnalyticsData,
  getDailyOrdersData,
  getDashboardMetrics,
  getDashboardTrends,
  getDashboardNewItems,
  getDashboardInsights,
} from '../controllers/analytics.controller.js'
import { validate } from '../middleware/validation.middleware.js'
import { dailyOrdersQuerySchema, dashboardTrendsQuerySchema } from '../schemas/analytics.schema.js'

const router = Router()

router.get('/', protectRoute, adminRoute, getAnalyticsData)
router.get('/orders', protectRoute, adminRoute, validate(dailyOrdersQuerySchema, 'query'), getDailyOrdersData)
router.get('/dashboard/metrics', protectRoute, adminRoute, getDashboardMetrics)
router.get('/dashboard/trends', protectRoute, adminRoute, validate(dashboardTrendsQuerySchema, 'query'), getDashboardTrends)
router.get('/dashboard/new-items', protectRoute, adminRoute, getDashboardNewItems)
router.get('/dashboard/insights', protectRoute, adminRoute, getDashboardInsights)

export default router
