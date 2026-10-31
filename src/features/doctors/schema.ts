import { z } from "zod";

import { phoneSchema } from "@/lib/validators";

export const doctorFormSchema = z.object({
  name: z.string().trim().min(1, "Enter a name.").max(120, "Use 120 characters or fewer."),
  specialization: z
    .string()
    .trim()
    .min(1, "Enter a specialization.")
    .max(120, "Use 120 characters or fewer."),
  hospital: z.string().trim().min(1, "Enter a hospital.").max(160, "Use 160 characters or fewer."),
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email."),
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;
