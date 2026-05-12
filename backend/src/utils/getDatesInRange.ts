const getDatesInRange = (startDate: Date, endDate: Date): string[] => {
  const dates: string[] = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0]
    if (dateStr) {
      dates.push(dateStr)
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

export default getDatesInRange
