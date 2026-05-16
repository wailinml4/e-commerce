import mongoose, { Schema } from 'mongoose'
import { IOrderDocument, IOrderItem } from '../types/index.js'

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
  },
  { _id: false },
)

const orderSchema = new Schema<IOrderDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    orderItems: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    stripeSessionId: {
      type: String,
      required: [true, 'Stripe session ID is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const,
      default: 'pending',
    },
  },
  { timestamps: true },
)

const Order = mongoose.model<IOrderDocument>('Order', orderSchema)

export default Order
export { IOrderDocument }
