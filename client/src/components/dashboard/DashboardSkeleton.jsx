import { Skeleton } from '../ui/LoadingSkeleton';

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-40" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="mt-5 space-y-2">
          <div className="flex justify-between"><Skeleton className="h-3 w-28" /><Skeleton className="h-3 w-12" /></div>
          <Skeleton className="h-2.5 w-full" />
        </div>
        <Skeleton className="h-3 w-72 mt-4" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <Skeleton className="h-8 w-8 rounded-lg mb-3" />
            <Skeleton className="h-6 w-14 mb-1" />
            <Skeleton className="h-3 w-20 mb-0.5" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="text-center space-y-1">
                  <Skeleton className="h-6 w-10 mx-auto" />
                  <Skeleton className="h-3 w-14 mx-auto" />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j}>
                  <div className="flex justify-between mb-1"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-8" /></div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <Skeleton className="h-4 w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardSkeleton;
