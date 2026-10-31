export function StatCardSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-card border border-border bg-surface-raised p-5 shadow-card"
    >
      <span className="sr-only">Loading</span>
      <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
      <div className="mt-3 h-8 w-20 animate-pulse rounded-md bg-muted" />
      <div className="mt-3 h-3 w-32 animate-pulse rounded-md bg-muted" />
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-card border border-border bg-surface-raised p-5 shadow-card"
    >
      <span className="sr-only">Loading</span>
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="h-10 animate-pulse rounded-md bg-muted"
          />
        ))}
      </div>
    </div>
  );
}
