import { Request, Response, NextFunction } from 'express'
import { signupService, loginService, logoutService, refreshTokenService, checkAuthService } from '../services/authService.js'
import { AuthenticatedRequest } from '../types/index.js'
// Cookies are set with fixed, production-safe attributes. These are hardcoded
// to ensure consistent behavior across environments (httpOnly, secure,
// SameSite=None) which is required for cross-site auth flows when using
// a proxy or when deployed behind HTTPS.
const setCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 15 * 60 * 1000,
    path: '/',
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
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

    // Clear using matching options so the browser actually removes the cookies
    res.clearCookie('accessToken', { path: '/', httpOnly: true })
    res.clearCookie('refreshToken', { path: '/', httpOnly: true })

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

    // Set accessToken cookie with the same options used elsewhere
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
      path: '/',
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
