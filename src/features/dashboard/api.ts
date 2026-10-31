import { apiClient } from "@/lib/apiClient";

import type { ChartSeries, DashboardSummary, TimeInterval, TimeRange } from "./types";

export function getDashboardSummary() {
  return apiClient<DashboardSummary>("/dashboard/summary").then((response) => response.data);
}

export function getPatientsPerDoctor(limit = 10) {
  return apiClient<ChartSeries>(`/dashboard/patients-per-doctor?limit=${limit}`).then(
    (response) => response.data,
  );
}

export function getTimeseries(range: TimeRange, interval: TimeInterval) {
  return apiClient<ChartSeries>(`/dashboard/timeseries?range=${range}&interval=${interval}`).then(
    (response) => response.data,
  );
}

export function getConditions(limit = 6) {
  return apiClient<ChartSeries>(`/dashboard/conditions?limit=${limit}`).then(
    (response) => response.data,
  );
}

export function getSpecializations() {
  return apiClient<ChartSeries>("/dashboard/specializations").then((response) => response.data);
}
