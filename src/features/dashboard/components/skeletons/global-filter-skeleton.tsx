import { Skeleton } from "@/shared/components/ui/skeleton";

export function GlobalFilterSkeleton() {
  return (
    <div className="flex flex-wrap items-end gap-y-2.5 rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="min-w-[180px] flex-1 space-y-2">
          <Skeleton className="h-3 w-16" /> {/* Label */}
          <Skeleton className="h-10 w-full rounded-lg" /> {/* Select box */}
        </div>
      ))}
      <Skeleton className="h-10 w-28 rounded-lg" /> {/* Button */}
    </div>
  );
}
