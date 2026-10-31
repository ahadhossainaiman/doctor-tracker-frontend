"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useId, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageFrame } from "@/components/layout/PageFrame";
import { PageHeader } from "@/components/layout/PageHeader";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { EditPatientSheet } from "@/components/patients/EditPatientSheet";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
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
import { useDoctor, useDoctors } from "@/features/doctors/hooks";
import { useFilterOptions } from "@/features/meta/hooks";
import { useDeletePatient, usePatients } from "@/features/patients/hooks";
import {
  asPatientGender,
  asPatientSort,
  type Patient,
  type PatientListQuery,
} from "@/features/patients/types";
import { useDebounce } from "@/hooks/useDebounce";
import { useUrlState } from "@/hooks/useUrlState";
import { apiErrorMessage } from "@/lib/apiClient";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { formatCount, formatGender, formatUtcDate } from "@/lib/format";

const PATIENT_FILTERS = ["condition", "doctor", "gender"] as const;

const linkClass =
  "font-medium text-text underline-offset-4 hover:text-brand hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none";

export function PatientsView() {
  const formId = useId();
  const url = useUrlState(PATIENT_FILTERS);
  const { page, setPage } = url;
  const [create, setCreate] = useQueryState("create", parseAsString.withOptions({ history: "replace" }));
  const [doctorQuery, setDoctorQuery] = useState("");
  const debouncedDoctorQuery = useDebounce(doctorQuery, 300);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const filters = useFilterOptions();
  const doctorChoices = useDoctors({
    q: debouncedDoctorQuery || undefined,
    sort: "name",
    order: "asc",
    page: 1,
    limit: 20,
  });
  const selectedDoctor = useDoctor(url.filters.doctor);
  const remove = useDeletePatient();
  const query = useMemo<PatientListQuery>(
    () => ({
      q: url.q || undefined,
      condition: url.filters.condition || undefined,
      doctor: url.filters.doctor || undefined,
      gender: asPatientGender(url.filters.gender),
      from: url.from || undefined,
      to: url.to || undefined,
      sort: asPatientSort(url.sort),
      order: url.order,
      page,
      limit: url.limit,
    }),
    [
      url.filters.condition,
      url.filters.doctor,
      url.filters.gender,
      url.from,
      url.limit,
      url.order,
      page,
      url.q,
      url.sort,
      url.to,
    ],
  );
  const list = usePatients(query);
  const totalPages = list.data?.meta.totalPages ?? 0;

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages);
  }, [page, setPage, totalPages]);

  const canReset = Boolean(
    url.q ||
      url.filters.condition ||
      url.filters.doctor ||
      url.filters.gender ||
      url.from ||
      url.to ||
      url.sort ||
      page > 1 ||
      url.limit !== DEFAULT_PAGE_SIZE,
  );

  const doctorName = selectedDoctor.data?.name;
  const chips: ActiveFilter[] = [
    url.filters.condition ? { id: "condition", label: `Condition: ${url.filters.condition}` } : null,
    url.filters.doctor ? { id: "doctor", label: `Doctor: ${doctorName ?? "Selected"}` } : null,
    url.filters.gender ? { id: "gender", label: `Gender: ${formatGender(url.filters.gender)}` } : null,
    url.from ? { id: "from", label: `From ${url.from}` } : null,
    url.to ? { id: "to", label: `To ${url.to}` } : null,
  ].flatMap((chip) => (chip ? [chip] : []));

  const doctorOptions = doctorChoices.data?.data ?? [];
  const doctorSelectOptions =
    selectedDoctor.data && !doctorOptions.some((doctor) => doctor.id === selectedDoctor.data?.id)
      ? [selectedDoctor.data, ...doctorOptions]
      : doctorOptions;

  const columns: Column<Patient>[] = [
    {
      id: "name",
      header: "Name",
      sortKey: "name",
      cell: (patient) => (
        <button type="button" className={linkClass} onClick={() => setEditingId(patient.id)}>
          {patient.name}
        </button>
      ),
    },
    {
      id: "age",
      header: "Age",
      sortKey: "age",
      className: "tabular-nums",
      cell: (patient) => formatCount(patient.age),
    },
    {
      id: "gender",
      header: "Gender",
      hideBelow: "lg",
      cell: (patient) => formatGender(patient.gender),
    },
    { id: "condition", header: "Condition", cell: (patient) => patient.condition },
    {
      id: "doctor",
      header: "Doctor",
      hideBelow: "md",
      cell: (patient) => patient.doctorName ?? "Doctor",
    },
    {
      id: "registered",
      header: "Registered",
      sortKey: "registeredAt",
      hideBelow: "lg",
      cell: (patient) => (
        <time dateTime={patient.registeredAt} title={patient.registeredAt}>
          {formatUtcDate(patient.registeredAt)}
        </time>
      ),
    },
  ];

  return (
    <PageFrame>
      <PageHeader
        title="Patients"
        description="Search by name, condition, or phone. Dates filter the registration day."
        actions={
          <Button type="button" className="h-11 px-4" onClick={() => void setCreate("1")}>
            Add patient
          </Button>
        }
      />
      <FilterBar
        search={
          <SearchInput
            value={url.q}
            onChange={url.setQ}
            label="Search patients"
            placeholder="Name, condition, or phone"
          />
        }
        chips={chips}
        canReset={canReset}
        onReset={() => {
          setDoctorQuery("");
          url.reset();
        }}
        onRemoveChip={(id) => {
          if (id === "condition" || id === "doctor" || id === "gender") url.setFilter(id, "");
          if (id === "doctor") setDoctorQuery("");
          if (id === "from") url.setRange({ from: "", to: url.to });
          if (id === "to") url.setRange({ from: url.from, to: "" });
        }}
      >
        <FilterSelect
          id={`${formId}-condition`}
          label="Condition"
          allLabel="All conditions"
          value={url.filters.condition}
          options={filters.data?.conditions ?? []}
          onChange={(value) => url.setFilter("condition", value)}
        />
        <FilterSelect
          id={`${formId}-gender`}
          label="Gender"
          allLabel="All genders"
          value={url.filters.gender}
          options={["male", "female", "other"]}
          labels={{ male: "Male", female: "Female", other: "Other" }}
          onChange={(value) => url.setFilter("gender", value)}
        />
        <div className="grid min-w-0 gap-1 md:min-w-56 md:flex-1">
          <label htmlFor={`${formId}-doctor-search`} className={fieldLabelClass}>
            Doctor
          </label>
          <input
            id={`${formId}-doctor-search`}
            className={fieldClass}
            value={doctorQuery}
            placeholder="Find a doctor"
            onChange={(event) => setDoctorQuery(event.target.value)}
          />
          <select
            id={`${formId}-doctor`}
            className={fieldClass}
            aria-label="Filter by doctor"
            value={url.filters.doctor}
            onChange={(event) => url.setFilter("doctor", event.target.value)}
          >
            <option value="">All doctors</option>
            {doctorSelectOptions.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid min-w-0 gap-1 md:min-w-72">
          <span className={fieldLabelClass}>Registered</span>
          <DateRangePicker from={url.from} to={url.to} onChange={url.setRange} />
        </div>
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
          title="Could not load patients"
          description={apiErrorMessage(list.error)}
          onRetry={() => void list.refetch()}
        />
      ) : (
        <div
          aria-busy={list.isPlaceholderData || undefined}
          className={list.isPlaceholderData ? "opacity-70" : undefined}
        >
          <DataTable
            label="Patients"
            columns={columns}
            rows={list.data.data}
            getRowId={(patient) => patient.id}
            sort={url.sort}
            order={url.order}
            onSort={url.setSort}
            rowActions={(patient) => (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 px-3"
                  onClick={() => setEditingId(patient.id)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 px-3"
                  aria-label={`Delete ${patient.name}`}
                  onClick={() => setPatientToDelete(patient)}
                >
                  Delete
                </Button>
              </div>
            )}
            empty={
              <EmptyState
                title={canReset ? "No patients match" : "No patients yet"}
                description={
                  canReset
                    ? "Try a different search or filter."
                    : "Add a patient under a doctor."
                }
                action={
                  canReset ? (
                    <Button type="button" variant="outline" className="h-11 px-4" onClick={url.reset}>
                      Reset filters
                    </Button>
                  ) : (
                    <Button type="button" className="h-11 px-4" onClick={() => void setCreate("1")}>
                      Add patient
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
      <AddPatientDialog open={create === "1"} onOpenChange={(next) => void setCreate(next ? "1" : null)} />
      <EditPatientSheet
        patientId={editingId}
        open={editingId !== null}
        onOpenChange={(next) => {
          if (!next) setEditingId(null);
        }}
      />
      <ConfirmDialog
        open={patientToDelete !== null}
        title="Delete patient"
        description={
          patientToDelete
            ? `Delete ${patientToDelete.name}? This cannot be undone.`
            : "Delete this patient?"
        }
        confirmLabel="Delete"
        destructive
        pending={remove.isPending}
        onOpenChange={(open) => {
          if (!open && !remove.isPending) setPatientToDelete(null);
        }}
        onConfirm={() => {
          if (!patientToDelete) return;
          remove.mutate(patientToDelete.id, {
            onSuccess: () => {
              toast.success("Patient deleted");
              setPatientToDelete(null);
            },
            onError: (error) => {
              toast.error(apiErrorMessage(error));
            },
          });
        }}
      />
    </PageFrame>
  );
}

function FilterSelect({
  id,
  label,
  allLabel,
  value,
  options,
  labels,
  onChange,
}: {
  id: string;
  label: string;
  allLabel: string;
  value: string;
  options: string[];
  labels?: Record<string, string>;
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
            {labels?.[option] ?? option}
          </option>
        ))}
      </select>
    </div>
  );
}
