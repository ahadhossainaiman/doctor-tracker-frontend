import { toast } from "sonner";

export function showUndoToast(message: string, onUndo: () => void) {
  toast(message, {
    duration: 5000,
    action: {
      label: "Undo",
      onClick: onUndo,
    },
  });
}
