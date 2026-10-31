"use client";

import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const groups = [
  {
    heading: "Pages",
    items: ["Dashboard", "Doctors", "Patients"],
  },
  {
    heading: "Actions",
    items: ["Add doctor", "Add patient"],
  },
] as const;

/** Shell only. Page jumps and actions are connected in later steps. */
export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-11 items-center rounded-lg border border-border bg-surface-raised px-4 text-sm text-text-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        onClick={() => setOpen(true)}
      >
        Search
        <kbd className="ml-3 font-mono text-xs">Ctrl+K</kbd>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="overflow-hidden rounded-sheet bg-popover/85 p-0 shadow-overlay backdrop-blur-xl sm:max-w-lg"
        >
          <DialogTitle className="sr-only">Command palette</DialogTitle>
          <DialogDescription className="sr-only">
            Jump to a page or start an action. Results are not connected yet.
          </DialogDescription>
          <Command className="bg-transparent text-text" label="Command palette">
            <Command.Input
              placeholder="Search doctors, patients, and actions"
              className="h-12 w-full border-b border-border bg-transparent px-4 text-sm text-text outline-none placeholder:text-text-muted"
            />
            <Command.List className="max-h-72 overflow-y-auto p-2">
              <Command.Empty className="px-3 py-6 text-center text-sm text-text-muted">
                No matches.
              </Command.Empty>
              {groups.map((group) => (
                <Command.Group
                  key={group.heading}
                  heading={group.heading}
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-text-muted"
                >
                  {group.items.map((item) => (
                    <Command.Item
                      key={item}
                      value={item}
                      className="flex h-11 cursor-pointer items-center rounded-lg px-3 text-sm data-[selected=true]:bg-accent"
                      onSelect={() => {
                        setOpen(false);
                        toast(`${item} is not connected yet`);
                      }}
                    >
                      {item}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
