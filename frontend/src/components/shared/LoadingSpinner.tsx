import { DashboardSkeleton, OrderListSkeleton, PageSkeleton, ProductDetailSkeleton, ProductGridSkeleton, TableSkeleton } from './Skeletons'

const LoadingSpinner = ({ variant = 'page' }) => {
  if (variant === 'products') {
    return <ProductGridSkeleton />
  }

  if (variant === 'detail') {
    return <ProductDetailSkeleton />
  }

  if (variant === 'orders') {
    return <OrderListSkeleton />
  }

  if (variant === 'dashboard') {
    return <DashboardSkeleton />
  }

  if (variant === 'table') {
    return <TableSkeleton />
  }

  return <PageSkeleton />
}

export default LoadingSpinner
