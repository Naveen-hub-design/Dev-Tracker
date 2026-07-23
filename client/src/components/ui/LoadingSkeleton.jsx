export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse bg-slate-100 rounded-lg ${className}`}
      {...props}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-5 w-24 mt-3" />
    </div>
  );
}

export function ChartSkeleton({ height = 220 }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className={`w-full`} style={{ height }} />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
      <ChartSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}
