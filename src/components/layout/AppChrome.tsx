"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Topbar } from "@/components/layout/Topbar";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/login" ? null : <Topbar />}
      {children}
    </>
  );
}
