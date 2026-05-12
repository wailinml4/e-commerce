import { Router } from 'express'
import { customerOnly, protectRoute } from '../middleware/auth.middleware.js'
import { checkoutSuccess, createCheckoutSession } from '../controllers/payment.controller.js'
import { validate } from '../middleware/validation.middleware.js'
import { checkoutSuccessSchema, createCheckoutSessionSchema } from '../schemas/payment.schema.js'

const router = Router()

router.post('/create-checkout-session', protectRoute, customerOnly, validate(createCheckoutSessionSchema), createCheckoutSession)
router.post('/checkout-success', protectRoute, customerOnly, validate(checkoutSuccessSchema), checkoutSuccess)

export default router
