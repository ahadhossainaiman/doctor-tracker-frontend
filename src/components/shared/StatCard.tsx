type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="rounded-card border border-border bg-surface-raised p-5 shadow-card">
      <h2 className="text-sm font-medium text-text-muted">{label}</h2>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-text tabular-nums">
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-text-muted">{hint}</p> : null}
    </article>
  );
}
