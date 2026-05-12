import { Router } from 'express'
import { addToWishlist, removeFromWishlist, getWishlist, checkIfInWishlist } from '../controllers/wishlist.controller.js'
import { customerOnly, protectRoute } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'
import { addToWishlistSchema, wishlistProductParamsSchema } from '../schemas/wishlist.schema.js'

const router = Router()

router.post('/', protectRoute, customerOnly, validate(addToWishlistSchema), addToWishlist)
router.delete('/:productId', protectRoute, customerOnly, validate(wishlistProductParamsSchema, 'params'), removeFromWishlist)
router.get('/', protectRoute, customerOnly, getWishlist)
router.get('/check/:productId', protectRoute, customerOnly, validate(wishlistProductParamsSchema, 'params'), checkIfInWishlist)

export default router
