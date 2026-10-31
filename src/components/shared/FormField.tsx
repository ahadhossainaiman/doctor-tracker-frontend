import type { ReactNode } from "react";

import { fieldLabelClass } from "@/components/shared/fields";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}
