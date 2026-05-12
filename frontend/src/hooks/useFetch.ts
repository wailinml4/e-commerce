import { useState, useEffect, useCallback } from 'react'

const useFetch = <T>(fetchFn: (...args: unknown[]) => Promise<T>, immediate = true) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<unknown>(null)

  const execute = useCallback(
    async (...args: unknown[]): Promise<T> => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchFn(...args)
        setData(result)
        return result
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [fetchFn],
  )

  const refetch = useCallback((): Promise<T> => {
    return execute()
  }, [execute])

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  return {
    data,
    loading,
    error,
    execute,
    refetch,
    reset,
  }
}

export default useFetch
