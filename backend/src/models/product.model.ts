import mongoose, { Schema } from 'mongoose'
import { IProductDocument } from '../types/index.js'

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      required: [true, 'Product price is required'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
    },
    brand: {
      type: String,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    ratings: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    numReviews: {
      type: Number,
      default: 0,
      min: [0, 'Number of reviews cannot be negative'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

const Product = mongoose.model<IProductDocument>('Product', productSchema)

export default Product
export { IProductDocument }
