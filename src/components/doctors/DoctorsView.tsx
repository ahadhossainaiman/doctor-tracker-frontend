"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useId, useMemo } from "react";
import Link from "next/link";

import { AddDoctorDialog } from "@/components/doctors/AddDoctorDialog";
import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterBar, type ActiveFilter } from "@/components/shared/FilterBar";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { ListSkeleton } from "@/components/shared/Skeletons";
import { fieldClass, fieldLabelClass } from "@/components/shared/fields";
import { Button } from "@/components/ui/button";
import { useDoctors } from "@/features/doctors/hooks";
import { asDoctorSort, type Doctor, type DoctorListQuery } from "@/features/doctors/types";
import { useFilterOptions } from "@/features/meta/hooks";
import { useUrlState } from "@/hooks/useUrlState";
import { apiErrorMessage } from "@/lib/apiClient";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { formatCount, formatUtcDate } from "@/lib/format";

const DOCTOR_FILTERS = ["specialization", "hospital"] as const;

export function DoctorsView() {
  const formId = useId();
  const url = useUrlState(DOCTOR_FILTERS);
  const { page, setPage } = url;
  const [create, setCreate] = useQueryState("create", parseAsString.withOptions({ history: "replace" }));
  const filters = useFilterOptions();
  const query = useMemo<DoctorListQuery>(
    () => ({
      q: url.q || undefined,
      specialization: url.filters.specialization || undefined,
      hospital: url.filters.hospital || undefined,
      from: url.from || undefined,
      to: url.to || undefined,
      sort: asDoctorSort(url.sort),
      order: url.order,
      page,
      limit: url.limit,
    }),
    [
      url.filters.hospital,
      url.filters.specialization,
      url.from,
      url.limit,
      url.order,
      page,
      url.q,
      url.sort,
      url.to,
    ],
  );
  const list = useDoctors(query);
  const totalPages = list.data?.meta.totalPages ?? 0;

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages);
  }, [page, setPage, totalPages]);

  const canReset = Boolean(
    url.q ||
      url.filters.specialization ||
      url.filters.hospital ||
      url.from ||
      url.to ||
      url.sort ||
      page > 1 ||
      url.limit !== DEFAULT_PAGE_SIZE,
  );

  const chips: ActiveFilter[] = [
    url.filters.specialization
      ? { id: "specialization", label: `Specialization: ${url.filters.specialization}` }
      : null,
    url.filters.hospital ? { id: "hospital", label: `Hospital: ${url.filters.hospital}` } : null,
    url.from ? { id: "from", label: `From ${url.from}` } : null,
    url.to ? { id: "to", label: `To ${url.to}` } : null,
  ].flatMap((chip) => (chip ? [chip] : []));

  const columns: Column<Doctor>[] = [
    {
      id: "name",
      header: "Name",
      sortKey: "name",
      cell: (doctor) => (
        <Link
          href={`/doctors/${doctor.id}`}
          className="font-medium text-text underline-offset-4 hover:text-brand hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {doctor.name}
        </Link>
      ),
    },
    { id: "specialization", header: "Specialization", cell: (doctor) => doctor.specialization },
    { id: "hospital", header: "Hospital", hideBelow: "lg", cell: (doctor) => doctor.hospital },
    { id: "phone", header: "Phone", hideBelow: "xl", cell: (doctor) => doctor.phone },
    { id: "email", header: "Email", hideBelow: "xl", cell: (doctor) => doctor.email },
    {
      id: "patients",
      header: "Patients",
      sortKey: "patientCount",
      className: "tabular-nums",
      cell: (doctor) => formatCount(doctor.patientCount),
    },
    {
      id: "created",
      header: "Created",
      sortKey: "createdAt",
      hideBelow: "lg",
      cell: (doctor) => (
        <time dateTime={doctor.createdAt} title={doctor.createdAt}>
          {formatUtcDate(doctor.createdAt)}
        </time>
      ),
    },
  ];

  return (
    <PageFrame>
      <PageHeader
        title="Doctors"
        description="Search by name, specialization, or hospital. Dates filter when the doctor was added."
        actions={
          <Button type="button" className="h-11 px-4" onClick={() => void setCreate("1")}>
            Add doctor
          </Button>
        }
      />
      <FilterBar
        search={
          <SearchInput
            value={url.q}
            onChange={url.setQ}
            label="Search doctors"
            placeholder="Name, specialization, or hospital"
          />
        }
        chips={chips}
        canReset={canReset}
        onReset={url.reset}
        onRemoveChip={(id) => {
          if (id === "specialization" || id === "hospital") url.setFilter(id, "");
          if (id === "from") url.setRange({ from: "", to: url.to });
          if (id === "to") url.setRange({ from: url.from, to: "" });
        }}
      >
        <FilterSelect
          id={`${formId}-specialization`}
          label="Specialization"
          allLabel="All specializations"
          value={url.filters.specialization}
          options={filters.data?.specializations ?? []}
          onChange={(value) => url.setFilter("specialization", value)}
        />
        <FilterSelect
          id={`${formId}-hospital`}
          label="Hospital"
          allLabel="All hospitals"
          value={url.filters.hospital}
          options={filters.data?.hospitals ?? []}
          onChange={(value) => url.setFilter("hospital", value)}
        />
        <DateRangePicker from={url.from} to={url.to} onChange={url.setRange} />
      </FilterBar>
      {filters.isError ? (
        <div className="flex flex-wrap items-center gap-3" role="alert">
          <p className="text-sm text-danger-text">{apiErrorMessage(filters.error)}</p>
          <Button type="button" variant="outline" className="h-11 px-4" onClick={() => void filters.refetch()}>
            Retry filters
          </Button>
        </div>
      ) : null}
      {list.isPending ? (
        <ListSkeleton rows={8} />
      ) : list.isError ? (
        <ErrorState
          title="Could not load doctors"
          description={apiErrorMessage(list.error)}
          onRetry={() => void list.refetch()}
        />
      ) : (
        <div aria-busy={list.isPlaceholderData || undefined} className={list.isPlaceholderData ? "opacity-70" : undefined}>
          <DataTable
            label="Doctors"
            columns={columns}
            rows={list.data.data}
            getRowId={(doctor) => doctor.id}
            sort={url.sort}
            order={url.order}
            onSort={url.setSort}
            empty={
              <EmptyState
                title={canReset ? "No doctors match" : "No doctors yet"}
                description={
                  canReset
                    ? "Try a different search or filter."
                    : "Add a doctor to start tracking patients."
                }
                action={
                  canReset ? (
                    <Button type="button" variant="outline" className="h-11 px-4" onClick={url.reset}>
                      Reset filters
                    </Button>
                  ) : (
                    <Button type="button" className="h-11 px-4" onClick={() => void setCreate("1")}>
                      Add doctor
                    </Button>
                  )
                }
              />
            }
          />
          <div className="mt-4">
            <Pagination
              page={list.data.meta.page}
              totalPages={list.data.meta.totalPages}
              total={list.data.meta.total}
              limit={url.limit}
              onPageChange={url.setPage}
              onLimitChange={url.setLimit}
            />
          </div>
        </div>
      )}
      <AddDoctorDialog open={create === "1"} onOpenChange={(next) => void setCreate(next ? "1" : null)} />
    </PageFrame>
  );
}

function FilterSelect({
  id,
  label,
  allLabel,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  allLabel: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const choices = value && !options.includes(value) ? [value, ...options] : options;

  return (
    <div className="grid min-w-0 gap-1 md:min-w-48 md:flex-1">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <select id={id} className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{allLabel}</option>
        {choices.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
