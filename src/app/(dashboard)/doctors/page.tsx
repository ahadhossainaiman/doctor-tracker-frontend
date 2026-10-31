import type { Metadata } from "next";
import { Suspense } from "react";

import { DoctorsView } from "@/components/doctors/DoctorsView";
import { ListSkeleton } from "@/components/shared/Skeletons";

export const metadata: Metadata = {
  title: "Doctors",
};

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 md:px-8">
          <ListSkeleton rows={8} />
        </div>
      }
    >
      <DoctorsView />
    </Suspense>
  );
}
