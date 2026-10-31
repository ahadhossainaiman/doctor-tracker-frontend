import type { Metadata } from "next";
import { Suspense } from "react";

import { DoctorDetailView } from "@/components/doctors/DoctorDetailView";
import { ListSkeleton } from "@/components/shared/Skeletons";

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
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 md:px-8">
          <ListSkeleton rows={8} />
        </div>
      }
    >
      <DoctorDetailView id={id} />
    </Suspense>
  );
}
