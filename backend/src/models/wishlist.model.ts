import mongoose, { Schema } from 'mongoose'
import { IWishlistDocument, IWishlistItem } from '../types/index.js'

const wishlistItemSchema = new Schema<IWishlistItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
)

const wishlistSchema = new Schema<IWishlistDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    items: [wishlistItemSchema],
  },
  {
    timestamps: true,
  },
)

wishlistSchema.index({ user: 1, 'items.product': 1 }, { unique: true })

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

export default Wishlist
export { IWishlistDocument }
