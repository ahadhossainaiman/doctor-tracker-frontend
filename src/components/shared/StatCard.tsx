type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  sparkline?: number[];
  delta?: number;
  deltaLabel?: string;
};

function Sparkline({ values }: { values: number[] }) {
  const width = 120;
  const height = 32;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : 0;
  const points = values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / span) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-8 w-full text-brand"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

function formatDelta(delta: number) {
  return `${new Intl.NumberFormat("en", {
    signDisplay: "always",
    maximumFractionDigits: 1,
  }).format(delta)}%`;
}

export function StatCard({
  label,
  value,
  hint,
  sparkline,
  delta,
  deltaLabel = "vs previous period",
}: StatCardProps) {
  const deltaClass =
    delta === undefined
      ? ""
      : delta > 0
        ? "text-success-text"
        : delta < 0
          ? "text-danger-text"
          : "text-text-muted";

  return (
    <article className="panel lift-card flex h-full flex-col @container rounded-card p-5">
      <h2 className="text-sm font-medium text-text-muted">{label}</h2>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-text tabular-nums">
        {value}
      </p>
      {sparkline && sparkline.length > 0 ? (
        <div className="mt-3">
          <Sparkline values={sparkline} />
        </div>
      ) : null}
      {delta !== undefined ? (
        <p className="mt-2 text-xs text-text-muted">
          <span className={`font-medium tabular-nums ${deltaClass}`}>
            {formatDelta(delta)}
          </span>{" "}
          {deltaLabel}
        </p>
      ) : null}
      {hint ? <p className="mt-2 text-xs text-text-muted">{hint}</p> : null}
    </article>
  );
}
