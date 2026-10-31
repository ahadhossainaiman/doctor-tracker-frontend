import type { SortOrder } from "@/hooks/useUrlState";
import type { PageMeta } from "@/types/api";

export const DOCTOR_SORTS = ["name", "createdAt", "patientCount"] as const;

export type DoctorSort = (typeof DOCTOR_SORTS)[number];

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount: number;
  createdAt: string;
  updatedAt: string;
};

export type DoctorListQuery = {
  q?: string;
  specialization?: string;
  hospital?: string;
  from?: string;
  to?: string;
  sort: DoctorSort;
  order: SortOrder;
  page: number;
  limit: number;
};

export type DoctorPatientsQuery = {
  q?: string;
  page: number;
  limit: number;
};

export type DoctorListResult = {
  data: Doctor[];
  meta: PageMeta;
};

export function asDoctorSort(value: string): DoctorSort {
  return DOCTOR_SORTS.includes(value as DoctorSort) ? (value as DoctorSort) : "createdAt";
}
