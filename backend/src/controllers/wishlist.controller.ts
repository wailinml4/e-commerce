import { Request, Response, NextFunction } from 'express'
import {
  addToWishlistService,
  removeFromWishlistService,
  getWishlistService,
  checkIfInWishlistService,
} from '../services/wishlistService.js'
import { AuthenticatedRequest } from '../types/index.js'

export const addToWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.body
    const wishlistItem = await addToWishlistService(req.user!.id.toString(), productId)
    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: wishlistItem,
    })
  } catch (error) {
    next(error)
  }
}

export const removeFromWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params
    if (!productId || typeof productId !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Product ID is required',
        data: null
      })
      return
    }
    const result = await removeFromWishlistService(req.user!.id.toString(), productId)
    res.status(200).json({ 
      success: true, 
      message: result.message,
      data: null 
    })
  } catch (error) {
    next(error)
  }
}

export const getWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const wishlistItems = await getWishlistService(req.user!.id.toString())
    res.status(200).json({
      success: true,
      message: 'Wishlist retrieved successfully',
      data: wishlistItems?.items ?? [],
    })
  } catch (error) {
    next(error)
  }
}

export const checkIfInWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId } = req.params
    if (!productId || typeof productId !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Product ID is required',
        data: null
      })
      return
    }
    const isInWishlist = await checkIfInWishlistService(req.user!.id.toString(), productId)
    res.status(200).json({
      success: true,
      message: 'Wishlist check completed',
      data: { isInWishlist },
    })
  } catch (error) {
    next(error)
  }
}
