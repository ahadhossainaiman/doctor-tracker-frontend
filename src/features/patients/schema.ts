import { z } from "zod";

import { PATIENT_GENDERS, type PatientGender } from "@/features/patients/types";
import { phoneSchema } from "@/lib/validators";

export const patientFormSchema = z.object({
  name: z.string().trim().min(1, "Enter a name.").max(120, "Use 120 characters or fewer."),
  age: z
    .string()
    .trim()
    .min(1, "Enter an age.")
    .regex(/^\d+$/, "Enter a whole number from 0 to 130.")
    .refine((value) => Number(value) <= 130, "Enter a whole number from 0 to 130."),
  gender: z.string().refine((value): value is PatientGender => {
    return PATIENT_GENDERS.includes(value as PatientGender);
  }, "Choose a gender."),
  phone: phoneSchema,
  email: z.string().trim().refine((value) => {
    return value === "" || z.email().safeParse(value).success;
  }, "Enter a valid email."),
  condition: z
    .string()
    .trim()
    .min(1, "Enter a condition.")
    .max(120, "Use 120 characters or fewer."),
  registeredAt: z
    .string()
    .refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), "Enter a valid date."),
  notes: z.string().trim().max(2000, "Use 2000 characters or fewer."),
});

export type PatientFormInput = z.input<typeof patientFormSchema>;
export type PatientFormValues = z.output<typeof patientFormSchema>;
