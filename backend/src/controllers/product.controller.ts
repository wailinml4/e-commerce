import { Request, Response, NextFunction } from 'express'
import {
  getAllProductsService,
  getFeaturedProductsService,
  createProductService,
  deleteProductService,
  getProductByIdService,
  getProductsByCategoryService,
  toggleFeaturedProductService,
  toggleStatusService,
  updateProductService,
  searchProductsService,
  getSuggestionsService,
  getLatestProductsService,
  getRelatedProductsService,
} from '../services/productService.js'

export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await getAllProductsService()
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    })
  } catch (error) {
    next(error)
  }
}

export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const featuredProducts = await getFeaturedProductsService()
    res.status(200).json({
      success: true,
      message: 'Featured products retrieved successfully',
      data: featuredProducts,
    })
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, image, category } = req.body
    const product = await createProductService({
      name,
      description,
      price,
      image,
      category,
    })

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Product ID is required',
        data: null
      })
      return
    }
    const result = await deleteProductService(id)
    res.status(200).json({ 
      success: true, 
      message: result.message,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Product ID is required',
        data: null
      })
      return
    }
    const product = await getProductByIdService(id)
    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.params
    const { minPrice, maxPrice, sort } = req.query
    const products = await getProductsByCategoryService(category as string, minPrice as string, maxPrice as string, sort as string)
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    })
  } catch (error) {
    next(error)
  }
}

export const toggleFeaturedProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Product ID is required',
        data: null
      })
      return
    }
    const product = await toggleFeaturedProductService(id)
    res.status(200).json({
      success: true,
      message: 'Product featured status updated',
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

export const toggleStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    if (!id || typeof id !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Product ID is required',
        data: null
      })
      return
    }
    const product = await toggleStatusService(id)
    res.status(200).json({
      success: true,
      message: 'Product status updated',
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const { name, description, price, image, category, status } = req.body
    const product = await updateProductService(id as string, {
      name,
      description,
      price,
      image,
      category,
      status,
    })
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

export const searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { query, category, minPrice, maxPrice, sort } = req.query
    const products = await searchProductsService({
      query: query as string,
      category: category as string,
      minPrice: minPrice as string,
      maxPrice: maxPrice as string,
      sort: sort as string,
    })
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
    })
  } catch (error) {
    next(error)
  }
}

export const getSuggestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { query } = req.query
    const suggestions = await getSuggestionsService(query as string)
    res.status(200).json({
      success: true,
      message: 'Suggestions retrieved successfully',
      data: suggestions,
    })
  } catch (error) {
    next(error)
  }
}

export const getLatestProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await getLatestProductsService()
    res.status(200).json({
      success: true,
      message: 'Latest products retrieved successfully',
      data: products,
    })
  } catch (error) {
    next(error)
  }
}

export const getRelatedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params
    const products = await getRelatedProductsService(id as string)
    res.status(200).json({
      success: true,
      message: 'Related products retrieved successfully',
      data: products,
    })
  } catch (error) {
    next(error)
  }
}
