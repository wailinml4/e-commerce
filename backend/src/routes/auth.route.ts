import { Router } from 'express'
import { login, logout, signup, refreshToken, checkAuth } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'
import { loginSchema, signupSchema } from '../schemas/auth.schema.js'

const router = Router()

router.post('/signup', validate(signupSchema), signup)
router.post('/login', validate(loginSchema), login)
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)
router.get('/check', protectRoute, checkAuth)

export default router
