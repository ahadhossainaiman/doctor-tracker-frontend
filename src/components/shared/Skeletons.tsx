function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export function StatCardSkeleton({ withSparkline = false }: { withSparkline?: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-card border border-border bg-surface-raised p-5 shadow-card"
    >
      <span className="sr-only">Loading</span>
      <Bone className="h-4 w-24" />
      <Bone className="mt-2 h-8 w-20" />
      {withSparkline ? (
        <>
          <Bone className="mt-3 h-8 w-full" />
          <Bone className="mt-2 h-3 w-32" />
        </>
      ) : (
        <Bone className="mt-3 h-3 w-32" />
      )}
    </div>
  );
}

export function ChartCardSkeleton({ framed = false }: { framed?: boolean }) {
  const body = <Bone className="h-48 w-full" />;

  if (!framed) {
    return (
      <div role="status" aria-live="polite" className="h-48">
        <span className="sr-only">Loading chart</span>
        {body}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-card border border-border bg-surface-raised p-5 shadow-card"
    >
      <span className="sr-only">Loading chart</span>
      <Bone className="h-6 w-40" />
      <div className="mt-3 flex flex-wrap gap-2">
        <Bone className="h-11 w-12" />
        <Bone className="h-11 w-12" />
        <Bone className="h-11 w-12" />
        <Bone className="h-11 w-12" />
        <Bone className="h-11 w-24" />
      </div>
      <div className="mt-4">{body}</div>
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
          <Bone key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
