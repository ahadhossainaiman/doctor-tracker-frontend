"use client";

import { ChevronRight, Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { useCommandPalette } from "@/components/layout/CommandPalette";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { authErrorMessage, useLogout, useMe } from "@/features/auth/hooks";
import { crumbsFor } from "@/lib/nav";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const crumbs = crumbsFor(pathname);
  const current = crumbs[crumbs.length - 1];
  const openPalette = useCommandPalette();
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
    <header className="sticky top-0 z-30 border-b border-border bg-surface-raised/85 backdrop-blur-xl">
      <div className="flex h-14 w-full items-center gap-2 px-4 sm:h-16 sm:gap-3 sm:px-6 md:px-8 xl:px-10">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-11 md:hidden"
          aria-label="Open menu"
          onClick={onOpenMenu}
        >
          <Menu />
        </Button>
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text md:hidden">{current?.label}</p>
          <ol className="hidden items-center gap-1 text-sm md:flex">
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1;
              return (
                <li key={crumb.href} className="flex min-w-0 items-center gap-1">
                  {index > 0 ? (
                    <ChevronRight className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
                  ) : null}
                  {last ? (
                    <span className="truncate font-semibold text-text" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="truncate text-text-muted hover:text-text focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-text-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:w-auto md:justify-start md:px-4"
          aria-label="Open command palette"
          onClick={openPalette}
        >
          <Search className="size-4" aria-hidden="true" />
          <span className="ml-2 hidden text-sm md:inline">Search</span>
          <kbd className="ml-3 hidden font-mono text-xs md:inline">Ctrl+K</kbd>
        </button>
        <ThemeToggle />
        <div className="relative" ref={menuRef}>
          <Button
            type="button"
            variant="outline"
            className="h-11 max-w-28 px-3 md:max-w-48 md:px-4"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((currentOpen) => !currentOpen)}
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
              {email ? <p className="px-3 py-2 text-sm text-text-muted">{email}</p> : null}
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
    </header>
  );
}
