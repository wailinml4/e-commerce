import { Router } from 'express'
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'
import { getAllUsers, deleteUser, updateUserRole, getUserOrders, getProfile, updateProfile } from '../controllers/user.controller.js'
import { validate } from '../middleware/validation.middleware.js'
import { updateProfileSchema, updateUserRoleSchema, userParamsSchema } from '../schemas/user.schema.js'

const router = Router()

router.get('/', protectRoute, adminRoute, getAllUsers)
router.get('/profile', protectRoute, getProfile)
router.put('/profile', protectRoute, validate(updateProfileSchema), updateProfile)
router.delete('/:id', protectRoute, adminRoute, validate(userParamsSchema, 'params'), deleteUser)
router.put('/:id/role', protectRoute, adminRoute, validate(userParamsSchema, 'params'), validate(updateUserRoleSchema), updateUserRole)
router.get('/:id/orders', protectRoute, adminRoute, validate(userParamsSchema, 'params'), getUserOrders)

export default router
