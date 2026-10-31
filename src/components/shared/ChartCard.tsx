"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { ChartCardSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";

const DEFAULT_RANGES = ["7d", "30d", "90d", "12m"] as const;

export type ChartPoint = {
  label: string;
  value: number;
  href?: string;
};

type ChartCardProps = {
  title: string;
  data: ChartPoint[];
  range?: string;
  ranges?: readonly string[];
  onRangeChange?: (range: string) => void;
  interval?: string;
  intervals?: readonly string[];
  onIntervalChange?: (interval: string) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyLabel?: string;
  children?: ReactNode;
};

export function ChartCard({
  title,
  data,
  range = "30d",
  ranges = DEFAULT_RANGES,
  onRangeChange,
  interval,
  intervals = [],
  onIntervalChange,
  loading = false,
  error,
  onRetry,
  emptyLabel = "No data yet.",
  children,
}: ChartCardProps) {
  const [showData, setShowData] = useState(false);

  return (
    <section className="panel lift-card flex h-full flex-col @container rounded-card p-5">
      <div className="flex flex-col gap-3 @md:flex-row @md:items-center @md:justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-text">{title}</h2>
        <div className="flex flex-wrap items-center gap-2">
          {ranges.length > 0 ? (
          <div role="radiogroup" aria-label={`${title} range`} className="flex flex-wrap gap-1">
            {ranges.map((item) => {
              const selected = item === range;
              return (
                <Button
                  key={item}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  variant={selected ? "default" : "outline"}
                  className="h-11 px-3"
                  disabled={loading}
                  onClick={() => onRangeChange?.(item)}
                >
                  {item}
                </Button>
              );
            })}
          </div>
          ) : null}
          {intervals.length > 0 ? (
            <div role="radiogroup" aria-label={`${title} interval`} className="flex flex-wrap gap-1">
              {intervals.map((item) => {
                const selected = item === interval;
                return (
                  <Button
                    key={item}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    variant={selected ? "default" : "outline"}
                    className="h-11 px-3 capitalize"
                    disabled={loading}
                    onClick={() => onIntervalChange?.(item)}
                  >
                    {item}
                  </Button>
                );
              })}
            </div>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="h-11 px-3"
            aria-pressed={showData}
            disabled={loading || Boolean(error)}
            onClick={() => setShowData((current) => !current)}
          >
            View data
          </Button>
        </div>
      </div>
      <div className="mt-4 min-h-48 flex-1">
        {loading ? (
          <ChartCardSkeleton />
        ) : error ? (
          <div role="alert" className="flex h-48 flex-col items-start justify-center gap-3">
            <p className="text-sm text-text-muted">{error}</p>
            {onRetry ? (
              <Button type="button" className="h-11 px-4" onClick={onRetry}>
                Retry
              </Button>
            ) : null}
          </div>
        ) : data.length === 0 ? (
          <p className="flex h-48 items-center text-sm text-text-muted">{emptyLabel}</p>
        ) : showData ? (
          <div className="max-h-48 overflow-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">{title}</caption>
              <thead>
                <tr className="text-text-muted">
                  <th scope="col" className="py-2 text-left font-medium">
                    Label
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((point) => (
                  <tr key={point.label} className="border-t border-border">
                    <th scope="row" className="py-2 text-left font-normal text-text">
                      {point.label}
                    </th>
                    <td className="py-2 text-right text-text tabular-nums">
                      {new Intl.NumberFormat("en").format(point.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div role="img" aria-label={title} className="h-48">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
