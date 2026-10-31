"use client";

import { LayoutDashboard, Stethoscope, Users } from "lucide-react";

const items = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "doctors", label: "Doctors", icon: Stethoscope },
  { id: "patients", label: "Patients", icon: Users },
] as const;

type MobileBottomNavProps = {
  activeId?: (typeof items)[number]["id"];
  onSelect?: (id: (typeof items)[number]["id"]) => void;
};

/** Shell only. The dashboard layout mounts this in F3. */
export function MobileBottomNav({
  activeId = "dashboard",
  onSelect,
}: MobileBottomNavProps) {
  return (
    <nav aria-label="Primary" className="grid grid-cols-3 border-t border-border bg-surface-raised">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            className={`flex h-14 flex-col items-center justify-center gap-1 text-xs focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
              active ? "text-brand" : "text-text-muted"
            }`}
            aria-current={active ? "page" : undefined}
            onClick={() => onSelect?.(item.id)}
          >
            <Icon className="size-5" aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
