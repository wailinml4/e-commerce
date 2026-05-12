import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductsByCategory,
  toggleFeaturedProduct,
  toggleStatus,
  updateProduct,
  searchProducts,
  getSuggestions,
  getLatestProducts,
  getRelatedProducts,
} from '../controllers/product.controller.js'
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'
import {
  createProductSchema,
  productCategoryParamsSchema,
  productCategoryQuerySchema,
  productParamsSchema,
  productSearchQuerySchema,
  productSuggestionsQuerySchema,
  updateProductSchema,
} from '../schemas/product.schema.js'

const router = Router()

router.get('/', protectRoute, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/latest', getLatestProducts)
router.get(
  '/category/:category',
  validate(productCategoryParamsSchema, 'params'),
  validate(productCategoryQuerySchema, 'query'),
  getProductsByCategory,
)
router.get('/search', validate(productSearchQuerySchema, 'query'), searchProducts)
router.get('/suggestions', validate(productSuggestionsQuerySchema, 'query'), getSuggestions)
router.get('/:id', validate(productParamsSchema, 'params'), getProductById)
router.get('/:id/related', validate(productParamsSchema, 'params'), getRelatedProducts)
router.post('/', protectRoute, adminRoute, validate(createProductSchema), createProduct)
router.patch('/:id/toggle-featured', protectRoute, adminRoute, validate(productParamsSchema, 'params'), toggleFeaturedProduct)
router.patch('/:id/toggle-status', protectRoute, adminRoute, validate(productParamsSchema, 'params'), toggleStatus)
router.put('/:id', protectRoute, adminRoute, validate(productParamsSchema, 'params'), validate(updateProductSchema), updateProduct)
router.delete('/:id', protectRoute, adminRoute, validate(productParamsSchema, 'params'), deleteProduct)

export default router
