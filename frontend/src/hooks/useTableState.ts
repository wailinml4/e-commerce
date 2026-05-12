import { useState, useCallback } from 'react'
import type { SortConfig } from '../types'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_SORT } from '../constants'

interface TableStateOptions<F extends Record<string, string>> {
  initialItemsPerPage?: number
  initialSort?: SortConfig
  initialFilters?: F
}

export const useTableState = <F extends Record<string, string> = Record<string, string>>(options: TableStateOptions<F> = {}) => {
  const { initialItemsPerPage = DEFAULT_ITEMS_PER_PAGE, initialSort = DEFAULT_SORT, initialFilters = {} as F } = options

  const [searchTerm, setSearchTermState] = useState('')
  const [currentPage, setCurrentPageState] = useState(1)
  const [itemsPerPage] = useState(initialItemsPerPage)
  const [sortConfig, setSortConfigState] = useState<SortConfig>(initialSort)
  const [filters, setFilters] = useState<F>(initialFilters)

  const setSearchTerm = useCallback((value: string) => {
    setSearchTermState(value)
    setCurrentPageState(1)
  }, [])

  const setFilter = useCallback((key: keyof F, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPageState(1)
  }, [])

  const setSortConfig = useCallback((field: string) => {
    setSortConfigState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }, [])

  const setCurrentPage = useCallback((page: number) => {
    setCurrentPageState(page)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTermState('')
    setFilters(initialFilters)
    setSortConfigState(initialSort)
    setCurrentPageState(1)
  }, [initialFilters, initialSort])

  const filterData = useCallback(
    <T>(data: T[], filterFn?: (item: T, search: string) => boolean): T[] => {
      if (!data) return []

      let filtered = data

      if (searchTerm && filterFn) {
        filtered = filtered.filter(item => filterFn(item, searchTerm))
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          filtered = filtered.filter(item => {
            const itemValue = (item as Record<string, unknown>)[key]
            if (Array.isArray(itemValue)) {
              return itemValue.includes(value)
            }
            return itemValue === value
          })
        }
      })

      return filtered
    },
    [searchTerm, filters],
  )

  const sortData = useCallback(
    <T>(data: T[], sortFn?: (a: T, b: T, config: SortConfig) => number): T[] => {
      if (!data || !sortFn) return data
      return [...data].sort((a, b) => sortFn(a, b, sortConfig))
    },
    [sortConfig],
  )

  const paginateData = useCallback(
    <T>(data: T[]): T[] => {
      if (!data) return []
      const start = (currentPage - 1) * itemsPerPage
      const end = start + itemsPerPage
      return data.slice(start, end)
    },
    [currentPage, itemsPerPage],
  )

  const processData = useCallback(
    <T>(data: T[], filterFn?: (item: T, search: string) => boolean, sortFn?: (a: T, b: T, config: SortConfig) => number) => {
      const filtered = filterData(data, filterFn)
      const sorted = sortData(filtered, sortFn)
      const paginated = paginateData(sorted)

      return {
        data: paginated,
        totalItems: filtered.length,
        totalPages: Math.ceil(filtered.length / itemsPerPage),
      }
    },
    [filterData, sortData, paginateData, itemsPerPage],
  )

  return {
    searchTerm,
    currentPage,
    itemsPerPage,
    sortConfig,
    filters,

    setSearchTerm,
    setCurrentPage,
    setSortConfig,
    setFilter,
    clearFilters,

    filterData,
    sortData,
    paginateData,
    processData,
  }
}
