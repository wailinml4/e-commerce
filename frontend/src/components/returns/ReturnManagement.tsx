import { useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useOrderStore } from '../../stores/useOrderStore'
import type { Order } from '../../types'
import { useTableState } from '../../hooks/useTableState'
import { DEFAULT_ITEMS_PER_PAGE } from '../../constants'

import ReturnFilters from './ReturnFilters'
import ReturnTable from './ReturnTable'
import Pagination from '../shared/Pagination'
import LoadingSpinner from '../shared/LoadingSpinner'

const ReturnManagement = () => {
  const { returnRequests, getReturnRequests, approveReturn, rejectReturn, isLoading } = useOrderStore()

  const { searchTerm, setSearchTerm, currentPage, setCurrentPage, itemsPerPage, filters, setFilter, clearFilters } = useTableState({
    initialItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    initialFilters: { status: 'all', sort: 'date-desc' },
  })

  
  useEffect(() => {
    getReturnRequests()
  }, [getReturnRequests])

  const filterFn = useCallback(
    (order: Order, search: string) => {
      if (order.returnStatus === 'none') return false

      const matchesStatus = filters.status === 'all' || order.returnStatus === filters.status
      const matchesSearch =
        !search ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(search.toLowerCase())

      return matchesStatus && matchesSearch
    },
    [filters.status],
  )

  const sortFn = useCallback(
    (a: Order, b: Order) => {
      switch (filters.sort) {
        case 'date-desc':
          return new Date(b.returnRequestedAt ?? 0).getTime() - new Date(a.returnRequestedAt ?? 0).getTime()
        case 'date-asc':
          return new Date(a.returnRequestedAt ?? 0).getTime() - new Date(b.returnRequestedAt ?? 0).getTime()
        case 'amount-desc':
          return b.totalAmount - a.totalAmount
        case 'amount-asc':
          return a.totalAmount - b.totalAmount
        default:
          return 0
      }
    },
    [filters.sort],
  )

  const {
    data: paginatedReturns,
    totalItems,
    totalPages,
  } = useMemo(() => {
    if (!returnRequests) return { data: [], totalItems: 0, totalPages: 0 }

    const filtered = returnRequests.filter(order => filterFn(order, searchTerm))
    const sorted = [...filtered].sort(sortFn)

    const start = (currentPage - 1) * itemsPerPage
    const paginated = sorted.slice(start, start + itemsPerPage)

    return {
      data: paginated,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    }
  }, [returnRequests, searchTerm, filters, currentPage, itemsPerPage, filterFn, sortFn])

  const handleStatusChange = useCallback(
    (value: string) => {
      setFilter('status', value)
    },
    [setFilter],
  )

  const handleSortChange = useCallback(
    (value: string) => {
      setFilter('sort', value)
    },
    [setFilter],
  )

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
    },
    [setCurrentPage],
  )

  
  const handleApprove = useCallback(
    async (orderId: string) => {
      await approveReturn(orderId)
      getReturnRequests()
    },
    [approveReturn, getReturnRequests],
  )

  const handleReject = useCallback(
    async (orderId: string) => {
      await rejectReturn(orderId)
      getReturnRequests()
    },
    [rejectReturn, getReturnRequests],
  )

  const handleClearFilters = useCallback(() => {
    clearFilters()
  }, [clearFilters])

  return (
    <motion.div
      className="bg-neutral-950 shadow-lg rounded-lg overflow-hidden border border-neutral-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <ReturnFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={filters.status}
          onStatusChange={handleStatusChange}
          sortBy={filters.sort}
          onSortChange={handleSortChange}
          onClear={handleClearFilters}
          onRefresh={getReturnRequests}
          isLoading={isLoading}
        />

        {isLoading ? (
          <LoadingSpinner variant="table" />
        ) : totalItems === 0 ? (
          <div className="text-center py-12 text-gray-400">No return requests found</div>
        ) : (
          <>
            <ReturnTable returns={paginatedReturns} onApprove={handleApprove} onReject={handleReject} />

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
    </motion.div>
  )
}

export default ReturnManagement
