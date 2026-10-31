"use client";

import Link from "next/link";
import { useState } from "react";

import {
  AreaTrend,
  chartPoints,
  Donut,
  HorizontalBars,
  periodDelta,
} from "@/components/dashboard/charts";
import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChartCard } from "@/components/shared/ChartCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatCard } from "@/components/shared/StatCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import {
  useConditions,
  useDashboardSummary,
  usePatientsPerDoctor,
  useSpecializations,
  useTimeseries,
} from "@/features/dashboard/hooks";
import { useDoctors } from "@/features/doctors/hooks";
import type { TimeInterval, TimeRange } from "@/features/dashboard/types";
import { apiErrorMessage } from "@/lib/apiClient";
import { formatCount, formatUtcDate } from "@/lib/format";

const RANGES = ["7d", "30d", "90d", "12m"] as const;
const INTERVALS = ["day", "week", "month"] as const;

function defaultInterval(range: TimeRange): TimeInterval {
  if (range === "90d") return "week";
  if (range === "12m") return "month";
  return "day";
}

function isTimeRange(value: string): value is TimeRange {
  return RANGES.some((range) => range === value);
}

function isTimeInterval(value: string): value is TimeInterval {
  return INTERVALS.some((item) => item === value);
}

const linkClass =
  "font-medium text-text underline-offset-4 hover:text-brand hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

export function DashboardView() {
  const [range, setRange] = useState<TimeRange>("30d");
  const [interval, setInterval] = useState<TimeInterval>("day");
  const summary = useDashboardSummary();
  const trend = useTimeseries(range, interval);
  const perDoctor = usePatientsPerDoctor(10);
  const rankedDoctors = useDoctors({ sort: "patientCount", order: "desc", page: 1, limit: 10 });
  const conditions = useConditions(6);
  const specializations = useSpecializations();

  const totals = summary.data;
  const trendPoints = chartPoints(trend.data?.labels ?? [], trend.data?.values ?? []);
  const doctorIds = new Map(
    (rankedDoctors.data?.data ?? []).map((doctor) => [doctor.name, doctor.id]),
  );
  const doctorPoints = chartPoints(perDoctor.data?.labels ?? [], perDoctor.data?.values ?? []).map(
    (point) => {
      const id = doctorIds.get(point.label);
      return id ? { ...point, href: `/doctors/${id}` } : point;
    },
  );
  const conditionPoints = chartPoints(conditions.data?.labels ?? [], conditions.data?.values ?? []);
  const specializationPoints = chartPoints(
    specializations.data?.labels ?? [],
    specializations.data?.values ?? [],
  );

  return (
    <PageFrame>
      <PageHeader
        title="Dashboard"
        description={
          totals
            ? `${formatCount(totals.totalDoctors)} doctors and ${formatCount(totals.totalPatients)} patients.`
            : "Totals, charts, and recent activity."
        }
      />

      <>
          <section className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summary.isError ? (
              <div className="sm:col-span-2 lg:col-span-4">
                <ErrorState
                  title="Totals are unavailable"
                  description={apiErrorMessage(summary.error)}
                  onRetry={() => void summary.refetch()}
                />
              </div>
            ) : summary.isPending || !totals ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton withSparkline />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard label="Total doctors" value={formatCount(totals.totalDoctors)} />
                <StatCard label="Total patients" value={formatCount(totals.totalPatients)} />
                <StatCard
                  label="Patients this month"
                  value={formatCount(totals.patientsThisMonth)}
                  sparkline={trend.data?.values}
                  delta={trend.data ? periodDelta(trend.data.values) : undefined}
                  deltaLabel="vs the previous half of this range"
                />
                <StatCard
                  label="Average patients per doctor"
                  value={new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(
                    totals.averagePatientsPerDoctor,
                  )}
                />
              </>
            )}
          </section>

          <section className="grid items-stretch gap-4 lg:grid-cols-5">
            <div className="min-w-0 lg:col-span-3">
              <ChartCard
                title="Patients registered"
                data={trendPoints}
                range={range}
                ranges={RANGES}
                interval={interval}
                intervals={INTERVALS}
                loading={trend.isPending}
                error={trend.isError ? apiErrorMessage(trend.error) : null}
                onRetry={() => void trend.refetch()}
                emptyLabel="No registrations in this range."
                onRangeChange={(next) => {
                  if (!isTimeRange(next)) return;
                  setRange(next);
                  setInterval(defaultInterval(next));
                }}
                onIntervalChange={(next) => {
                  if (isTimeInterval(next)) setInterval(next);
                }}
              >
                <AreaTrend points={trendPoints} />
              </ChartCard>
            </div>
            <div className="min-w-0 lg:col-span-2">
              <ChartCard
                title="Patients by condition"
                data={conditionPoints}
                ranges={[]}
                loading={conditions.isPending}
                error={conditions.isError ? apiErrorMessage(conditions.error) : null}
                onRetry={() => void conditions.refetch()}
                emptyLabel="No conditions yet."
              >
                <Donut points={conditionPoints} />
              </ChartCard>
            </div>
          </section>

          <section className="grid items-stretch gap-4 lg:grid-cols-2">
            <ChartCard
              title="Patients per doctor"
              data={doctorPoints}
              ranges={[]}
              loading={perDoctor.isPending}
              error={perDoctor.isError ? apiErrorMessage(perDoctor.error) : null}
              onRetry={() => void perDoctor.refetch()}
              emptyLabel="No doctors with patients yet."
            >
              <HorizontalBars points={doctorPoints} />
            </ChartCard>
            <ChartCard
              title="Doctors by specialization"
              data={specializationPoints}
              ranges={[]}
              loading={specializations.isPending}
              error={specializations.isError ? apiErrorMessage(specializations.error) : null}
              onRetry={() => void specializations.refetch()}
              emptyLabel="No specializations yet."
            >
              <HorizontalBars points={specializationPoints} colorByLabel />
            </ChartCard>
          </section>

          <section className="grid items-stretch gap-4 lg:grid-cols-2">
            <article className="panel h-full rounded-card p-5">
              <h2 className="text-xl font-semibold tracking-tight text-text">Recent doctors</h2>
              {summary.isPending || !totals ? (
                <p className="mt-4 text-sm text-text-muted">Loading recent doctors</p>
              ) : totals.recentDoctors.length === 0 ? (
                <p className="mt-4 text-sm text-text-muted">No doctors yet.</p>
              ) : (
              <ul className="mt-4 divide-y divide-border">
                {totals.recentDoctors.map((doctor) => (
                  <li key={doctor.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <Link href={`/doctors/${doctor.id}`} className={linkClass}>
                        {doctor.name}
                      </Link>
                      <p className="truncate text-xs text-text-muted">
                        {doctor.specialization} · {doctor.hospital}
                      </p>
                    </div>
                    <time className="shrink-0 text-xs text-text-muted" dateTime={doctor.createdAt}>
                      {formatUtcDate(doctor.createdAt)}
                    </time>
                  </li>
                ))}
              </ul>
              )}
            </article>
            <article className="panel h-full rounded-card p-5">
              <h2 className="text-xl font-semibold tracking-tight text-text">Recent patients</h2>
              {summary.isPending || !totals ? (
                <p className="mt-4 text-sm text-text-muted">Loading recent patients</p>
              ) : totals.recentPatients.length === 0 ? (
                <p className="mt-4 text-sm text-text-muted">No patients yet.</p>
              ) : (
              <ul className="mt-4 divide-y divide-border">
                {totals.recentPatients.map((patient) => (
                  <li key={patient.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="font-medium text-text">{patient.name}</p>
                      <p className="truncate text-xs text-text-muted">
                        {patient.condition}
                        {patient.doctorName ? ` · ${patient.doctorName}` : ""}
                      </p>
                    </div>
                    <time
                      className="shrink-0 text-xs text-text-muted"
                      dateTime={patient.registeredAt}
                    >
                      {formatUtcDate(patient.registeredAt)}
                    </time>
                  </li>
                ))}
              </ul>
              )}
            </article>
          </section>
      </>
    </PageFrame>
  );
}
