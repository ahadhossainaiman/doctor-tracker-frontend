"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { invalidateCareQueries } from "@/lib/invalidate";
import { listQueryOptions } from "@/lib/list-query";

import { createDoctor, getDoctor, listDoctorPatients, listDoctors } from "./api";
import type { DoctorFormValues } from "./schema";
import type { DoctorListQuery, DoctorPatientsQuery } from "./types";

export const doctorKeys = {
  all: ["doctors"] as const,
  list: (query: DoctorListQuery) => ["doctors", "list", query] as const,
  detail: (id: string) => ["doctors", "detail", id] as const,
  patients: (id: string, query: DoctorPatientsQuery) => ["doctors", "patients", id, query] as const,
};

export function useDoctors(query: DoctorListQuery) {
  return useQuery({
    queryKey: doctorKeys.list(query),
    queryFn: () => listDoctors(query),
    ...listQueryOptions,
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: () => getDoctor(id),
    enabled: id.length > 0,
  });
}

export function useDoctorPatients(doctorId: string, query: DoctorPatientsQuery, enabled = true) {
  return useQuery({
    queryKey: doctorKeys.patients(doctorId, query),
    queryFn: () => listDoctorPatients(doctorId, query),
    enabled: enabled && doctorId.length > 0,
    ...listQueryOptions,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DoctorFormValues) => createDoctor(input),
    onSettled: () => {
      void invalidateCareQueries(queryClient);
    },
  });
}
