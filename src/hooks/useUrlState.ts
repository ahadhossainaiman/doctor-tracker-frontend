"use client";

import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { useCallback, useMemo } from "react";

import { DEFAULT_PAGE_SIZE, normalizePageSize, type PageSize } from "@/lib/constants";

export type SortOrder = "asc" | "desc";

const baseParsers = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  order: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
};

type UrlValues = {
  q: string;
  sort: string;
  order: SortOrder;
  page: number;
  limit: number;
  from: string;
  to: string;
};

export type UrlState<K extends string> = UrlValues & {
  limit: PageSize;
  filters: Record<K, string>;
  setQ: (q: string) => void;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setRange: (range: { from: string; to: string }) => void;
  setFilter: (key: K, value: string) => void;
  reset: () => void;
};

export function useUrlState<const K extends string>(filterKeys: readonly K[]): UrlState<K> {
  const filterKey = filterKeys.join("\0");
  const parsers = useMemo(() => {
    const keys = filterKey ? filterKey.split("\0") : [];
    const filters = Object.fromEntries(keys.map((key) => [key, parseAsString.withDefault("")]));
    return { ...baseParsers, ...filters };
  }, [filterKey]);

  const [raw, setState] = useQueryStates(parsers, { history: "replace" });
  const state = raw as UrlValues & Record<string, string | number>;

  const filters = useMemo(() => {
    const next = {} as Record<K, string>;
    for (const key of filterKeys) next[key] = String(state[key] ?? "");
    return next;
  }, [filterKeys, state]);

  const setQ = useCallback(
    (q: string) => {
      void setState({ q, page: 1 });
    },
    [setState],
  );

  const setSort = useCallback(
    (sort: string) => {
      const order: SortOrder = state.sort === sort && state.order === "asc" ? "desc" : "asc";
      void setState({ sort, order, page: 1 });
    },
    [setState, state.order, state.sort],
  );

  const setPage = useCallback(
    (page: number) => {
      void setState({ page: Math.max(1, page) });
    },
    [setState],
  );

  const setLimit = useCallback(
    (limit: number) => {
      void setState({ limit: normalizePageSize(limit), page: 1 });
    },
    [setState],
  );

  const setRange = useCallback(
    (range: { from: string; to: string }) => {
      void setState({ from: range.from, to: range.to, page: 1 });
    },
    [setState],
  );

  const setFilter = useCallback(
    (key: K, value: string) => {
      void setState({ [key]: value, page: 1 });
    },
    [setState],
  );

  const reset = useCallback(() => {
    void setState(null);
  }, [setState]);

  return {
    q: state.q,
    sort: state.sort,
    order: state.order === "asc" ? "asc" : "desc",
    page: Math.max(1, state.page),
    limit: normalizePageSize(state.limit),
    from: state.from,
    to: state.to,
    filters,
    setQ,
    setSort,
    setPage,
    setLimit,
    setRange,
    setFilter,
    reset,
  };
}
