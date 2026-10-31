import { apiClient } from "@/lib/apiClient";

import type { CreatePatientInput, Patient } from "./types";

export async function createPatient(doctorId: string, input: CreatePatientInput) {
  const response = await apiClient<Patient>(`/doctors/${encodeURIComponent(doctorId)}/patients`, {
    method: "POST",
    body: JSON.stringify(input),
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
