"use client";

import { useEffect, useId, useRef, useState } from "react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { authErrorMessage, useLogout, useMe } from "@/features/auth/hooks";

export function Topbar() {
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const me = useMe();
  const logout = useLogout();
  const name = me.data?.name || "Account";
  const email = me.data?.email;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface-raised">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 md:px-8">
        <p className="text-sm font-semibold tracking-tight text-text">Doctor Tracker</p>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="relative" ref={menuRef}>
            <Button
              type="button"
              variant="outline"
              className="h-11 max-w-48 px-4"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((current) => !current)}
            >
              <span className="truncate">{me.isLoading ? "Loading" : name}</span>
            </Button>
            {open ? (
              <div
                id={menuId}
                role="menu"
                aria-label="Account"
                className="absolute top-12 right-0 z-40 w-64 rounded-card border border-border bg-popover p-2 shadow-overlay"
              >
                {email ? (
                  <p className="px-3 py-2 text-sm text-text-muted">{email}</p>
                ) : null}
                {logout.error ? (
                  <p className="px-3 pb-2 text-sm text-danger-text" role="alert">
                    {authErrorMessage(logout.error)}
                  </p>
                ) : null}
                <button
                  type="button"
                  role="menuitem"
                  className="flex h-11 w-full items-center rounded-lg px-3 text-left text-sm text-text hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  disabled={logout.isPending}
                  onClick={() => logout.logout()}
                >
                  {logout.isPending ? "Signing out" : "Log out"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
