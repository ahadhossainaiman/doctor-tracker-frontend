"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-11 px-0 xl:w-auto xl:px-4"
      aria-label="Toggle color theme"
      onClick={() => setTheme(nextTheme)}
    >
      <Sun className="hidden size-4 transition-transform duration-200 dark:block dark:rotate-0" />
      <Moon className="block size-4 transition-transform duration-200 dark:hidden" />
      <span className="hidden xl:inline">Theme</span>
    </Button>
  );
}
