"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/apiClient";

import type { FilterOptions } from "./types";

export const metaKeys = {
  filters: ["meta", "filters"] as const,
};

export function useFilterOptions() {
  return useQuery({
    queryKey: metaKeys.filters,
    queryFn: async () => (await apiClient<FilterOptions>("/meta/filters")).data,
    staleTime: 60_000,
  });
}
