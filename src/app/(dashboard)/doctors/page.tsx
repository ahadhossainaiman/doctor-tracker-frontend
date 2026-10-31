import type { Metadata } from "next";
import { Suspense } from "react";

import { DoctorsView } from "@/components/doctors/DoctorsView";
import { ListSkeleton } from "@/components/shared/Skeletons";
import { pageClass } from "@/lib/page";

export const metadata: Metadata = {
  title: "Doctors",
};

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className={pageClass}>
          <ListSkeleton rows={8} />
        </div>
      }
    >
      <DoctorsView />
    </Suspense>
  );
}
