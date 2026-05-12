import { Router } from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { getCoupon, validateCoupon } from '../controllers/coupon.controller.js'
import { validate } from '../middleware/validation.middleware.js'
import { validateCouponSchema } from '../schemas/coupon.schema.js'

const router = Router()

router.get('/', protectRoute, getCoupon)
router.post('/validate', protectRoute, validate(validateCouponSchema), validateCoupon)

export default router
