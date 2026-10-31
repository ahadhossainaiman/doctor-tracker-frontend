"use client";

import { Suspense, useState, type ReactNode } from "react";

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
        <Suspense fallback={<SidebarFallback />}>
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} />
        </Suspense>
        <div className="flex min-w-0 flex-1 flex-col">
          <Suspense fallback={<TopbarFallback />}>
            <Topbar onOpenMenu={() => setMenuOpen(true)} />
          </Suspense>
          <div id="main" className="flex-1 pb-14 md:pb-0">
            {children}
          </div>
        </div>
      </div>
      <Suspense fallback={<div className="fixed inset-x-0 bottom-0 z-30 h-14 border-t border-border bg-surface-raised md:hidden" />}>
        <MobileBottomNav className="fixed inset-x-0 bottom-0 z-30 md:hidden" />
      </Suspense>
      <Suspense fallback={null}>
        <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
      </Suspense>
    </CommandPaletteRoot>
  );
}

function SidebarFallback() {
  return (
    <div className="sticky top-0 hidden h-svh w-[264px] shrink-0 border-r border-border bg-surface-raised md:block" />
  );
}

function TopbarFallback() {
  return <div className="sticky top-0 z-30 h-16 border-b border-border bg-surface-raised" />;
}
