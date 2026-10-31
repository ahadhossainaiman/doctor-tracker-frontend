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
      className="h-11 w-11 px-0 md:w-auto md:px-4"
      aria-label="Toggle color theme"
      onClick={() => setTheme(nextTheme)}
    >
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
      <span className="hidden md:inline">Theme</span>
    </Button>
  );
}
