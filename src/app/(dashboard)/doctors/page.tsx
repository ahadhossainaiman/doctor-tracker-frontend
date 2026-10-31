import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Doctors",
};

export default function DoctorsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 md:px-8">
      <PageHeader
        title="Doctors"
        description="The doctor list, search, and filters will show here."
      />
    </div>
  );
}
