"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";

export function PlaceholderActions() {
  const { resolvedTheme, setTheme } = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-11 px-4"
        aria-label={
          nextTheme === "dark" ? "Switch to dark theme" : "Switch to light theme"
        }
        onClick={() => setTheme(nextTheme)}
      >
        <Sun className="hidden dark:block" />
        <Moon className="block dark:hidden" />
        Theme
      </Button>
      <Button
        type="button"
        className="h-11 px-4"
        onClick={() => setConfirmOpen(true)}
      >
        Sample confirm
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        title="Remove this sample patient?"
        description="This only checks the confirm dialog. Nothing is deleted."
        confirmLabel="Remove"
        destructive
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          setConfirmOpen(false);
          toast.success("Sample action confirmed");
        }}
      />
    </>
  );
}
