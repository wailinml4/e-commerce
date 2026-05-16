import { useEffect, useMemo, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/useUserStore'
import { useTableState } from '../../hooks/useTableState'
import { useDeleteModal } from '../../hooks/useModal'
import { DEFAULT_ITEMS_PER_PAGE } from '../../constants'
import type { User } from '../../types'

import CustomerFilters from './CustomerFilters'
import CustomerTable from './CustomerTable'
import ConfirmModal from '../shared/ConfirmModal'
import Pagination from '../shared/Pagination'
import CustomerOrderHistoryModal from './CustomerOrderHistoryModal'
import LoadingSpinner from '../shared/LoadingSpinner'

interface ViewModalState {
  user: User | null
  isOpen: boolean
}

const CustomerManagement = () => {
  const { users, getAllUsers, deleteUser, isUsersLoading } = useUserStore()

  const { searchTerm, setSearchTerm, currentPage, setCurrentPage, itemsPerPage, filters, setFilter, clearFilters } = useTableState({
    initialItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    initialFilters: { role: 'all', sort: 'date-desc' },
  })

  const { isDeleteOpen, openDelete, closeDelete, confirmDelete } = useDeleteModal()
  const [viewModalState, setViewModalState] = useState<ViewModalState>({
    user: null,
    isOpen: false,
  })

  useEffect(() => {
    getAllUsers()
  }, [getAllUsers])

  const filterFn = useCallback(
    (user: User, search: string) => {
      const matchesSearch =
        !search || user.name?.toLowerCase().includes(search.toLowerCase()) || user.email?.toLowerCase().includes(search.toLowerCase())
      const matchesRole = filters.role === 'all' || user.role === filters.role
      return matchesSearch && matchesRole
    },
    [filters.role],
  )

  const sortFn = useCallback(
    (a: User, b: User) => {
      switch (filters.sort) {
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '')
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '')
        case 'date-asc':
          return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
        case 'date-desc':
          return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        default:
          return 0
      }
    },
    [filters.sort],
  )

  const {
    data: paginatedUsers,
    totalItems,
    totalPages,
  } = useMemo(() => {
    if (!users) return { data: [], totalItems: 0, totalPages: 0 }

    const filtered = users.filter(user => filterFn(user, searchTerm))
    const sorted = [...filtered].sort(sortFn)

    const start = (currentPage - 1) * itemsPerPage
    const paginated = sorted.slice(start, start + itemsPerPage)

    return {
      data: paginated,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    }
  }, [users, searchTerm, currentPage, itemsPerPage, filterFn, sortFn])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }, [])

  const handleDeleteClick = useCallback(
    (userId: string) => {
      openDelete(userId)
    },
    [openDelete],
  )

  const handleConfirmDelete = useCallback(() => {
    confirmDelete(id => deleteUser(id as string))
  }, [confirmDelete, deleteUser])

  
  const handleViewOrders = useCallback((user: User) => {
    setViewModalState({ user, isOpen: true })
  }, [])

  const handleCloseViewModal = useCallback(() => {
    setViewModalState({ user: null, isOpen: false })
  }, [])

  const handleRoleFilterChange = useCallback(
    (value: string) => {
      setFilter('role', value)
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

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="">
        <CustomerFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={filters.role}
          onRoleChange={handleRoleFilterChange}
          sortBy={filters.sort}
          onSortChange={handleSortChange}
          onClear={handleClearFilters}
          onRefresh={getAllUsers}
          isLoading={isUsersLoading}
        />

        {isUsersLoading ? (
          <LoadingSpinner />
        ) : totalItems === 0 ? (
          <div className="text-center py-12 text-gray-400">No users found</div>
        ) : (
          <>
            <CustomerTable
              users={paginatedUsers}
              onViewOrders={handleViewOrders}
              onDelete={handleDeleteClick}
              formatDate={formatDate}
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
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-red-600 text-white hover:bg-red-700"
      />

      <CustomerOrderHistoryModal isOpen={viewModalState.isOpen} onClose={handleCloseViewModal} user={viewModalState.user} />
    </motion.div>
  )
}

export default CustomerManagement
