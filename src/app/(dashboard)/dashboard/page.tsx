import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export const metadata: Metadata = {
  title: "Dashboard",
};

const DashboardView = dynamic(
  () => import("@/components/dashboard/DashboardView").then((mod) => mod.DashboardView),
  { loading: () => <DashboardSkeleton /> },
);

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardView />
    </Suspense>
  );
}
