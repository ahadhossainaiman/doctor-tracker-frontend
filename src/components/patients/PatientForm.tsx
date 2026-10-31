"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/shared/FormField";
import { fieldClass } from "@/components/shared/fields";
import { Button } from "@/components/ui/button";
import {
  patientFormSchema,
  type PatientFormInput,
  type PatientFormValues,
} from "@/features/patients/schema";
import type { CreatePatientInput } from "@/features/patients/types";

type PatientFormProps = {
  pending: boolean;
  serverError?: string | null;
  submitLabel?: string;
  onSubmit: (values: CreatePatientInput) => void;
  onCancel: () => void;
};

const emptyValues: PatientFormInput = {
  name: "",
  age: "",
  gender: "",
  phone: "",
  email: "",
  condition: "",
  registeredAt: "",
  notes: "",
};

export function toCreatePatient(values: PatientFormValues): CreatePatientInput {
  const email = values.email.trim();
  const notes = values.notes.trim();

  return {
    name: values.name.trim(),
    age: Number(values.age),
    gender: values.gender,
    phone: values.phone.trim(),
    condition: values.condition.trim(),
    ...(email ? { email } : {}),
    ...(values.registeredAt ? { registeredAt: values.registeredAt } : {}),
    ...(notes ? { notes } : {}),
  };
}

export function PatientForm({
  pending,
  serverError,
  submitLabel = "Add patient",
  onSubmit,
  onCancel,
}: PatientFormProps) {
  const formId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormInput, unknown, PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: emptyValues,
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit((values) => onSubmit(toCreatePatient(values)))}
      noValidate
    >
      <FormField id={`${formId}-name`} label="Name" error={errors.name?.message}>
        <input
          id={`${formId}-name`}
          className={fieldClass}
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          {...register("name")}
        />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id={`${formId}-age`} label="Age" error={errors.age?.message}>
          <input
            id={`${formId}-age`}
            inputMode="numeric"
            className={fieldClass}
            aria-invalid={errors.age ? true : undefined}
            aria-describedby={errors.age ? `${formId}-age-error` : undefined}
            {...register("age")}
          />
        </FormField>
        <FormField id={`${formId}-gender`} label="Gender" error={errors.gender?.message}>
          <select
            id={`${formId}-gender`}
            className={fieldClass}
            aria-invalid={errors.gender ? true : undefined}
            aria-describedby={errors.gender ? `${formId}-gender-error` : undefined}
            {...register("gender")}
          >
            <option value="">Choose</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </FormField>
      </div>
      <FormField id={`${formId}-phone`} label="Phone" error={errors.phone?.message}>
        <input
          id={`${formId}-phone`}
          type="tel"
          autoComplete="tel"
          className={fieldClass}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
          {...register("phone")}
        />
      </FormField>
      <FormField id={`${formId}-email`} label="Email" error={errors.email?.message}>
        <input
          id={`${formId}-email`}
          type="email"
          autoComplete="email"
          spellCheck={false}
          placeholder="Optional"
          className={fieldClass}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          {...register("email")}
        />
      </FormField>
      <FormField id={`${formId}-condition`} label="Condition" error={errors.condition?.message}>
        <input
          id={`${formId}-condition`}
          className={fieldClass}
          aria-invalid={errors.condition ? true : undefined}
          aria-describedby={errors.condition ? `${formId}-condition-error` : undefined}
          {...register("condition")}
        />
      </FormField>
      <FormField id={`${formId}-registered`} label="Registered" error={errors.registeredAt?.message}>
        <input
          id={`${formId}-registered`}
          type="date"
          className={fieldClass}
          aria-invalid={errors.registeredAt ? true : undefined}
          aria-describedby={errors.registeredAt ? `${formId}-registered-error` : undefined}
          {...register("registeredAt")}
        />
      </FormField>
      <FormField id={`${formId}-notes`} label="Notes" error={errors.notes?.message}>
        <textarea
          id={`${formId}-notes`}
          rows={4}
          className={`${fieldClass} h-auto py-2`}
          aria-invalid={errors.notes ? true : undefined}
          aria-describedby={errors.notes ? `${formId}-notes-error` : undefined}
          {...register("notes")}
        />
      </FormField>
      {serverError ? (
        <p className="text-sm text-danger-text" role="alert">
          {serverError}
        </p>
      ) : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="h-11 px-4" disabled={pending} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="h-11 px-4" disabled={pending}>
          {pending ? "Saving" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
