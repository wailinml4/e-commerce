import redis from '../config/redis.js'
import cloudinary from '../config/cloudinary.js'
import { db } from '../db/client.js'
import { products } from '../db/schema.js'
import { and, asc, desc, eq, gte, ilike, lte, ne, notInArray, or } from 'drizzle-orm'
import { CustomError, IProductDocument } from '../types/index.js'
import { toNumber, withId } from '../db/mappers.js'
import mapProduct from '../utils/mapProduct.js'
import sortClause from '../utils/sortClause.js'

export const getAllProductsService = async (): Promise<IProductDocument[]> => {
  const rows = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt))
  return rows.map(mapProduct)
}

export const searchProductsService = async ({
  query,
  category,
  minPrice,
  maxPrice,
  sort = '-createdAt',
}: {
  query?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
}): Promise<IProductDocument[]> => {
  const conditions = [eq(products.status, 'active' as const)]
  if (query) {
    conditions.push(or(ilike(products.name, `%${query}%`), ilike(products.description, `%${query}%`))!)
  }
  if (category) conditions.push(eq(products.category, category))
  if (minPrice) conditions.push(gte(products.price, minPrice))
  if (maxPrice) conditions.push(lte(products.price, maxPrice))

  const rows = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(sortClause(sort))
    .limit(50)
  return rows.map(mapProduct)
}

export const getSuggestionsService = async (query: string): Promise<Array<{ id: string; name: string; image: string }>> => {
  if (!query || query.length < 2) {
    return []
  }

  const suggestions = await db
    .select({ id: products.id, name: products.name, images: products.images })
    .from(products)
    .where(and(eq(products.status, 'active' as const), ilike(products.name, `%${query}%`)))
    .limit(10)

  return suggestions.map(p => ({
    id: p.id,
    name: p.name,
    image: p.images[0] || '',
  }))
}

export const getLatestProductsService = async (): Promise<IProductDocument[]> => {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.status, 'active' as const))
    .orderBy(desc(products.createdAt))
    .limit(8)
  return rows.map(mapProduct)
}

export const getRelatedProductsService = async (productId: string): Promise<IProductDocument[]> => {
  const foundCurrent = await db.select().from(products).where(eq(products.id, productId)).limit(1)
  const currentProduct = foundCurrent[0]
  if (!currentProduct) {
    const error = new Error('Product not found') as CustomError
    error.statusCode = 404
    throw error
  }

  const keywords = currentProduct.description.split(/\s+/).filter(word => word.length > 3)
  const keywordRegex = keywords.map(k => new RegExp(k, 'i'))

  const keywordCondition = keywordRegex.length ? or(...keywordRegex.map(k => ilike(products.description, `%${k.source}%`))) : undefined
  const relatedProducts = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.status, 'active' as const),
        ne(products.id, productId),
        eq(products.category, currentProduct.category),
        keywordCondition,
      ),
    )
    .limit(4)

  if (relatedProducts.length < 4) {
    const excludedIds = relatedProducts.map(p => p.id)
    const fallbackProducts = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.status, 'active' as const),
          ne(products.id, productId),
          eq(products.category, currentProduct.category),
          excludedIds.length ? notInArray(products.id, excludedIds) : undefined,
        ),
      )
      .limit(4 - relatedProducts.length)
    return [...relatedProducts, ...fallbackProducts].map(mapProduct)
  }

  return relatedProducts.map(mapProduct)
}

export const getFeaturedProductsService = async (): Promise<IProductDocument[]> => {
  const cachedFeaturedProducts = await redis.get('featured_products')
  if (cachedFeaturedProducts) {
    return JSON.parse(cachedFeaturedProducts)
  }

  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.isFeatured, true), eq(products.status, 'active' as const)))

  const featuredProducts = rows.map(mapProduct)

  if (!featuredProducts || featuredProducts.length === 0) {
    const error = new Error('No featured products found') as CustomError
    error.statusCode = 404
    throw error
  }

  await redis.set('featured_products', JSON.stringify(featuredProducts))

  return featuredProducts
}

export const createProductService = async ({
  name,
  description,
  price,
  image,
  category,
}: {
  name: string
  description: string
  price: number
  image?: string
  category: string
}): Promise<IProductDocument> => {
  let cloudinaryResponse = null

  if (image) {
    cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: 'products',
    })
  }

  const inserted = await db
    .insert(products)
    .values({
      name,
      description,
      price: price.toString(),
      images: cloudinaryResponse?.secure_url ? [cloudinaryResponse.secure_url] : [],
      category,
    })
    .returning()
  if (!inserted[0]) {
    const error = new Error('Failed to create product') as CustomError
    error.statusCode = 500
    throw error
  }
  return mapProduct(inserted[0])
}

export const deleteProductService = async (productId: string): Promise<{ message: string }> => {
  const foundProduct = await db.select().from(products).where(eq(products.id, productId)).limit(1)
  const product = foundProduct[0]

  if (!product) {
    const error = new Error('Product not found') as CustomError
    error.statusCode = 404
    throw error
  }

  if (product.images && product.images.length > 0) {
    const publicId = product.images[0]?.split('/').pop()?.split('.')[0]
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`)
        console.log('deleted image from cloudinary')
      } catch (__error) {
        console.log('error deleting image from cloudinary', __error)
      }
    }
  }

  try {
    await db.delete(products).where(eq(products.id, productId))
    return { message: 'Product deleted successfully' }
  } catch (err: unknown) {
    if ((err as { cause?: { code?: string } })?.cause?.code === '23503') {
      await db
        .update(products)
        .set({ status: 'inactive' as const })
        .where(eq(products.id, productId))
      return { message: 'Product deactivated (has existing orders)' }
    }
    throw err
  }
}

export const getProductsByCategoryService = async (
  category: string,
  minPrice?: string,
  maxPrice?: string,
  sort?: string,
): Promise<IProductDocument[]> => {
  const conditions = [eq(products.category, category), eq(products.status, 'active' as const)]
  if (minPrice) conditions.push(gte(products.price, minPrice))
  if (maxPrice) conditions.push(lte(products.price, maxPrice))
  const rows = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(sortClause(sort))
  return rows.map(mapProduct)
}

export const getProductByIdService = async (productId: string): Promise<IProductDocument> => {
  const found = await db.select().from(products).where(eq(products.id, productId)).limit(1)
  const product = found[0]
  if (!product) {
    const error = new Error('Product not found') as CustomError
    error.statusCode = 404
    throw error
  }
  return mapProduct(product)
}

export const toggleFeaturedProductService = async (productId: string): Promise<IProductDocument> => {
  const found = await db.select().from(products).where(eq(products.id, productId)).limit(1)
  const product = found[0]
  if (!product) {
    const error = new Error('Product not found') as CustomError
    error.statusCode = 404
    throw error
  }

  const updated = await db
    .update(products)
    .set({ isFeatured: !product.isFeatured, updatedAt: new Date() })
    .where(eq(products.id, productId))
    .returning()
  await updateFeaturedCache()
  if (!updated[0]) {
    const error = new Error('Failed to update product') as CustomError
    error.statusCode = 500
    throw error
  }
  return mapProduct(updated[0])
}

export const toggleStatusService = async (productId: string): Promise<IProductDocument> => {
  const found = await db.select().from(products).where(eq(products.id, productId)).limit(1)
  const product = found[0]
  if (!product) {
    const error = new Error('Product not found') as CustomError
    error.statusCode = 404
    throw error
  }

  const updated = await db
    .update(products)
    .set({
      status: product.status === 'active' ? 'inactive' : 'active',
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId))
    .returning()
  if (!updated[0]) {
    const error = new Error('Failed to update product status') as CustomError
    error.statusCode = 500
    throw error
  }
  return mapProduct(updated[0])
}

export const updateProductService = async (
  productId: string,
  {
    name,
    description,
    price,
    image,
    category,
    status,
  }: { name?: string; description?: string; price?: number; image?: string; category?: string; status?: string },
): Promise<IProductDocument> => {
  const found = await db.select().from(products).where(eq(products.id, productId)).limit(1)
  const product = found[0]

  if (!product) {
    const error = new Error('Product not found') as CustomError
    error.statusCode = 404
    throw error
  }

  const updatedProduct = await db
    .update(products)
    .set({
      name: name !== undefined ? name : product.name,
      description: description !== undefined ? description : product.description,
      price: price !== undefined ? price.toString() : product.price,
      images: image ? [image] : product.images,
      category: category ?? product.category,
      status: (status as 'active' | 'inactive') ?? product.status,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId))
    .returning()
  if (!updatedProduct[0]) {
    const error = new Error('Failed to update product') as CustomError
    error.statusCode = 500
    throw error
  }
  return mapProduct(updatedProduct[0])
}

async function updateFeaturedCache(): Promise<void> {
  try {
    const rows = await db
      .select()
      .from(products)
      .where(and(eq(products.isFeatured, true), eq(products.status, 'active' as const)))
    await redis.set('featured_products', JSON.stringify(rows.map(mapProduct)))
  } catch (__error) {
    console.log('error in update cache function')
  }
}
