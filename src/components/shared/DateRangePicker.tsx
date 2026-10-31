"use client";

import { useId } from "react";

import { fieldClass, fieldLabelClass } from "@/components/shared/fields";

type DateRangePickerProps = {
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
};

export function DateRangePicker({ from, to, onChange }: DateRangePickerProps) {
  const id = useId();

  return (
    <fieldset className="grid gap-3 sm:grid-cols-2">
      <legend className="sr-only">Date range</legend>
      <div className="grid gap-1">
        <label htmlFor={`${id}-from`} className={fieldLabelClass}>
          From
        </label>
        <input
          id={`${id}-from`}
          type="date"
          value={from}
          max={to || undefined}
          className={fieldClass}
          onChange={(event) => onChange({ from: event.target.value, to })}
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor={`${id}-to`} className={fieldLabelClass}>
          To
        </label>
        <input
          id={`${id}-to`}
          type="date"
          value={to}
          min={from || undefined}
          className={fieldClass}
          onChange={(event) => onChange({ from, to: event.target.value })}
        />
      </div>
    </fieldset>
  );
}
