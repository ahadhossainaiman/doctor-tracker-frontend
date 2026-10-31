"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { isNavActive, primaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="fixed inset-x-0 bottom-0 z-50 rounded-t-sheet border border-border bg-popover/85 p-4 pb-6 text-text shadow-overlay backdrop-blur-xl outline-none"
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold">Menu</DialogTitle>
            <DialogPrimitive.Close asChild>
              <Button type="button" variant="outline" className="h-11 w-11" aria-label="Close menu">
                <XIcon />
              </Button>
            </DialogPrimitive.Close>
          </div>
          <DialogDescription className="mt-1 text-sm text-text-muted">
            Jump to a section of Doctor Tracker.
          </DialogDescription>
          <nav aria-label="Menu" className="mt-4 grid gap-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-lg px-3 text-sm focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                    active
                      ? "bg-accent font-medium text-brand"
                      : "text-text hover:bg-muted",
                  )}
                  onClick={() => onOpenChange(false)}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
