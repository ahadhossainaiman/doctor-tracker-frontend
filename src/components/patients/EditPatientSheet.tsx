"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PatientForm } from "@/components/patients/PatientForm";
import { fieldClass, fieldLabelClass } from "@/components/shared/fields";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDoctors } from "@/features/doctors/hooks";
import { usePatient, useUpdatePatient } from "@/features/patients/hooks";
import type { Patient, UpdatePatientInput } from "@/features/patients/types";
import { useDebounce } from "@/hooks/useDebounce";
import { apiErrorMessage } from "@/lib/apiClient";

type EditPatientSheetProps = {
  patientId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formValues(patient: Patient) {
  return {
    name: patient.name,
    age: String(patient.age),
    gender: patient.gender,
    phone: patient.phone,
    email: patient.email ?? "",
    condition: patient.condition,
    registeredAt: patient.registeredAt.slice(0, 10),
    notes: patient.notes ?? "",
  };
}

export function EditPatientSheet({ patientId, open, onOpenChange }: EditPatientSheetProps) {
  const patient = usePatient(open && patientId ? patientId : "");
  const update = useUpdatePatient(patientId ?? "");
  const [doctorId, setDoctorId] = useState("");
  const [doctorQuery, setDoctorQuery] = useState("");
  const debouncedQuery = useDebounce(doctorQuery, 300);
  const doctors = useDoctors({
    q: debouncedQuery || undefined,
    sort: "name",
    order: "asc",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    if (patient.data) setDoctorId(patient.data.doctor);
  }, [patient.data]);

  const choices = doctors.data?.data ?? [];
  const current = patient.data;
  const doctorOptions =
    current && doctorId === current.doctor && !choices.some((doctor) => doctor.id === current.doctor)
      ? [{ id: current.doctor, name: current.doctorName ?? "Current doctor" }, ...choices]
      : choices;

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next && update.isPending) return;
        onOpenChange(next);
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit patient</SheetTitle>
          <SheetDescription>
            Update the record or move the patient to another doctor. Counts stay in step.
          </SheetDescription>
        </SheetHeader>
        {patient.isPending ? (
          <p className="text-sm text-text-muted">Loading patient</p>
        ) : patient.isError || !current ? (
          <p className="text-sm text-danger-text" role="alert">
            {apiErrorMessage(patient.error)}
          </p>
        ) : (
          <>
            <div className="grid gap-1">
              <label htmlFor="edit-patient-doctor-search" className={fieldLabelClass}>
                Find a doctor
              </label>
              <input
                id="edit-patient-doctor-search"
                className={fieldClass}
                value={doctorQuery}
                placeholder="Name, specialization, or hospital"
                onChange={(event) => setDoctorQuery(event.target.value)}
              />
            </div>
            <PatientForm
              key={`${current.id}-${current.updatedAt}`}
              pending={update.isPending}
              serverError={update.error ? apiErrorMessage(update.error) : null}
              submitLabel="Save changes"
              defaultValues={formValues(current)}
              requireDoctor
              doctors={doctorOptions.map((doctor) => ({ id: doctor.id, name: doctor.name }))}
              doctorId={doctorId}
              onDoctorChange={setDoctorId}
              onCancel={() => onOpenChange(false)}
              onSubmit={(values) => {
                const input: UpdatePatientInput = {
                  ...values,
                  doctor: doctorId,
                  email: values.email ?? "",
                  notes: values.notes ?? "",
                };
                update.mutate(input, {
                  onSuccess: () => {
                    toast.success("Patient updated");
                    onOpenChange(false);
                  },
                });
              }}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
