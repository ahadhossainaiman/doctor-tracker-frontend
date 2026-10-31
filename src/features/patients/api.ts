import { ApiError, apiClient } from "@/lib/apiClient";
import { toQuery } from "@/lib/search-params";

import type {
  CreatePatientInput,
  Patient,
  PatientListQuery,
  PatientListResult,
  UpdatePatientInput,
} from "./types";

function requireMeta(data: Patient[], meta: PatientListResult["meta"] | undefined): PatientListResult {
  if (!meta) {
    throw new ApiError(500, "INTERNAL_ERROR", "List response was missing pagination.");
  }
  return { data, meta };
}

export async function listPatients(query: PatientListQuery): Promise<PatientListResult> {
  const response = await apiClient<Patient[]>(`/patients${toQuery(query)}`);
  return requireMeta(response.data, response.meta);
}

export async function getPatient(id: string) {
  const response = await apiClient<Patient>(`/patients/${encodeURIComponent(id)}`);
  return response.data;
}

export async function createPatient(doctorId: string, input: CreatePatientInput) {
  const response = await apiClient<Patient>(`/doctors/${encodeURIComponent(doctorId)}/patients`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function updatePatient(id: string, input: UpdatePatientInput) {
  const response = await apiClient<Patient>(`/patients/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function deletePatient(id: string) {
  const response = await apiClient<{ deleted: true }>(`/patients/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return response.data;
}

export async function deleteDoctorPatient(doctorId: string, patientId: string) {
  const response = await apiClient<{ deleted: true }>(
    `/doctors/${encodeURIComponent(doctorId)}/patients/${encodeURIComponent(patientId)}`,
    { method: "DELETE" },
  );
  return response.data;
}
