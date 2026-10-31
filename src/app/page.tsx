import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListSkeleton, StatCardSkeleton } from "@/components/shared/Skeletons";
import { StatCard } from "@/components/shared/StatCard";

import { PlaceholderActions } from "./placeholder-actions";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-4 py-8 md:px-8">
      <PageHeader
        title="Doctor Tracker"
        description="Scaffold preview. Login, doctors, patients, and the dashboard are the next steps."
        actions={<PlaceholderActions />}
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Doctors" value="128" hint="Sample figure" />
        <StatCard label="Patients" value="5,042" hint="Sample figure" />
        <StatCard label="Added this month" value="316" hint="Sample figure" />
        <StatCard label="Avg per doctor" value="39.4" hint="Sample figure" />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <StatCardSkeleton />
        <ListSkeleton />
      </section>
      <EmptyState
        title="No patients yet"
        description="Lists will reuse this empty state, with a primary action when there is something to add."
      />
    </main>
  );
}
