import { asc, desc } from 'drizzle-orm'
import { products } from '../db/schema.js'

const sortClause = (sort?: string) => {
  switch (sort) {
    case 'price':
      return asc(products.price)
    case '-price':
      return desc(products.price)
    case 'name':
      return asc(products.name)
    case '-name':
      return desc(products.name)
    case 'createdAt':
      return asc(products.createdAt)
    case '-createdAt':
      return desc(products.createdAt)
    default:
      return desc(products.createdAt)
  }
}

export default sortClause
