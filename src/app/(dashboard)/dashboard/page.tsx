import type { Metadata } from "next";
import { Suspense } from "react";

import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <Suspense>
      <PageFrame>
        <PageHeader
          title="Dashboard"
          description="Totals, charts, and recent activity will show here."
        />
      </PageFrame>
    </Suspense>
  );
}
