import type { PageMeta } from "@/types/api";

export const PATIENT_GENDERS = ["male", "female", "other"] as const;

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

export type PatientListResult = {
  data: Patient[];
  meta: PageMeta;
};
