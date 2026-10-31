"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { ChartCardSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";

const DEFAULT_RANGES = ["7d", "30d", "90d", "12m"] as const;

export type ChartPoint = {
  label: string;
  value: number;
};

type ChartCardProps = {
  title: string;
  data: ChartPoint[];
  range?: string;
  ranges?: readonly string[];
  onRangeChange?: (range: string) => void;
  loading?: boolean;
  children?: ReactNode;
};

export function ChartCard({
  title,
  data,
  range = "30d",
  ranges = DEFAULT_RANGES,
  onRangeChange,
  loading = false,
  children,
}: ChartCardProps) {
  const [showData, setShowData] = useState(false);

  return (
    <section className="lift-card @container rounded-card border border-border bg-surface-raised p-5 shadow-card">
      <div className="flex flex-col gap-3 @md:flex-row @md:items-center @md:justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-text">{title}</h2>
        <div className="flex flex-wrap items-center gap-2">
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
          <Button
            type="button"
            variant="outline"
            className="h-11 px-3"
            aria-pressed={showData}
            disabled={loading}
            onClick={() => setShowData((current) => !current)}
          >
            View data
          </Button>
        </div>
      </div>
      <div className="mt-4 min-h-48">
        {loading ? (
          <ChartCardSkeleton />
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
