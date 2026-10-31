"use client";

import { ErrorState } from "@/components/shared/ErrorState";

export function RouteError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 py-8 md:px-8">
      <ErrorState
        title="Something went wrong"
        description="This page failed to load. Try again."
        onRetry={reset}
      />
    </div>
  );
}
