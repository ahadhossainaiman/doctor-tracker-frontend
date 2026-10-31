"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/shared/FormField";
import { fieldClass } from "@/components/shared/fields";
import { Button } from "@/components/ui/button";
import { doctorFormSchema, type DoctorFormValues } from "@/features/doctors/schema";

type DoctorFormProps = {
  pending: boolean;
  serverError?: string | null;
  onSubmit: (values: DoctorFormValues) => void;
  onCancel: () => void;
};

export function DoctorForm({ pending, serverError, onSubmit, onCancel }: DoctorFormProps) {
  const formId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
    },
  });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
      <FormField
        id={`${formId}-specialization`}
        label="Specialization"
        error={errors.specialization?.message}
      >
        <input
          id={`${formId}-specialization`}
          className={fieldClass}
          aria-invalid={errors.specialization ? true : undefined}
          aria-describedby={errors.specialization ? `${formId}-specialization-error` : undefined}
          {...register("specialization")}
        />
      </FormField>
      <FormField id={`${formId}-hospital`} label="Hospital" error={errors.hospital?.message}>
        <input
          id={`${formId}-hospital`}
          className={fieldClass}
          aria-invalid={errors.hospital ? true : undefined}
          aria-describedby={errors.hospital ? `${formId}-hospital-error` : undefined}
          {...register("hospital")}
        />
      </FormField>
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
          className={fieldClass}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          {...register("email")}
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
          {pending ? "Saving" : "Add doctor"}
        </Button>
      </div>
    </form>
  );
}
