"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { DoctorForm } from "@/components/doctors/DoctorForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateDoctor } from "@/features/doctors/hooks";
import { apiErrorMessage } from "@/lib/apiClient";

type AddDoctorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddDoctorDialog({ open, onOpenChange }: AddDoctorDialogProps) {
  const create = useCreateDoctor();
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
          <DialogTitle>Add doctor</DialogTitle>
          <DialogDescription>
            Name, specialization, hospital, phone, and email are required.
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <DoctorForm
            pending={create.isPending}
            serverError={create.error ? apiErrorMessage(create.error) : null}
            onCancel={() => onOpenChange(false)}
            onSubmit={(values) => {
              create.mutate(values, {
                onSuccess: () => {
                  toast.success("Doctor added");
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
