import { Request, Response, NextFunction } from 'express'
import {
  getAllUsersService,
  deleteUserService,
  updateUserRoleService,
  getOrdersByUserService,
  getProfileService,
  updateProfileService,
} from '../services/userService.js'
import { AuthenticatedRequest } from '../types/index.js'

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await getAllUsersService()
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
        data: null
      })
      return
    }
    const result = await deleteUserService(id)
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const { role } = req.body
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
        data: null
      })
      return
    }
    const result = await updateUserRoleService(id, role)
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getUserOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
        data: null
      })
      return
    }
    const orders = await getOrdersByUserService(id)
    res.status(200).json({
      success: true,
      message: 'User orders retrieved successfully',
      data: orders,
    })
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id.toString()
    const user = await getProfileService(userId)
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id.toString()
    const { name, email } = req.body
    const updatedUser = await updateProfileService(userId, { name, email })
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}
