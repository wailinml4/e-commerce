import { Request, Response, NextFunction } from 'express'
import {
  getCartProductsService,
  addToCartService,
  clearCartService,
  removeFromCartService,
  updateQuantityService,
} from '../services/cartService.js'
import { AuthenticatedRequest } from '../types/index.js'

export const getCartProducts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cartItems = await getCartProductsService(req.user!.id.toString())
    res.status(200).json({
      success: true,
      message: 'Cart products retrieved successfully',
      data: cartItems,
    })
  } catch (error) {
    next(error)
  }
}

export const addToCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.body
    const cartItems = await addToCartService(req.user!.id.toString(), productId)
    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      data: cartItems,
    })
  } catch (error) {
    next(error)
  }
}

export const clearCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cartItems = await clearCartService(req.user!.id.toString())
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cartItems,
    })
  } catch (error) {
    next(error)
  }
}

export const removeFromCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: productId } = req.params
    const productIdStr = productId as string
    const cartItems = await removeFromCartService(req.user!.id.toString(), productIdStr)
    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      data: cartItems,
    })
  } catch (error) {
    next(error)
  }
}

export const updateQuantity = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: productId } = req.params
    const productIdStr = productId as string
    const { quantity } = req.body
    const cartItems = await updateQuantityService(req.user!.id.toString(), productIdStr, quantity)
    res.status(200).json({
      success: true,
      message: 'Cart quantity updated',
      data: cartItems,
    })
  } catch (error) {
    next(error)
  }
}
