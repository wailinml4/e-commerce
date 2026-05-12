import { Request, Response, NextFunction } from 'express'
import {
  getMyOrdersService,
  getOrderByIdService,
  cancelOrderService,
  requestReturnService,
  getAllOrdersService,
  getOrderByIdAdminService,
  updateOrderStatusService,
  approveReturnService,
  rejectReturnService,
  getReturnRequestsService,
} from '../services/orderService.js'
import { AuthenticatedRequest } from '../types/index.js'

export const getMyOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await getMyOrdersService(req.user!.id.toString())
    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Order ID is required',
        data: null
      })
      return
    }
    const order = await getOrderByIdService(id, req.user!.id.toString(), req.user!.role)
    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const cancelOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Order ID is required',
        data: null
      })
      return
    }
    const order = await cancelOrderService(id, req.user!.id.toString())
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const requestReturn = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const { returnReason, returnDescription } = req.body
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Order ID is required',
        data: null
      })
      return
    }
    const order = await requestReturnService(id, req.user!.id.toString(), { returnReason, returnDescription })
    res.status(200).json({
      success: true,
      message: 'Return requested successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await getAllOrdersService()
    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
    })
  } catch (error) {
    next(error)
  }
}

export const getOrderByIdAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Order ID is required',
        data: null
      })
      return
    }
    const order = await getOrderByIdAdminService(id)
    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Order ID is required',
        data: null
      })
      return
    }
    const order = await updateOrderStatusService(id, status)
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const approveReturn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Order ID is required',
        data: null
      })
      return
    }
    const order = await approveReturnService(id)
    res.status(200).json({
      success: true,
      message: 'Return approved successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const rejectReturn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Order ID is required',
        data: null
      })
      return
    }
    const order = await rejectReturnService(id)
    res.status(200).json({
      success: true,
      message: 'Return rejected successfully',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

export const getReturnRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await getReturnRequestsService()
    res.status(200).json({
      success: true,
      message: 'Return requests retrieved successfully',
      data: orders,
    })
  } catch (error) {
    next(error)
  }
}
