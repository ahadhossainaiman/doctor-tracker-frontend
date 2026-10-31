import type { Metadata } from "next";
import { Suspense } from "react";

import { DoctorDetailView } from "@/components/doctors/DoctorDetailView";
import { ListSkeleton } from "@/components/shared/Skeletons";
import { pageClass } from "@/lib/page";

export const metadata: Metadata = {
  title: "Doctor",
};

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className={pageClass}>
          <ListSkeleton rows={8} />
        </div>
      }
    >
      <DoctorDetailView id={id} />
    </Suspense>
  );
}
