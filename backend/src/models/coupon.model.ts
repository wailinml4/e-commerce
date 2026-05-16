import mongoose, { Schema } from 'mongoose'
import { ICouponDocument } from '../types/index.js'

const couponSchema = new Schema<ICouponDocument>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required'],
      min: [0, 'Discount cannot be less than 0'],
      max: [100, 'Discount cannot be more than 100'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
  },
)

couponSchema.index({ code: 1 })
couponSchema.index({ expiryDate: 1 })
couponSchema.index({ isActive: 1 })

const Coupon = mongoose.model<ICouponDocument>('Coupon', couponSchema)

export default Coupon
export { ICouponDocument }
