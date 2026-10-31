import type { Metadata } from "next";
import { Suspense } from "react";

import { PatientsView } from "@/components/patients/PatientsView";
import { ListSkeleton } from "@/components/shared/Skeletons";
import { pageClass } from "@/lib/page";

export const metadata: Metadata = {
  title: "Patients",
};

export default function PatientsPage() {
  return (
    <Suspense
      fallback={
        <div className={pageClass}>
          <ListSkeleton rows={8} />
        </div>
      }
    >
      <PatientsView />
    </Suspense>
  );
}
