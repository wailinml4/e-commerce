import { Request, Response, NextFunction } from 'express'
import { signupService, loginService, logoutService, refreshTokenService, checkAuthService } from '../services/authService.js'
import { AuthenticatedRequest } from '../types/index.js'
import env from '../config/env.js'

const setCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name } = req.body
    const { user, accessToken, refreshToken } = await signupService({
      email,
      password,
      name,
    })

    setCookies(res, accessToken, refreshToken)

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body
    const { user, accessToken, refreshToken } = await loginService({
      email,
      password,
    })

    setCookies(res, accessToken, refreshToken)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken
    await logoutService(refreshToken)

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken
    const { accessToken } = await refreshTokenService(refreshToken)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    })

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const checkAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id
    const user = await checkAuthService(userId.toString())

    res.status(200).json({
      success: true,
      message: 'User authenticated successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}
