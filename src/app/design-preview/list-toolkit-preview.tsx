"use client";

import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import { DataTable, type Column } from "@/components/shared/DataTable";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { fieldClass, fieldLabelClass } from "@/components/shared/fields";
import { FilterBar } from "@/components/shared/FilterBar";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button } from "@/components/ui/button";
import { useUrlState } from "@/hooks/useUrlState";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

const FILTER_KEYS = ["region"] as const;
const REGIONS = ["North", "South", "East"] as const;

type SampleRow = {
  id: string;
  name: string;
  region: (typeof REGIONS)[number];
  count: number;
  created: string;
};

const rows: SampleRow[] = [
  ["Ada Lovelace", "North", 12, "2026-01-04"],
  ["Grace Hopper", "South", 7, "2026-01-18"],
  ["Alan Turing", "East", 21, "2026-02-02"],
  ["Katherine Johnson", "North", 4, "2026-02-11"],
  ["Margaret Hamilton", "South", 16, "2026-03-01"],
  ["Tim Berners-Lee", "East", 9, "2026-03-15"],
  ["Barbara Liskov", "North", 30, "2026-04-08"],
  ["Donald Knuth", "South", 3, "2026-04-22"],
  ["Radia Perlman", "East", 18, "2026-05-06"],
  ["Edsger Dijkstra", "North", 11, "2026-05-19"],
  ["Frances Allen", "South", 25, "2026-06-03"],
  ["Linus Torvalds", "East", 8, "2026-06-17"],
].map(([name, region, count, created], index) => ({
  id: String(index + 1),
  name: String(name),
  region: region as SampleRow["region"],
  count: Number(count),
  created: String(created),
}));

const columns: Column<SampleRow>[] = [
  { id: "name", header: "Name", sortKey: "name", cell: (row) => row.name },
  { id: "region", header: "Region", cell: (row) => row.region },
  {
    id: "count",
    header: "Count",
    sortKey: "count",
    cell: (row) => <span className="tabular-nums">{row.count}</span>,
  },
  { id: "created", header: "Created", sortKey: "created", cell: (row) => row.created },
];

/** Temporary sample so the list toolkit can be checked before the real lists exist. */
export function ListToolkitPreview() {
  const url = useUrlState(FILTER_KEYS);
  const { page, setPage } = url;
  const region = url.filters.region;

  const filtered = useMemo(() => {
    const query = url.q.trim().toLowerCase();
    const next = rows.filter((row) => {
      if (query && !row.name.toLowerCase().includes(query)) return false;
      if (region && row.region !== region) return false;
      if (url.from && row.created < url.from) return false;
      if (url.to && row.created > url.to) return false;
      return true;
    });

    const direction = url.order === "asc" ? 1 : -1;
    next.sort((a, b) => {
      if (url.sort === "name") return a.name.localeCompare(b.name) * direction;
      if (url.sort === "count") return (a.count - b.count) * direction;
      if (url.sort === "created") return a.created.localeCompare(b.created) * direction;
      return 0;
    });
    return next;
  }, [region, url.from, url.order, url.q, url.sort, url.to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / url.limit));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, setPage, totalPages]);

  const pageRows = filtered.slice((page - 1) * url.limit, page * url.limit);
  const chips = [
    region ? { id: "region", label: `Region: ${region}` } : null,
    url.from ? { id: "from", label: `From ${url.from}` } : null,
    url.to ? { id: "to", label: `To ${url.to}` } : null,
  ].filter((chip) => chip !== null);

  const canReset =
    Boolean(url.q || region || url.from || url.to || url.sort) ||
    url.page > 1 ||
    url.limit !== DEFAULT_PAGE_SIZE;

  return (
    <section className="flex flex-col gap-4 rounded-card border border-border bg-surface p-4 shadow-card md:p-6">
      <div>
        <h2 className="text-xl font-semibold text-text">List toolkit</h2>
        <p className="text-sm text-text-muted">
          Sample rows only. Search, filters, sort, and page stay in the URL.
        </p>
      </div>
      <FilterBar
        canReset={canReset}
        chips={chips}
        onReset={url.reset}
        onRemoveChip={(id) => {
          if (id === "region") url.setFilter("region", "");
          if (id === "from") url.setRange({ from: "", to: url.to });
          if (id === "to") url.setRange({ from: url.from, to: "" });
        }}
        search={<SearchInput value={url.q} onChange={url.setQ} placeholder="Search names" />}
      >
        <label className="grid min-w-40 gap-1">
          <span className={fieldLabelClass}>Region</span>
          <select
            className={fieldClass}
            value={region}
            onChange={(event) => url.setFilter("region", event.target.value)}
          >
            <option value="">Any</option>
            {REGIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <DateRangePicker from={url.from} to={url.to} onChange={url.setRange} />
      </FilterBar>
      <DataTable
        label="Sample records"
        columns={columns}
        rows={pageRows}
        getRowId={(row) => row.id}
        sort={url.sort}
        order={url.order}
        onSort={url.setSort}
        stickyClassName="top-0"
        rowActions={(row) => (
          <Button
            type="button"
            variant="outline"
            className="h-11 px-4"
            onClick={() => toast(`Opened ${row.name}`)}
          >
            Open
          </Button>
        )}
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        total={filtered.length}
        limit={url.limit}
        onPageChange={url.setPage}
        onLimitChange={url.setLimit}
      />
    </section>
  );
}
