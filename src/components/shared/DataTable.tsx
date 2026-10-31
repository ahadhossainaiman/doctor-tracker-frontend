"use client";

import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/shared/EmptyState";
import type { SortOrder } from "@/hooks/useUrlState";
import { listItem, stagger, useSafeVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type Column<T> = {
  id: string;
  header: string;
  sortKey?: string;
  className?: string;
  hideBelow?: "md" | "lg" | "xl";
  cell: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  label: string;
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  sort?: string;
  order?: SortOrder;
  onSort?: (sortKey: string) => void;
  rowActions?: (row: T) => ReactNode;
  empty?: ReactNode;
  stickyClassName?: string;
};

const hideClass = {
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
} as const;

export function DataTable<T>({
  label,
  columns,
  rows,
  getRowId,
  sort = "",
  order = "asc",
  onSort,
  rowActions,
  empty,
  stickyClassName = "top-14 sm:top-16",
}: DataTableProps<T>) {
  const group = useSafeVariants(stagger);
  const item = useSafeVariants(listItem);

  if (rows.length === 0) {
    return (
      empty ?? (
        <EmptyState title="Nothing to show" description="Try a different search or filter." />
      )
    );
  }

  return (
    <>
      <motion.div
        variants={group}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3 md:hidden"
      >
        {rows.map((row) => {
          const [titleColumn, ...detailColumns] = columns;
          return (
            <motion.article
              key={getRowId(row)}
              variants={item}
              className="lift-card rounded-card border border-border bg-surface-raised p-4 shadow-card min-[480px]:p-5"
            >
              {titleColumn ? (
                <h3 className="text-base font-semibold text-text">{titleColumn.cell(row)}</h3>
              ) : null}
              <dl className="mt-3 grid gap-2">
                {detailColumns.map((column) => (
                  <div key={column.id} className="flex items-start justify-between gap-3 text-sm">
                    <dt className="text-text-muted">{column.header}</dt>
                    <dd className="text-right text-text">{column.cell(row)}</dd>
                  </div>
                ))}
              </dl>
              {rowActions ? <div className="mt-3 flex flex-wrap gap-2">{rowActions(row)}</div> : null}
            </motion.article>
          );
        })}
      </motion.div>
      <div className="hidden overflow-x-auto rounded-card border border-border bg-surface-raised shadow-card md:block">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <caption className="sr-only">{label}</caption>
          <thead className={cn("sticky z-10 bg-surface-raised/95 backdrop-blur-md", stickyClassName)}>
            <tr>
              {columns.map((column) => {
                const active = column.sortKey !== undefined && column.sortKey === sort;
                const ariaSort = !column.sortKey
                  ? undefined
                  : active
                    ? order === "asc"
                      ? "ascending"
                      : "descending"
                    : "none";
                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={ariaSort}
                    className={cn(
                      "border-b border-border px-3 text-left font-medium text-text lg:px-4",
                      column.hideBelow ? hideClass[column.hideBelow] : undefined,
                      column.className,
                    )}
                  >
                    {column.sortKey && onSort ? (
                      <button
                        type="button"
                        className="inline-flex h-11 items-center gap-1 rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                        aria-label={`Sort by ${column.header}`}
                        onClick={() => onSort(column.sortKey ?? column.id)}
                      >
                        {column.header}
                        <SortIcon active={active} order={order} />
                      </button>
                    ) : (
                      <span className="inline-flex h-11 items-center">{column.header}</span>
                    )}
                  </th>
                );
              })}
              {rowActions ? (
                <th scope="col" className="border-b border-border px-3 text-right font-medium text-text lg:px-4">
                  <span className="inline-flex h-11 items-center">Actions</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <motion.tbody variants={group} initial="hidden" animate="visible">
            {rows.map((row) => (
              <motion.tr
                key={getRowId(row)}
                variants={item}
                className="transition-colors duration-150 hover:bg-muted/70"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      "border-b border-border px-3 py-3 text-text lg:px-4",
                      column.hideBelow ? hideClass[column.hideBelow] : undefined,
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
                {rowActions ? (
                  <td className="border-b border-border px-3 py-3 text-right lg:px-4">{rowActions(row)}</td>
                ) : null}
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </>
  );
}

function SortIcon({ active, order }: { active: boolean; order: SortOrder }) {
  if (!active) return <ChevronsUpDown className="size-4 text-text-muted" aria-hidden="true" />;
  if (order === "asc") return <ChevronUp className="size-4" aria-hidden="true" />;
  return <ChevronDown className="size-4" aria-hidden="true" />;
}
