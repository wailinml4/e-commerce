export const toNumber = (value: string | number | null | undefined): number => {
  if (typeof value === 'number') return value
  if (!value) return 0
  return Number(value)
}

export const withId = <T extends { id: string }>(row: T): Omit<T, 'id'> & { id: string } => {
  const { id, ...rest } = row
  return { ...rest, id: id }
}
