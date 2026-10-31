"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavActive, primaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-svh shrink-0 flex-col border-r border-border bg-surface-raised transition-[width] duration-200 ease-out md:flex",
        collapsed ? "w-[72px] lg:w-[72px]" : "w-[220px] lg:w-[240px] xl:w-[264px]",
      )}
    >
      <div className="flex h-16 items-center border-b border-border px-3">
        <Link
          href="/dashboard"
          aria-label="Doctor Tracker"
          className="flex h-11 min-w-0 items-center rounded-lg px-2 text-sm font-semibold tracking-tight text-text focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {collapsed ? <span aria-hidden="true">DT</span> : <span className="truncate">Doctor Tracker</span>}
        </Link>
      </div>
      <LayoutGroup id="sidebar-nav">
        <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 p-3">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors duration-150 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  collapsed && "justify-center px-0",
                  active
                    ? "font-medium text-brand"
                    : "text-text-muted hover:bg-muted hover:text-text",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-accent"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <Icon className="relative z-10 size-5 shrink-0" aria-hidden="true" />
                <span className={cn("relative z-10", collapsed ? "sr-only" : "truncate")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </LayoutGroup>
      <div className="border-t border-border p-3">
        <button
          type="button"
          className={cn(
            "flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-text-muted transition-colors duration-150 hover:bg-muted hover:text-text focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
            collapsed && "justify-center px-0",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggle}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="size-5" aria-hidden="true" />
          )}
          <span className={collapsed ? "sr-only" : undefined}>Collapse</span>
        </button>
      </div>
    </aside>
  );
}
