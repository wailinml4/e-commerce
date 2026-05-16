import mongoose, { Schema } from 'mongoose'
import { IPaymentDocument } from '../types/index.js'

const paymentSchema = new Schema<IPaymentDocument>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    method: {
      type: String,
      enum: ['stripe', 'paypal', 'cod'] as const,
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'] as const,
      default: 'pending',
    },
    stripePaymentIntentId: {
      type: String,
    },
    refundId: {
      type: String,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentProvider: {
      type: String,
      default: 'stripe',
    },
    providerTransactionId: {
      type: String,
    },
    providerSessionId: {
      type: String,
    },
    failureReason: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

paymentSchema.index({ order: 1 })
paymentSchema.index({ user: 1 })
paymentSchema.index({ status: 1 })
paymentSchema.index({ stripePaymentIntentId: 1 })

const Payment = mongoose.model<IPaymentDocument>('Payment', paymentSchema)

export default Payment
export { IPaymentDocument }
