import { DateRanges } from '../types/index.js'

const getDateRanges = (): DateRanges => {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const yearStart = new Date(now.getFullYear(), 0, 1)

  return { todayStart, monthStart, yearStart }
}

export default getDateRanges
