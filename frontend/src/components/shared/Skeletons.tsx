const SkeletonBlock = ({ className = '' }) => <div className={`animate-pulse rounded bg-gray-200 ${className}`} />

export const PageSkeleton = () => (
  <div className="min-h-screen bg-white px-4 pt-28 pb-12">
    <div className="mx-auto max-w-7xl space-y-8">
      <SkeletonBlock className="mx-auto h-10 w-64" />
      <SkeletonBlock className="mx-auto h-4 w-96 max-w-full" />
      <ProductGridSkeleton />
    </div>
  </div>
)

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="space-y-4">
        <SkeletonBlock className="aspect-square w-full rounded-lg" />
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-4 w-1/3" />
      </div>
    ))}
  </div>
)

export const TableSkeleton = ({ rows = 6 }) => (
  <div className="space-y-3 py-4">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="grid grid-cols-5 gap-4 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
        <SkeletonBlock className="h-4 bg-neutral-800" />
        <SkeletonBlock className="h-4 bg-neutral-800" />
        <SkeletonBlock className="h-4 bg-neutral-800" />
        <SkeletonBlock className="h-4 bg-neutral-800" />
        <SkeletonBlock className="h-4 bg-neutral-800" />
      </div>
    ))}
  </div>
)

export const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-white px-4 pt-24 pb-12">
    <div className="mx-auto max-w-7xl">
      <SkeletonBlock className="mb-8 h-5 w-32" />
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <SkeletonBlock className="h-96 w-full rounded-lg" />
        <div className="space-y-6">
          <SkeletonBlock className="h-7 w-24 rounded-full" />
          <SkeletonBlock className="h-12 w-3/4" />
          <SkeletonBlock className="h-9 w-32" />
          <SkeletonBlock className="h-24 w-full" />
          <SkeletonBlock className="h-14 w-full rounded-full" />
          <SkeletonBlock className="h-40 w-full rounded-lg" />
        </div>
      </div>
    </div>
  </div>
)

export const OrderListSkeleton = () => (
  <div className="min-h-screen bg-white px-4 pt-24 pb-12">
    <div className="mx-auto max-w-7xl space-y-4">
      <SkeletonBlock className="mx-auto mb-8 h-10 w-48" />
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonBlock key={index} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  </div>
)

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <SkeletonBlock className="h-10 w-48 bg-neutral-800" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonBlock key={index} className="h-28 bg-neutral-800" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonBlock key={index} className="h-80 bg-neutral-800" />
      ))}
    </div>
  </div>
)
