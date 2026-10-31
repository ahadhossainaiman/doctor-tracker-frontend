"use client";

import { X } from "lucide-react";

type FilterChipProps = {
  label: string;
  onRemove: () => void;
};

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface-raised pl-3 text-sm text-text">
      {label}
      <button
        type="button"
        className="ml-1 inline-flex size-11 items-center justify-center rounded-full text-text-muted hover:bg-muted hover:text-text focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </span>
  );
}
