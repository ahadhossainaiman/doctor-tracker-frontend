"use client";

import { RouteError } from "@/components/layout/RouteError";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError reset={reset} />;
}
