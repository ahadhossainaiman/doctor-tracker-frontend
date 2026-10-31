"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { PatientForm } from "@/components/patients/PatientForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDoctors } from "@/features/doctors/hooks";
import { useCreateAnyPatient, useCreatePatient } from "@/features/patients/hooks";
import { apiErrorMessage } from "@/lib/apiClient";

type AddPatientDialogProps = {
  doctorId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddPatientDialog({ doctorId, open, onOpenChange }: AddPatientDialogProps) {
  const lockedCreate = useCreatePatient(doctorId ?? "");
  const anyCreate = useCreateAnyPatient();
  const doctors = useDoctors({ sort: "name", order: "asc", page: 1, limit: 50 });
  const [selectedDoctor, setSelectedDoctor] = useState(doctorId ?? "");
  const { reset } = doctorId ? lockedCreate : anyCreate;
  const wasOpen = useRef(false);
  const pending = doctorId ? lockedCreate.isPending : anyCreate.isPending;
  const error = doctorId ? lockedCreate.error : anyCreate.error;

  useEffect(() => {
    if (open && !wasOpen.current) {
      reset();
      setSelectedDoctor(doctorId ?? "");
    }
    wasOpen.current = open;
  }, [doctorId, open, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && pending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[85svh] overflow-y-auto rounded-sheet sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add patient</DialogTitle>
          <DialogDescription>
            {doctorId
              ? "This patient is registered under the current doctor. Email, registered date, and notes are optional."
              : "Choose a doctor, then add the patient. Email, registered date, and notes are optional."}
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <PatientForm
            key={doctorId ?? "any"}
            pending={pending}
            serverError={error ? apiErrorMessage(error) : null}
            requireDoctor={!doctorId}
            doctors={
              doctorId
                ? undefined
                : doctors.data?.data.map((doctor) => ({ id: doctor.id, name: doctor.name }))
            }
            doctorId={doctorId ?? selectedDoctor}
            onDoctorChange={setSelectedDoctor}
            onCancel={() => onOpenChange(false)}
            onSubmit={(values) => {
              const ownerId = doctorId ?? selectedDoctor;
              if (!ownerId) return;
              const options = {
                onSuccess: () => {
                  toast.success("Patient added");
                  onOpenChange(false);
                },
                onError: (submitError: unknown) => {
                  toast.error(apiErrorMessage(submitError));
                },
              };
              if (doctorId) {
                lockedCreate.mutate(values, options);
                return;
              }
              anyCreate.mutate({ doctorId: ownerId, input: values }, options);
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
