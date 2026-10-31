"use client";

import { LayoutDashboard, Stethoscope, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

const items = [
  { id: "dashboard", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "doctors", href: "/doctors", label: "Doctors", icon: Stethoscope },
  { id: "patients", href: "/patients", label: "Patients", icon: Users },
] as const;

type MobileBottomNavProps = {
  activeId?: (typeof items)[number]["id"];
  onSelect?: (id: (typeof items)[number]["id"]) => void;
  className?: string;
};

/** Linked tabs in the app shell. The design preview still drives it with onSelect. */
export function MobileBottomNav({
  activeId,
  onSelect,
  className,
}: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "grid grid-cols-3 border-t border-border bg-surface-raised",
        className,
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = onSelect
          ? item.id === (activeId ?? "dashboard")
          : isNavActive(pathname, item.href);
        const itemClass = cn(
          "flex h-14 flex-col items-center justify-center gap-1 text-xs focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
          active ? "text-brand" : "text-text-muted",
        );

        if (onSelect) {
          return (
            <button
              key={item.id}
              type="button"
              className={itemClass}
              aria-current={active ? "page" : undefined}
              onClick={() => onSelect(item.id)}
            >
              <Icon className="size-5" aria-hidden="true" />
              {item.label}
            </button>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            className={itemClass}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
