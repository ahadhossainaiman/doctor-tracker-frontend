"use client";

import { Search } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { fieldClass, fieldLabelClass } from "@/components/shared/fields";
import { useDebounce } from "@/hooks/useDebounce";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
};

export function SearchInput({
  value,
  onChange,
  label = "Search",
  placeholder = "Search",
}: SearchInputProps) {
  const id = useId();
  const [text, setText] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setText(value);
  }
  const debounced = useDebounce(text, 300);

  useEffect(() => {
    if (debounced === text && debounced !== value) onChange(debounced);
  }, [debounced, onChange, text, value]);

  return (
    <div className="grid gap-1">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted"
          aria-hidden="true"
        />
        <input
          id={id}
          value={text}
          placeholder={placeholder}
          className={`${fieldClass} pl-9`}
          onChange={(event) => setText(event.target.value)}
        />
      </div>
    </div>
  );
}
