import { IProductDocument } from '../types/index.js'
import { toNumber, withId } from '../db/mappers.js'
import { products } from '../db/schema.js'

const mapProduct = (row: typeof products.$inferSelect): IProductDocument & { image?: string } =>
  ({
    ...withId(row),
    price: toNumber(row.price),
    ratings: toNumber(row.ratings),
    image: Array.isArray(row.images) && row.images.length > 0 ? row.images[0] : '',
  }) as IProductDocument & { image?: string }

export default mapProduct
