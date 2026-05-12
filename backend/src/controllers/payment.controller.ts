import { Request, Response, NextFunction } from 'express'
import { createCheckoutSessionService, checkoutSuccessService } from '../services/paymentService.js'
import { AuthenticatedRequest } from '../types/index.js'

export const createCheckoutSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { products, couponCode } = req.body
    const result = await createCheckoutSessionService(products, couponCode, req.user!.id.toString())
    res.status(200).json({
      success: true,
      message: 'Checkout session created successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const checkoutSuccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId } = req.body
    const result = await checkoutSuccessService(sessionId)
    res.status(200).json({
      success: true,
      message: 'Checkout processed successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
