import { Request, Response, NextFunction } from 'express'
import {
  getAnalyticsDataService,
  getDailyOrdersDataService,
  getDashboardMetricsService,
  getDashboardTrendsService,
  getDashboardNewItemsService,
  getDashboardInsightsService,
} from '../services/analyticsService.js'

export const getAnalyticsData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getAnalyticsDataService()
    res.status(200).json({
      success: true,
      message: 'Analytics data retrieved successfully',
      data,
    })
  } catch (error) {
    next(error)
  }
}

export const getDailyOrdersData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate } = req.query
    const data = await getDailyOrdersDataService(new Date(startDate as string), new Date(endDate as string))
    res.status(200).json({
      success: true,
      message: 'Daily orders data retrieved successfully',
      data,
    })
  } catch (error) {
    next(error)
  }
}

export const getDashboardMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getDashboardMetricsService()
    res.status(200).json({
      success: true,
      message: 'Dashboard metrics retrieved successfully',
      data,
    })
  } catch (error) {
    next(error)
  }
}

export const getDashboardTrends = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { period = '7days' } = req.query
    const data = await getDashboardTrendsService(period as string)
    res.status(200).json({
      success: true,
      message: 'Dashboard trends retrieved successfully',
      data,
    })
  } catch (error) {
    next(error)
  }
}

export const getDashboardNewItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getDashboardNewItemsService()
    res.status(200).json({
      success: true,
      message: 'Dashboard new items retrieved successfully',
      data,
    })
  } catch (error) {
    next(error)
  }
}

export const getDashboardInsights = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getDashboardInsightsService()
    res.status(200).json({
      success: true,
      message: 'Dashboard insights retrieved successfully',
      data,
    })
  } catch (error) {
    next(error)
  }
}
