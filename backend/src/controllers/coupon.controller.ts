import { Request, Response, NextFunction } from 'express'
import { getCouponService, validateCouponService } from '../services/couponService.js'
import { AuthenticatedRequest } from '../types/index.js'

export const getCoupon = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const coupon = await getCouponService(req.user!.id.toString())
    res.status(200).json({
      success: true,
      message: 'Coupon retrieved successfully',
      data: coupon,
    })
  } catch (error) {
    next(error)
  }
}

export const validateCoupon = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code } = req.body
    const result = await validateCouponService(code, req.user!.id.toString())
    res.status(200).json({
      success: true,
      message: 'Coupon validated successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
