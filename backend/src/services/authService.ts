import redis from '../config/redis.js'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { IUserDocument, CustomError, TokenResponse, AuthResponse } from '../types/index.js'
import { db } from '../db/client.js'
import { users } from '../db/schema.js'
import { count, eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import env from '../config/env.js'

export const generateTokensService = (userId: string): TokenResponse => {
  const accessToken = jwt.sign({ userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  })

  const refreshToken = jwt.sign({ userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  })

  return { accessToken, refreshToken }
}

export const storeRefreshTokenService = async (userId: string, refreshToken: string): Promise<void> => {
  await redis.set(`refresh_token:${userId}`, refreshToken)
}

export const signupService = async ({
  email,
  password,
  name,
}: {
  email: string
  password: string
  name: string
}): Promise<AuthResponse> => {
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
  const userExists = existing[0]

  if (userExists) {
    const error = new Error('User already exists') as CustomError
    error.statusCode = 400
    throw error
  }

  const userCountResult = await db.select({ total: count() }).from(users)
  const role = Number(userCountResult[0]?.total ?? 0) === 0 ? 'admin' : 'customer'
  const hashedPassword = await bcrypt.hash(password, 10)

  const inserted = await db.insert(users).values({ name, email, password: hashedPassword, role }).returning()
  const createdUser = inserted[0]!
  const user = {
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    role: createdUser.role,
    createdAt: createdUser.createdAt,
    updatedAt: createdUser.updatedAt,
    comparePassword: async (candidatePassword: string) => bcrypt.compare(candidatePassword, createdUser.password),
  } as IUserDocument

  const { accessToken, refreshToken } = generateTokensService(user.id)
  await storeRefreshTokenService(user.id, refreshToken)

  return { user, accessToken, refreshToken }
}

export const loginService = async ({ email, password }: { email: string; password: string }): Promise<AuthResponse> => {
  const found = await db.select().from(users).where(eq(users.email, email)).limit(1)
  const foundUser = found[0]
  const user = foundUser
    ? ({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt,
        comparePassword: async (candidatePassword: string) => bcrypt.compare(candidatePassword, foundUser.password),
      } as IUserDocument)
    : null

  if (!user) {
    const error = new Error('Invalid email or password') as CustomError
    error.statusCode = 401
    throw error
  }

  const isPasswordValid = await user.comparePassword(password)

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password') as CustomError
    error.statusCode = 401
    throw error
  }

  const { accessToken, refreshToken } = generateTokensService(user.id)
  await storeRefreshTokenService(user.id, refreshToken)

  return { user, accessToken, refreshToken }
}

export const logoutService = async (refreshToken?: string): Promise<void> => {
  if (refreshToken) {
    const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as JwtPayload
    await redis.del(`refresh_token:${decoded.userId}`)
  }
}

export const refreshTokenService = async (refreshToken: string): Promise<{ accessToken: string }> => {
  if (!refreshToken) {
    const error = new Error('No refresh token provided') as CustomError
    error.statusCode = 401
    throw error
  }

  const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as JwtPayload
  const storedToken = await redis.get(`refresh_token:${decoded.userId}`)

  if (storedToken !== refreshToken) {
    const error = new Error('Invalid refresh token') as CustomError
    error.statusCode = 401
    throw error
  }

  const accessToken = jwt.sign({ userId: decoded.userId }, env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })

  return { accessToken }
}

export const checkAuthService = async (userId: string): Promise<IUserDocument> => {
  const found = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  const user = found[0]
  if (!user) {
    const error = new Error('User not found') as CustomError
    error.statusCode = 404
    throw error
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    comparePassword: async (candidatePassword: string) => bcrypt.compare(candidatePassword, user.password),
    password: user.password,
  } as IUserDocument
}
