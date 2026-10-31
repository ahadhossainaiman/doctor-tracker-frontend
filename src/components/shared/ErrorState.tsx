"use client";

import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title: string;
  description: string;
  onRetry: () => void;
};

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-card border border-border bg-surface-raised px-6 py-10"
    >
      <h2 className="text-xl font-semibold text-text">{title}</h2>
      <p className="max-w-md text-sm text-text-muted">{description}</p>
      <Button type="button" className="h-11 px-4" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
