import { Skeleton } from "@/shared/components/ui/skeleton";

export function ChecklistWorkspaceSkeleton() {
  return (
    // We use grid-cols-1 for mobile and grid-cols-[fixed_1fr] for desktop
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
      {/* Sidebar Skeleton */}
      {/* h-fit prevents the sidebar from stretching if the table is very long */}
      <div className="h-fit space-y-6 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
        <Skeleton className="h-5 w-32" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content / Table Skeleton */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        {/* Header Section of the Workspace */}
        <div className="flex flex-col justify-between gap-4 border-b p-6 sm:flex-row sm:items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-full max-w-xs rounded-lg" />
        </div>

        {/* Rows Section */}
        <div className="space-y-6 p-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 border-b border-slate-50 pb-6 last:border-0 last:pb-0"
            >
              <Skeleton className="h-5 w-5 shrink-0 rounded" />{" "}
              {/* Checkbox/Index */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" /> {/* Main Title */}
                <Skeleton className="h-3 w-1/2" /> {/* Subtitle */}
              </div>
              <div className="hidden items-center gap-4 md:flex">
                <Skeleton className="h-8 w-24 rounded-full" />{" "}
                {/* Status Tag */}
                <Skeleton className="h-4 w-20" /> {/* Date */}
                <Skeleton className="h-8 w-8 rounded-md" />{" "}
                {/* Action button */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
