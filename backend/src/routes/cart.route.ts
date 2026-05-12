import { Router } from 'express'
import { addToCart, clearCart, getCartProducts, removeFromCart, updateQuantity } from '../controllers/cart.controller.js'
import { customerOnly, protectRoute } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'
import { addToCartSchema, cartProductParamsSchema, updateCartQuantitySchema } from '../schemas/cart.schema.js'

const router = Router()

router.get('/', protectRoute, customerOnly, getCartProducts)
router.post('/', protectRoute, customerOnly, validate(addToCartSchema), addToCart)
router.delete('/', protectRoute, customerOnly, clearCart)
router.delete('/:id', protectRoute, customerOnly, validate(cartProductParamsSchema, 'params'), removeFromCart)
router.put(
  '/:id',
  protectRoute,
  customerOnly,
  validate(cartProductParamsSchema, 'params'),
  validate(updateCartQuantitySchema),
  updateQuantity,
)

export default router
