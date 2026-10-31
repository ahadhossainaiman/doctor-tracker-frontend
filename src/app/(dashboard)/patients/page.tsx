import type { Metadata } from "next";
import { Suspense } from "react";

import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Patients",
};

export default function PatientsPage() {
  return (
    <Suspense>
      <PageFrame>
        <PageHeader
          title="Patients"
          description="The patient list, search, and filters will show here."
        />
      </PageFrame>
    </Suspense>
  );
}
