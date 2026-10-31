"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/PageHeader";
import { AddPatientDialog } from "@/components/patients/AddPatientDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterBar } from "@/components/shared/FilterBar";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { ListSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { useDoctor, useDoctorPatients } from "@/features/doctors/hooks";
import { useDeleteDoctorPatient } from "@/features/patients/hooks";
import type { Patient } from "@/features/patients/types";
import { useUrlState } from "@/hooks/useUrlState";
import { ApiError, apiErrorMessage } from "@/lib/apiClient";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { formatCount, formatGender, formatUtcDate } from "@/lib/format";

const NO_FILTERS = [] as const;

const pageClass = "mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 md:px-8";

export function DoctorDetailView({ id }: { id: string }) {
  const url = useUrlState(NO_FILTERS);
  const { page, setPage } = url;
  const doctor = useDoctor(id);
  const query = useMemo(
    () => ({
      q: url.q || undefined,
      page,
      limit: url.limit,
    }),
    [url.limit, page, url.q],
  );
  const patients = useDoctorPatients(id, query, doctor.isSuccess);
  const remove = useDeleteDoctorPatient(id);
  const [addOpen, setAddOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const totalPages = patients.data?.meta.totalPages ?? 0;

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages);
  }, [page, setPage, totalPages]);

  const canReset = Boolean(url.q || page > 1 || url.limit !== DEFAULT_PAGE_SIZE);

  const columns: Column<Patient>[] = [
    { id: "name", header: "Name", cell: (patient) => patient.name },
    {
      id: "age",
      header: "Age",
      className: "tabular-nums",
      cell: (patient) => formatCount(patient.age),
    },
    { id: "gender", header: "Gender", cell: (patient) => formatGender(patient.gender) },
    { id: "phone", header: "Phone", cell: (patient) => patient.phone },
    { id: "condition", header: "Condition", cell: (patient) => patient.condition },
    {
      id: "registered",
      header: "Registered",
      cell: (patient) => (
        <time dateTime={patient.registeredAt} title={patient.registeredAt}>
          {formatUtcDate(patient.registeredAt)}
        </time>
      ),
    },
  ];

  if (doctor.isPending) {
    return (
      <div className={pageClass}>
        <ListSkeleton rows={8} />
      </div>
    );
  }

  if (doctor.isError || !doctor.data) {
    const missing = doctor.error instanceof ApiError && doctor.error.status === 404;
    return (
      <div className={pageClass}>
        <ErrorState
          title={missing ? "Doctor not found" : "Could not load this doctor"}
          description={apiErrorMessage(doctor.error)}
          onRetry={() => void doctor.refetch()}
        />
      </div>
    );
  }

  const profile = doctor.data;

  return (
    <div className={pageClass}>
      <PageHeader
        title={profile.name}
        description={`${profile.specialization} · ${profile.hospital}`}
        actions={
          <Button type="button" className="h-11 px-4" onClick={() => setAddOpen(true)}>
            Add patient
          </Button>
        }
      />
      <dl className="grid gap-4 rounded-card border border-border bg-surface-raised p-5 shadow-card sm:grid-cols-2 lg:grid-cols-3">
        <ProfileItem label="Phone">
          <a className="underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" href={`tel:${profile.phone}`}>
            {profile.phone}
          </a>
        </ProfileItem>
        <ProfileItem label="Email">
          <a className="underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </ProfileItem>
        <ProfileItem label="Patients">
          <span className="tabular-nums">{formatCount(profile.patientCount)}</span>
        </ProfileItem>
        <ProfileItem label="Created">
          <time dateTime={profile.createdAt} title={profile.createdAt}>
            {formatUtcDate(profile.createdAt)}
          </time>
        </ProfileItem>
      </dl>

      <section className="flex flex-col gap-4" aria-labelledby="doctor-patients-heading">
        <h2 id="doctor-patients-heading" className="text-xl font-semibold text-text">
          Patients
        </h2>
        <FilterBar
          search={
            <SearchInput
              value={url.q}
              onChange={url.setQ}
              label="Search patients"
              placeholder="Name, condition, or phone"
            />
          }
          chips={url.q ? [{ id: "q", label: `Search: ${url.q}` }] : []}
          canReset={canReset}
          onReset={url.reset}
          onRemoveChip={(chipId) => {
            if (chipId === "q") url.setQ("");
          }}
        />
        {patients.isPending ? (
          <ListSkeleton rows={6} />
        ) : patients.isError ? (
          <ErrorState
            title="Could not load patients"
            description={apiErrorMessage(patients.error)}
            onRetry={() => void patients.refetch()}
          />
        ) : (
          <div
            aria-busy={patients.isPlaceholderData || undefined}
            className={patients.isPlaceholderData ? "opacity-70" : undefined}
          >
            <DataTable
              label={`Patients of ${profile.name}`}
              columns={columns}
              rows={patients.data.data}
              getRowId={(patient) => patient.id}
              rowActions={(patient) => (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 px-4"
                  aria-label={`Delete ${patient.name}`}
                  onClick={() => setPatientToDelete(patient)}
                >
                  Delete
                </Button>
              )}
              empty={
                <EmptyState
                  title={url.q ? "No patients match" : "No patients yet"}
                  description={
                    url.q
                      ? "Try a different search."
                      : "Add a patient to this doctor."
                  }
                  action={
                    url.q ? (
                      <Button type="button" variant="outline" className="h-11 px-4" onClick={url.reset}>
                        Reset search
                      </Button>
                    ) : (
                      <Button type="button" className="h-11 px-4" onClick={() => setAddOpen(true)}>
                        Add patient
                      </Button>
                    )
                  }
                />
              }
            />
            <div className="mt-4">
              <Pagination
                page={patients.data.meta.page}
                totalPages={patients.data.meta.totalPages}
                total={patients.data.meta.total}
                limit={url.limit}
                onPageChange={url.setPage}
                onLimitChange={url.setLimit}
              />
            </div>
          </div>
        )}
      </section>

      <AddPatientDialog doctorId={id} open={addOpen} onOpenChange={setAddOpen} />
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
    </div>
  );
}

function ProfileItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className="mt-1 truncate text-sm text-text">{children}</dd>
    </div>
  );
}
