import { count, desc, eq } from 'drizzle-orm'
import { CustomError, UserProfile } from '../types/index.js'
import { db } from '../db/client.js'
import { orders, users } from '../db/schema.js'

type UserWithOrderCount = {
  orderCount: number
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export const getAllUsersService = async (): Promise<UserWithOrderCount[]> => {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt))

  const usersWithOrderCount = await Promise.all(
    allUsers.map(async user => {
      const orderCountResult = await db.select({ total: count() }).from(orders).where(eq(orders.userId, user.id))
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        orderCount: Number(orderCountResult[0]?.total ?? 0),
      }
    }),
  )

  return usersWithOrderCount as UserWithOrderCount[]
}

export const deleteUserService = async (userId: string): Promise<{ success: boolean; message: string }> => {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  if (!user[0]) {
    const error = new Error('User not found') as CustomError
    error.statusCode = 404
    throw error
  }

  await db.delete(users).where(eq(users.id, userId))
  return { success: true, message: 'User deleted successfully' }
}

export const updateUserRoleService = async (
  userId: string,
  role: string,
): Promise<{
  success: boolean
  message: string
  data: { id: string; name: string; email: string; role: string }
}> => {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  if (!user[0]) {
    const error = new Error('User not found') as CustomError
    error.statusCode = 404
    throw error
  }

  if (!['customer', 'admin'].includes(role)) {
    const error = new Error('Invalid role') as CustomError
    error.statusCode = 400
    throw error
  }

  const updated = await db
    .update(users)
    .set({ role: role as 'customer' | 'admin', updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning()
  const userData = updated[0]!

  return {
    success: true,
    message: 'User role updated successfully',
    data: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
  }
}

export const getOrdersByUserService = async (userId: string): Promise<(typeof orders.$inferSelect)[]> => {
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt))
}

export const getProfileService = async (userId: string): Promise<UserProfile> => {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  if (!user[0]) {
    const error = new Error('User not found') as CustomError
    error.statusCode = 404
    throw error
  }
  return {
    id: user[0].id,
    name: user[0].name,
    email: user[0].email,
    role: user[0].role,
    createdAt: user[0].createdAt,
    updatedAt: user[0].updatedAt,
  }
}

export const updateProfileService = async (userId: string, { name, email }: { name?: string; email?: string }): Promise<UserProfile> => {
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  if (!user[0]) {
    const error = new Error('User not found') as CustomError
    error.statusCode = 404
    throw error
  }

  if (email && email !== user[0].email) {
    const emailExists = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (emailExists[0]) {
      const error = new Error('Email already in use') as CustomError
      error.statusCode = 400
      throw error
    }
  }
  const updated = await db
    .update(users)
    .set({
      email: email ?? user[0].email,
      name: name ?? user[0].name,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning()
  const userData = updated[0]!

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
  }
}
