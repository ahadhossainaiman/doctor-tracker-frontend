import type { SortOrder } from "@/hooks/useUrlState";
import type { PageMeta } from "@/types/api";

export const PATIENT_GENDERS = ["male", "female", "other"] as const;
export const PATIENT_SORTS = ["name", "registeredAt", "age", "createdAt"] as const;

export type PatientSort = (typeof PATIENT_SORTS)[number];

export type PatientGender = (typeof PATIENT_GENDERS)[number];

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  email?: string;
  condition: string;
  registeredAt: string;
  notes?: string;
  doctor: string;
  doctorName?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatePatientInput = {
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  email?: string;
  condition: string;
  registeredAt?: string;
  notes?: string;
};

export type UpdatePatientInput = Partial<CreatePatientInput> & {
  doctor?: string;
};

export type PatientListQuery = {
  q?: string;
  condition?: string;
  doctor?: string;
  gender?: PatientGender;
  from?: string;
  to?: string;
  sort: PatientSort;
  order: SortOrder;
  page: number;
  limit: number;
};

export type PatientListResult = {
  data: Patient[];
  meta: PageMeta;
};

export function asPatientSort(value: string): PatientSort {
  return PATIENT_SORTS.includes(value as PatientSort) ? (value as PatientSort) : "registeredAt";
}

export function asPatientGender(value: string): PatientGender | undefined {
  return PATIENT_GENDERS.includes(value as PatientGender) ? (value as PatientGender) : undefined;
}
