"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { FilterChip } from "@/components/shared/FilterChip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ActiveFilter = {
  id: string;
  label: string;
};

type FilterBarProps = {
  search?: ReactNode;
  children?: ReactNode;
  chips: ActiveFilter[];
  onRemoveChip: (id: string) => void;
  onReset: () => void;
  canReset: boolean;
};

export function FilterBar({
  search,
  children,
  chips,
  onRemoveChip,
  onReset,
  canReset,
}: FilterBarProps) {
  const sheetId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const sheet = document.getElementById(sheetId);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !sheet) return;
      const focusable = [...sheet.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href]")].filter(
        (element) => !element.hasAttribute("disabled"),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, sheetId]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">{search}</div>
        <Button
          type="button"
          variant="outline"
          className="h-11 px-4 md:hidden"
          aria-expanded={open}
          aria-controls={sheetId}
          onClick={() => {
            setOpen(true);
            requestAnimationFrame(() => closeRef.current?.focus());
          }}
        >
          Filters
        </Button>
        {canReset ? (
          <Button
            type="button"
            variant="outline"
            className="hidden h-11 px-4 md:inline-flex"
            onClick={onReset}
          >
            Reset
          </Button>
        ) : null}
      </div>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/10 md:hidden"
          aria-label="Close filters"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div
        id={sheetId}
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? "Filters" : undefined}
        className={cn(
          "md:static md:z-auto md:block md:max-h-none md:overflow-visible md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none",
          open
            ? "fixed inset-x-0 bottom-0 z-50 max-h-[85svh] overflow-y-auto rounded-t-sheet border border-border bg-popover/85 p-4 pb-6 text-text shadow-overlay backdrop-blur-xl"
            : "hidden",
        )}
      >
        <div className="mb-4 flex items-center justify-between md:hidden">
          <h2 className="text-base font-semibold">Filters</h2>
          <Button
            ref={closeRef}
            type="button"
            variant="outline"
            className="h-11 w-11"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">{children}</div>
        <div className="mt-4 flex gap-2 md:hidden">
          {canReset ? (
            <Button type="button" variant="outline" className="h-11 flex-1 px-4" onClick={onReset}>
              Reset
            </Button>
          ) : null}
          <Button type="button" className="h-11 flex-1 px-4" onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </div>
      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <FilterChip key={chip.id} label={chip.label} onRemove={() => onRemoveChip(chip.id)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
