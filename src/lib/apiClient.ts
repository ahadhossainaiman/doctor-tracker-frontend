import { API_PREFIX } from "@/lib/constants";
import type { ApiFailure, ApiSuccess } from "@/types/api";

const PUBLIC_AUTH_PATHS = ["/auth/login", "/auth/refresh"];

let unauthorizedHandler: (() => void) | null = null;

/** Auth step replaces this so a 401 can clear cached server state before redirect. */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiSuccess<T>(value: unknown): value is ApiSuccess<T> {
  return isRecord(value) && value.success === true && "data" in value;
}

function isApiFailure(value: unknown): value is ApiFailure {
  if (!isRecord(value) || value.success !== false || !isRecord(value.error)) {
    return false;
  }

  return (
    typeof value.error.code === "string" &&
    typeof value.error.message === "string"
  );
}

function resolvePath(path: string) {
  if (path.startsWith("/api/")) return path;
  if (path.startsWith("/")) return `${API_PREFIX}${path}`;
  return `${API_PREFIX}/${path}`;
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/login") return;

  const next = `${window.location.pathname}${window.location.search}`;
  // Reload so login starts with a fresh query cache and the route guard.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`/login?next=${encodeURIComponent(next)}`);
}

function toApiError(status: number, payload: unknown) {
  if (isApiFailure(payload)) {
    return new ApiError(
      status,
      payload.error.code,
      payload.error.message,
      payload.error.details,
    );
  }

  return new ApiError(status, "REQUEST_FAILED", "Request failed.");
}

export async function apiClient<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiSuccess<T>> {
  const url = resolvePath(path);
  const headers = new Headers(init?.headers);

  if (init?.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiError(0, "NETWORK", "Unable to reach the server.");
  }

  const text = await response.text();
  let payload: unknown = null;

  if (text) {
    try {
      payload = JSON.parse(text) as unknown;
    } catch {
      payload = null;
    }
  }

  if (!response.ok || !isApiSuccess<T>(payload)) {
    if (
      response.status === 401 &&
      !PUBLIC_AUTH_PATHS.some((publicPath) => url.includes(publicPath))
    ) {
      if (unauthorizedHandler) unauthorizedHandler();
      else redirectToLogin();
    }

    throw toApiError(response.status, payload);
  }

  return payload;
}
