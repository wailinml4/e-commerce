import { useEffect, useMemo, useCallback, useState } from 'react'
import type { Order, OrderStatus } from '../../types'
import { motion } from 'framer-motion'
import { useOrderStore } from '../../stores/useOrderStore'
import { useTableState } from '../../hooks/useTableState'
import { DEFAULT_ITEMS_PER_PAGE } from '../../constants'

import OrderFilters from './OrderFilters'
import OrderTable from './OrderTable'
import Pagination from '../shared/Pagination'
import LoadingSpinner from '../shared/LoadingSpinner'

const getDateRangeDates = (dateRange: string, customStart: string, customEnd: string) => {
  const now = new Date()
  switch (dateRange) {
    case '7days':
      return {
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        end: null,
      }
    case '30days':
      return {
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        end: null,
      }
    case '90days':
      return {
        start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        end: null,
      }
    case 'thisMonth':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: null,
      }
    case 'lastMonth':
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: null,
      }
    case 'thisYear':
      return { start: new Date(now.getFullYear(), 0, 1), end: null }
    case 'custom':
      return {
        start: customStart ? new Date(customStart) : null,
        end: customEnd ? new Date(customEnd) : null,
      }
    default:
      return { start: null, end: null }
  }
}

const OrderManagement = () => {
  const { orders, getAllOrders, updateOrderStatus, isLoading } = useOrderStore()

  const [dateRange, setDateRange] = useState('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filters,
    setFilter,
    clearFilters: clearTableFilters,
  } = useTableState({
    initialItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    initialFilters: { status: 'all', sort: 'date-desc' },
  })

  
  useEffect(() => {
    getAllOrders()
  }, [getAllOrders])

  const filterFn = useCallback(
    (order: Order, search: string, dateRangeValue: string, customStart: string, customEnd: string) => {
      const matchesStatus = filters.status === 'all' || order.status === filters.status
      const matchesSearch =
        !search ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(search.toLowerCase())

      const { start, end } = getDateRangeDates(dateRangeValue, customStart, customEnd)
      const matchesDateRange = !start || new Date(order.createdAt) >= start
      const matchesEndDate = !end || new Date(order.createdAt) <= end

      return matchesStatus && matchesSearch && matchesDateRange && matchesEndDate
    },
    [filters.status],
  )

  const sortFn = useCallback(
    (a: Order, b: Order) => {
      switch (filters.sort) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'amount-desc':
          return (b.totalAmount ?? 0) - (a.totalAmount ?? 0)
        case 'amount-asc':
          return (a.totalAmount ?? 0) - (b.totalAmount ?? 0)
        default:
          return 0
      }
    },
    [filters.sort],
  )

  const {
    data: paginatedOrders,
    totalItems,
    totalPages,
  } = useMemo(() => {
    if (!orders) return { data: [], totalItems: 0, totalPages: 0 }

    const filtered = orders.filter(order => filterFn(order, searchTerm, dateRange, customStartDate, customEndDate))
    const sorted = [...filtered].sort(sortFn)

    const start = (currentPage - 1) * itemsPerPage
    const paginated = sorted.slice(start, start + itemsPerPage)

    return {
      data: paginated,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    }
  }, [orders, searchTerm, filters, dateRange, customStartDate, customEndDate, currentPage, itemsPerPage, filterFn, sortFn])

  const handleClearFilters = useCallback(() => {
    setDateRange('all')
    setCustomStartDate('')
    setCustomEndDate('')
    clearTableFilters()
  }, [clearTableFilters])

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

  const handleStatusUpdate = useCallback(
    (orderId: string, status: OrderStatus) => {
      updateOrderStatus(orderId, status)
    },
    [updateOrderStatus],
  )

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="">
        <OrderFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={filters.status}
          onStatusChange={handleStatusChange}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onCustomStartChange={setCustomStartDate}
          onCustomEndChange={setCustomEndDate}
          sortBy={filters.sort}
          onSortChange={handleSortChange}
          onClear={handleClearFilters}
          onRefresh={getAllOrders}
          isLoading={isLoading}
        />

        {isLoading ? (
          <LoadingSpinner variant="table" />
        ) : totalItems === 0 ? (
          <div className="text-center py-12 text-gray-400">No orders found</div>
        ) : (
          <>
            <OrderTable orders={paginatedOrders} onStatusChange={handleStatusUpdate} />

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

export default OrderManagement
