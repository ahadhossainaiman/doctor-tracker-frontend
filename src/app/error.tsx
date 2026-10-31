"use client";

import { RouteError } from "@/components/layout/RouteError";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteError reset={reset} />;
}
