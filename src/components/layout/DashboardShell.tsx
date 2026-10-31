"use client";

import { useState, type ReactNode } from "react";

import { CommandPaletteRoot } from "@/components/layout/CommandPalette";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <CommandPaletteRoot>
      <div className="flex min-h-svh w-full flex-1 bg-surface">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:rounded-lg focus:bg-brand focus:px-4 focus:text-sm focus:font-medium focus:text-brand-foreground"
        >
          Skip to content
        </a>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMenu={() => setMenuOpen(true)} />
          <div id="main" className="flex-1 pb-14 md:pb-0">
            {children}
          </div>
        </div>
      </div>
      <MobileBottomNav className="fixed inset-x-0 bottom-0 z-30 md:hidden" />
      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </CommandPaletteRoot>
  );
}
