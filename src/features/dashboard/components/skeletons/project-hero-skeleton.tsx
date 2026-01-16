import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProjectHeroSkeleton() {
  return (
    <div className="grid grid-cols-1 rounded-xl border border-slate-100 bg-white p-1 shadow-sm lg:grid-cols-4">
      {/* Left Section: Takes 3 out of 4 columns on large screens */}
      <div className="space-y-8 py-5 pr-5 lg:col-span-3">
        <div className="space-y-3 px-5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Inner Grid for the info stats */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 px-5 md:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Section: Takes 1 column, shows the vertical border on LG screens */}
      <div className="flex items-center gap-6 border-t p-6 lg:col-span-1 lg:border-t-0 lg:border-l">
        <Skeleton className="h-24 w-24 shrink-0 rounded-full md:h-32 md:w-32" />
        <div className="space-y-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}
