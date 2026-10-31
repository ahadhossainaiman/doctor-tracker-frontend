"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

import { CommandPalette } from "@/components/layout/CommandPalette";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PageHeader } from "@/components/layout/PageHeader";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ChartCard, type ChartPoint } from "@/components/shared/ChartCard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterChip } from "@/components/shared/FilterChip";
import {
  ChartCardSkeleton,
  ListSkeleton,
  StatCardSkeleton,
} from "@/components/shared/Skeletons";
import { StatCard } from "@/components/shared/StatCard";
import { showUndoToast } from "@/components/shared/undo-toast";
import { Button } from "@/components/ui/button";
import { fadeRise, sheet, stagger, useSafeVariants } from "@/lib/motion";

const sparkline = [8, 12, 10, 14, 18, 16, 22, 20];

const chartData: ChartPoint[] = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 15 },
  { label: "Thu", value: 22 },
  { label: "Fri", value: 28 },
  { label: "Sat", value: 24 },
  { label: "Sun", value: 36 },
];

const filters = ["Cardiology", "City Hospital", "Last 30 days"];

function SampleArea() {
  const width = 120;
  const height = 48;
  const values = chartData.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  const coords = values.map((value, index) => {
    const x = index * step;
    const y = height - ((value - min) / span) * (height - 8) - 4;
    return { x, y };
  });
  const line = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `0,${height} ${line} ${width},${height}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-full w-full text-brand"
      aria-hidden="true"
    >
      <polygon points={area} className="fill-brand/15" />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function Gallery() {
  const [chips, setChips] = useState(filters);
  const [range, setRange] = useState("30d");
  const [nav, setNav] = useState<"dashboard" | "doctors" | "patients">("dashboard");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const enter = useSafeVariants(fadeRise);
  const sheetMotion = useSafeVariants(sheet);

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={enter}>
        <PageHeader
          heading="h2"
          title="Patients"
          description="Page header with a primary action."
          actions={
            <Button type="button" className="h-11 px-4">
              Add patient
            </Button>
          }
        />
      </motion.div>

      <motion.div variants={enter} className="grid gap-4 @md:grid-cols-2 @xl:grid-cols-4">
        <StatCard
          label="Doctors"
          value="128"
          sparkline={sparkline}
          delta={4.2}
        />
        <StatCard
          label="Patients"
          value="5,042"
          sparkline={[20, 22, 21, 28, 30, 27, 36]}
          delta={-1.4}
        />
        <StatCard label="Added this month" value="316" sparkline={sparkline} delta={0} />
        <StatCardSkeleton withSparkline />
      </motion.div>

      <motion.div variants={enter}>
        <ChartCard
          title="Patients registered"
          data={chartData}
          range={range}
          onRangeChange={setRange}
        >
          <SampleArea />
        </ChartCard>
      </motion.div>

      <motion.div variants={enter} className="grid gap-4 @md:grid-cols-2">
        <ChartCardSkeleton framed />
        <ListSkeleton rows={3} />
      </motion.div>

      <motion.div variants={enter} className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <FilterChip
            key={chip}
            label={chip}
            onRemove={() => setChips((current) => current.filter((item) => item !== chip))}
          />
        ))}
        {chips.length === 0 ? (
          <Button type="button" variant="outline" className="h-11 px-4" onClick={() => setChips(filters)}>
            Reset
          </Button>
        ) : null}
      </motion.div>

      <motion.div variants={enter} className="grid gap-4 @md:grid-cols-2">
        <EmptyState
          title="No patients yet"
          description="Add the first patient to start the list."
          action={
            <Button type="button" className="h-11 px-4">
              Add patient
            </Button>
          }
        />
        <ErrorState
          title="Could not load patients"
          description="The list failed to load. Try again."
          onRetry={() => toast.success("Retry clicked")}
        />
      </motion.div>

      <motion.div variants={enter} className="flex flex-wrap gap-2">
        <Button type="button" className="h-11 px-4" onClick={() => setConfirmOpen(true)}>
          Delete sample
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 px-4"
          onClick={() => showUndoToast("Patient removed", () => toast.success("Restored"))}
        >
          Show undo toast
        </Button>
      </motion.div>

      <motion.div variants={sheetMotion} className="overflow-hidden rounded-sheet border border-border bg-surface-raised shadow-card">
        <div className="border-b border-border px-4 py-3 text-sm text-text-muted">
          Mobile bottom nav, not mounted on the app shell yet.
        </div>
        <MobileBottomNav activeId={nav} onSelect={setNav} />
      </motion.div>

      <ConfirmDialog
        open={confirmOpen}
        title="Remove this sample patient?"
        description="Nothing is deleted. This checks the confirm dialog."
        confirmLabel="Remove"
        destructive
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          showUndoToast("Patient removed", () => toast.success("Restored"));
        }}
      />
    </motion.div>
  );
}

/** Temporary gallery. Remove this route in F8. */
export function DesignPreview() {
  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-4 py-8 md:px-8">
      <PageHeader
        title="Design preview"
        description="Temporary gallery for light, dark, 360px, and desktop. Remove this route in F8."
        actions={
          <>
            <ThemeToggle />
            <CommandPalette />
          </>
        }
      />
      <div className="grid items-start gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="@container w-full max-w-[360px] overflow-hidden rounded-sheet border border-border bg-surface">
          <h2 className="border-b border-border px-4 py-3 text-sm font-medium text-text-muted">
            360px
          </h2>
          <div className="p-4">
            <Gallery />
          </div>
        </section>
        <section className="@container min-w-0">
          <h2 className="mb-4 text-sm font-medium text-text-muted">Desktop</h2>
          <Gallery />
        </section>
      </div>
    </main>
  );
}
