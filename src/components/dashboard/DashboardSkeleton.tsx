import { ChartCardSkeleton, StatCardSkeleton } from "@/components/shared/Skeletons";
import { pageClass } from "@/lib/page";

export function DashboardSkeleton() {
  return (
    <div className={pageClass}>
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton withSparkline />
        <StatCardSkeleton />
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ChartCardSkeleton framed />
        </div>
        <div className="lg:col-span-2">
          <ChartCardSkeleton framed />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCardSkeleton framed />
        <ChartCardSkeleton framed />
      </div>
    </div>
  );
}
