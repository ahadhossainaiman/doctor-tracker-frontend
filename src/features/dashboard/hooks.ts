"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getConditions,
  getDashboardSummary,
  getPatientsPerDoctor,
  getSpecializations,
  getTimeseries,
} from "./api";
import type { TimeInterval, TimeRange } from "./types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => ["dashboard", "summary"] as const,
  patientsPerDoctor: (limit: number) => ["dashboard", "patients-per-doctor", limit] as const,
  timeseries: (range: TimeRange, interval: TimeInterval) =>
    ["dashboard", "timeseries", range, interval] as const,
  conditions: (limit: number) => ["dashboard", "conditions", limit] as const,
  specializations: () => ["dashboard", "specializations"] as const,
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboardSummary,
  });
}

export function usePatientsPerDoctor(limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.patientsPerDoctor(limit),
    queryFn: () => getPatientsPerDoctor(limit),
  });
}

export function useTimeseries(range: TimeRange, interval: TimeInterval) {
  return useQuery({
    queryKey: dashboardKeys.timeseries(range, interval),
    queryFn: () => getTimeseries(range, interval),
    placeholderData: keepPreviousData,
  });
}

export function useConditions(limit = 6) {
  return useQuery({
    queryKey: dashboardKeys.conditions(limit),
    queryFn: () => getConditions(limit),
  });
}

export function useSpecializations() {
  return useQuery({
    queryKey: dashboardKeys.specializations(),
    queryFn: getSpecializations,
  });
}
