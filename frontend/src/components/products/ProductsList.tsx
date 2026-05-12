import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useProductStore } from '../../stores/useProductStore'
import { useTableState } from '../../hooks/useTableState'
import { useDeleteModal } from '../../hooks/useModal'
import { DEFAULT_ITEMS_PER_PAGE } from '../../constants'
import toast from 'react-hot-toast'

import ProductFilters from './ProductFilters'
import ProductTable from './ProductTable'
import EditProductModal from './EditProductModal'
import ConfirmModal from '../shared/ConfirmModal'
import Pagination from '../shared/Pagination'
import LoadingSpinner from '../shared/LoadingSpinner'
import type { Product } from '../../types'

const ProductsList = () => {
  const { deleteProduct, products, updateProduct, getAllProducts, toggleFeaturedProduct, toggleStatus, isLoading } = useProductStore()

  const { searchTerm, setSearchTerm, currentPage, setCurrentPage, itemsPerPage, filters, setFilter, clearFilters } = useTableState({
    initialItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    initialFilters: { category: 'all', sort: 'date-desc' },
  })

  const { isDeleteOpen, openDelete, closeDelete, confirmDelete } = useDeleteModal()

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const filterFn = useCallback(
    (product: Product, search: string) => {
      const matchesSearch =
        search === '' ||
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = filters.category === 'all' || product.category === filters.category
      return matchesSearch && matchesCategory
    },
    [filters.category],
  )

  const sortFn = useCallback(
    (a: Product, b: Product) => {
      switch (filters.sort) {
        case 'date-desc':
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        case 'date-asc':
          return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        default:
          return 0
      }
    },
    [filters.sort],
  )

  const {
    data: paginatedProducts,
    totalItems,
    totalPages,
  } = useMemo(() => {
    if (!products) return { data: [], totalItems: 0, totalPages: 0 }

    const filtered = products.filter(product => filterFn(product, searchTerm))
    const sorted = [...filtered].sort(sortFn)

    const start = (currentPage - 1) * itemsPerPage
    const paginated = sorted.slice(start, start + itemsPerPage)

    return {
      data: paginated,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    }
  }, [products, searchTerm, filters, currentPage, itemsPerPage, filterFn, sortFn])

  const handleDeleteClick = useCallback(
    (productId: string) => {
      openDelete(productId)
    },
    [openDelete],
  )

  const handleConfirmDelete = useCallback(() => {
    confirmDelete(id => deleteProduct(id as string))
  }, [confirmDelete, deleteProduct])

  const handleEditClick = useCallback((product: Product) => {
    setEditingProduct(product)
    setIsEditModalOpen(true)
  }, [])

  const handleEditClose = useCallback(() => {
    setIsEditModalOpen(false)
    setEditingProduct(null)
  }, [])

  const handleEditSave = useCallback(
    async (productId: string, formData: Record<string, unknown>) => {
      setIsUpdating(true)
      try {
        await updateProduct(productId, formData)
        handleEditClose()
      } catch (__error) {
        toast.error('Failed to update product')
      } finally {
        setIsUpdating(false)
      }
    },
    [updateProduct, handleEditClose],
  )

  const handleToggleFeatured = useCallback(
    (productId: string) => {
      toggleFeaturedProduct(productId)
    },
    [toggleFeaturedProduct],
  )

  const handleToggleStatus = useCallback(
    async (productId: string) => {
      try {
        await toggleStatus(productId)
      } catch (error) {
        toast.error('Failed to toggle product status')
      }
    },
    [toggleStatus],
  )

  const handleCategoryChange = useCallback(
    (value: string) => {
      setFilter('category', value)
    },
    [setFilter],
  )

  const handleSortChange = useCallback(
    (value: string) => {
      setFilter('sort', value)
    },
    [setFilter],
  )

  const handleClearFilters = useCallback(() => {
    clearFilters()
  }, [clearFilters])

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
    },
    [setCurrentPage],
  )

  const handleRefresh = useCallback(() => {
    getAllProducts()
  }, [getAllProducts])

  useEffect(() => {
    getAllProducts()
  }, [getAllProducts])

  return (
    <motion.div
      className="bg-neutral-950 shadow-lg rounded-lg overflow-hidden border border-neutral-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categoryFilter={filters.category}
          onCategoryChange={handleCategoryChange}
          sortBy={filters.sort}
          onSortChange={handleSortChange}
          onClear={handleClearFilters}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />

        {isLoading ? (
          <LoadingSpinner variant="table" />
        ) : totalItems === 0 ? (
          <div className="text-center py-12 text-gray-400">No products found</div>
        ) : (
          <>
            <ProductTable
              products={paginatedProducts}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onToggleFeatured={handleToggleFeatured}
              onToggleStatus={handleToggleStatus}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 text-white hover:bg-red-700"
      />

      <EditProductModal
        product={editingProduct}
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
        isLoading={isUpdating}
      />
    </motion.div>
  )
}

export default ProductsList
