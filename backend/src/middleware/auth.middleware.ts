import { Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { AuthenticatedRequest } from '../types/index.js'
import { db } from '../db/client.js'
import { users } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import env from '../config/env.js'

export const protectRoute = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
      res.status(401).json({ message: 'Unauthorized - No access token provided' })
      return
    }

    try {
      const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as JwtPayload
      const found = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1)
      const userRow = found[0]
      const user = userRow
        ? ({
            id: userRow.id,
            name: userRow.name,
            email: userRow.email,
            role: userRow.role,
            createdAt: userRow.createdAt,
            updatedAt: userRow.updatedAt,
            comparePassword: async (candidatePassword: string) => bcrypt.compare(candidatePassword, userRow.password),
            password: userRow.password,
          } as AuthenticatedRequest['user'])
        : null

      if (!user) {
        res.status(401).json({ message: 'User not found' })
        return
      }

      req.user = user

      next()
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Unauthorized - Access token expired' })
        return
      }
      throw error
    }
  } catch (error) {
    console.log('Error in protectRoute middleware', (error as Error).message)
    res.status(401).json({ message: 'Unauthorized - Invalid access token' })
  }
}

export const adminRoute = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Access denied - Admin only' })
  }
}

export const customerOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'customer') {
    next()
  } else {
    res.status(403).json({ message: 'Access denied - Customer only' })
  }
}
