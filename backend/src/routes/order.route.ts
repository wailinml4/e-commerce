import { Router } from 'express'
import {
  getMyOrders,
  getOrderById,
  cancelOrder,
  requestReturn,
  getAllOrders,
  updateOrderStatus,
  approveReturn,
  rejectReturn,
  getReturnRequests,
} from '../controllers/order.controller.js'
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validation.middleware.js'
import { orderParamsSchema, requestReturnSchema, updateOrderStatusSchema } from '../schemas/order.schema.js'

const router = Router()

router.get('/my-orders', protectRoute, getMyOrders)
router.get('/', protectRoute, adminRoute, getAllOrders)
router.get('/returns', protectRoute, adminRoute, getReturnRequests)

router.get('/:id', protectRoute, validate(orderParamsSchema, 'params'), getOrderById)
router.post('/:id/cancel', protectRoute, validate(orderParamsSchema, 'params'), cancelOrder)
router.post('/:id/request-return', protectRoute, validate(orderParamsSchema, 'params'), validate(requestReturnSchema), requestReturn)
router.put(
  '/:id/status',
  protectRoute,
  adminRoute,
  validate(orderParamsSchema, 'params'),
  validate(updateOrderStatusSchema),
  updateOrderStatus,
)
router.put('/:id/approve-return', protectRoute, adminRoute, validate(orderParamsSchema, 'params'), approveReturn)
router.put('/:id/reject-return', protectRoute, adminRoute, validate(orderParamsSchema, 'params'), rejectReturn)

export default router
