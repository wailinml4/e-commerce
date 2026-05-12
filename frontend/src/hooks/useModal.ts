import { useState, useCallback } from 'react'

export const useModal = <T = unknown>(initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)
  const [data, setData] = useState<T | null>(null)

  const open = useCallback((modalData: T | null = null) => {
    setData(modalData)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  }
}

export const useDeleteModal = <T = unknown>() => {
  const [itemToDelete, setItemToDelete] = useState<T | null>(null)

  const openDelete = useCallback((item: T) => {
    setItemToDelete(item)
  }, [])

  const closeDelete = useCallback(() => {
    setItemToDelete(null)
  }, [])

  const confirmDelete = useCallback(
    (onConfirm?: (item: T) => void) => {
      if (itemToDelete && onConfirm) {
        onConfirm(itemToDelete)
      }
      closeDelete()
    },
    [itemToDelete, closeDelete],
  )

  return {
    itemToDelete,
    isDeleteOpen: itemToDelete !== null,
    openDelete,
    closeDelete,
    confirmDelete,
  }
}
