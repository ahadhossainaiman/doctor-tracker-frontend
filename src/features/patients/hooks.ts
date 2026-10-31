"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { doctorKeys } from "@/features/doctors/hooks";
import type { Doctor } from "@/features/doctors/types";
import { invalidateCareQueries } from "@/lib/invalidate";

import { createPatient, deleteDoctorPatient } from "./api";
import type { CreatePatientInput, PatientListResult } from "./types";

export const patientKeys = {
  all: ["patients"] as const,
};

export function useCreatePatient(doctorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePatientInput) => createPatient(doctorId, input),
    onSettled: () => {
      void invalidateCareQueries(queryClient);
    },
  });
}

export function useDeleteDoctorPatient(doctorId: string) {
  const queryClient = useQueryClient();
  const patientsKey = ["doctors", "patients", doctorId] as const;

  return useMutation({
    mutationFn: (patientId: string) => deleteDoctorPatient(doctorId, patientId),
    onMutate: async (patientId) => {
      await queryClient.cancelQueries({ queryKey: patientsKey });
      await queryClient.cancelQueries({ queryKey: doctorKeys.detail(doctorId) });

      const previousPatients = queryClient.getQueriesData<PatientListResult>({
        queryKey: patientsKey,
      });
      const previousDoctor = queryClient.getQueryData<Doctor>(doctorKeys.detail(doctorId));

      queryClient.setQueriesData<PatientListResult>({ queryKey: patientsKey }, (current) => {
        if (!current) return current;
        const data = current.data.filter((patient) => patient.id !== patientId);
        if (data.length === current.data.length) return current;
        const total = Math.max(0, current.meta.total - 1);
        const totalPages = current.meta.limit > 0 ? Math.ceil(total / current.meta.limit) : 0;
        return { data, meta: { ...current.meta, total, totalPages } };
      });

      if (previousDoctor) {
        queryClient.setQueryData<Doctor>(doctorKeys.detail(doctorId), {
          ...previousDoctor,
          patientCount: Math.max(0, previousDoctor.patientCount - 1),
        });
      }

      return { previousPatients, previousDoctor };
    },
    onError: (_error, _patientId, context) => {
      for (const [key, data] of context?.previousPatients ?? []) {
        queryClient.setQueryData(key, data);
      }
      if (context?.previousDoctor) {
        queryClient.setQueryData(doctorKeys.detail(doctorId), context.previousDoctor);
      }
    },
    onSettled: () => {
      void invalidateCareQueries(queryClient);
    },
  });
}
