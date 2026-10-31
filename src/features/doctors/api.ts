import { ApiError, apiClient } from "@/lib/apiClient";
import { toQuery } from "@/lib/search-params";

import type { Doctor, DoctorListQuery, DoctorListResult, DoctorPatientsQuery } from "./types";
import type { DoctorFormValues } from "./schema";
import type { PatientListResult } from "@/features/patients/types";

function requireMeta<T>(data: T, meta: DoctorListResult["meta"] | undefined): { data: T; meta: DoctorListResult["meta"] } {
  if (!meta) {
    throw new ApiError(500, "INTERNAL_ERROR", "List response was missing pagination.");
  }
  return { data, meta };
}

export async function listDoctors(query: DoctorListQuery): Promise<DoctorListResult> {
  const response = await apiClient<Doctor[]>(`/doctors${toQuery(query)}`);
  return requireMeta(response.data, response.meta);
}

export async function getDoctor(id: string) {
  const response = await apiClient<Doctor>(`/doctors/${encodeURIComponent(id)}`);
  return response.data;
}

export async function createDoctor(input: DoctorFormValues) {
  const response = await apiClient<Doctor>("/doctors", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function listDoctorPatients(
  doctorId: string,
  query: DoctorPatientsQuery,
): Promise<PatientListResult> {
  const response = await apiClient<PatientListResult["data"]>(
    `/doctors/${encodeURIComponent(doctorId)}/patients${toQuery(query)}`,
  );
  return requireMeta(response.data, response.meta);
}
