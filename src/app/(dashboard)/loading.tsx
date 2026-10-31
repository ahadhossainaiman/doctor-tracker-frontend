import { ListSkeleton, StatCardSkeleton } from "@/components/shared/Skeletons";

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 md:px-8">
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
