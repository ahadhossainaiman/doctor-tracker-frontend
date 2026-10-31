"use client";

import { PAGE_SIZE_OPTIONS, type PageSize } from "@/lib/constants";
import { fieldClass, fieldLabelClass } from "@/components/shared/fields";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: PageSize;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const safePages = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), safePages);
  const start = total === 0 ? 0 : (current - 1) * limit + 1;
  const end = Math.min(total, current * limit);
  const items = visiblePages(current, safePages);

  return (
    <nav aria-label="Pagination" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-text-muted tabular-nums">
        {total === 0 ? "0 results" : `${start}–${end} of ${total}`}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2">
          <span className={fieldLabelClass}>Rows</span>
          <select
            className={`${fieldClass} w-auto`}
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={pageButtonClass}
          disabled={current <= 1}
          onClick={() => onPageChange(current - 1)}
        >
          Previous
        </button>
        {items.map((item, index) =>
          item === "gap" ? (
            <span
              key={`gap-${index}`}
              className="hidden px-1 text-sm text-text-muted min-[480px]:inline"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`${pageButtonClass} min-w-11 tabular-nums ${item === current ? "" : "hidden min-[480px]:inline-flex"}`}
              aria-current={item === current ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          className={pageButtonClass}
          disabled={current >= safePages || total === 0}
          onClick={() => onPageChange(current + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}

const pageButtonClass =
  "inline-flex h-11 items-center justify-center rounded-lg border border-border bg-surface-raised px-3 text-sm text-text focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 aria-[current=page]:border-brand aria-[current=page]:text-brand";

function visiblePages(page: number, totalPages: number) {
  const wanted = new Set([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...wanted].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);
  const items: Array<number | "gap"> = [];

  for (const item of sorted) {
    const previous = items[items.length - 1];
    if (typeof previous === "number" && item - previous > 1) items.push("gap");
    items.push(item);
  }

  return items;
}
