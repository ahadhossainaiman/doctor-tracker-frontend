"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { PatientForm } from "@/components/patients/PatientForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreatePatient } from "@/features/patients/hooks";
import { apiErrorMessage } from "@/lib/apiClient";

type AddPatientDialogProps = {
  doctorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddPatientDialog({ doctorId, open, onOpenChange }: AddPatientDialogProps) {
  const create = useCreatePatient(doctorId);
  const { reset } = create;
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) reset();
    wasOpen.current = open;
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && create.isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[85svh] overflow-y-auto rounded-sheet sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add patient</DialogTitle>
          <DialogDescription>
            This patient is registered under the current doctor. Email, registered date, and notes
            are optional.
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <PatientForm
            pending={create.isPending}
            serverError={create.error ? apiErrorMessage(create.error) : null}
            onCancel={() => onOpenChange(false)}
            onSubmit={(values) => {
              create.mutate(values, {
                onSuccess: () => {
                  toast.success("Patient added");
                  onOpenChange(false);
                },
                onError: (error) => {
                  toast.error(apiErrorMessage(error));
                },
              });
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
