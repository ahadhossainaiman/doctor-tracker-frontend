import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-text">Page not found</h1>
      <p className="text-sm text-text-muted">That page is not in Doctor Tracker.</p>
      <Button asChild className="h-11 w-fit px-4">
        <Link href="/dashboard">Go to dashboard</Link>
      </Button>
    </main>
  );
}
