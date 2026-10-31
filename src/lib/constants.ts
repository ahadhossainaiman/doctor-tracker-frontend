export const API_PREFIX = "/api/v1";

export const ACCESS_COOKIE = "accessToken";
export const REFRESH_COOKIE = "refreshToken";

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export function normalizePageSize(value: number): PageSize {
  if (value === 20 || value === 50) return value;
  return DEFAULT_PAGE_SIZE;
}
