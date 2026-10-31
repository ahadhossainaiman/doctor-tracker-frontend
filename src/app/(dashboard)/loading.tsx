import { ListSkeleton, StatCardSkeleton } from "@/components/shared/Skeletons";
import { pageClass } from "@/lib/page";

export default function DashboardLoading() {
  return (
    <div className={pageClass}>
      <div className="space-y-2" role="status" aria-live="polite">
        <span className="sr-only">Loading page</span>
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <ListSkeleton />
    </div>
  );
}
