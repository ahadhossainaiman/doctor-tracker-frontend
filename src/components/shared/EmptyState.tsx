import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-card border border-dashed border-border bg-surface-raised px-6 py-10">
      <h2 className="text-xl font-semibold text-text">{title}</h2>
      <p className="max-w-md text-sm text-text-muted">{description}</p>
      {action}
    </div>
  );
}
