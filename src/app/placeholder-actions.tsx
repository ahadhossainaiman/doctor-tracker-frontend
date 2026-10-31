"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";

export function PlaceholderActions() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
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
