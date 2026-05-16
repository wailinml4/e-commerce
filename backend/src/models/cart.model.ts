import mongoose, { Schema } from 'mongoose'
import { ICartDocument, ICartItem } from '../types/index.js'

const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false },
)

const cartSchema = new Schema<ICartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, 'Total amount cannot be negative'],
    },
  },
  {
    timestamps: true,
  },
)

cartSchema.pre('save', function (next) {
  if (this.isModified('items')) {
    this.totalAmount = this.items.reduce((total: number, item: ICartItem) => {
      return total + item.price * item.quantity
    }, 0)
  }
  next()
})

const Cart = mongoose.model<ICartDocument>('Cart', cartSchema)

export default Cart
export { ICartDocument }
