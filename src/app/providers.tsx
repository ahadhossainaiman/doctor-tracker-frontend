"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

import { redirectToLogin, setUnauthorizedHandler } from "@/lib/apiClient";
import { createQueryClient } from "@/lib/queryClient";

function AppToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="top-right"
      closeButton
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      queryClient.clear();
      redirectToLogin({ expired: true });
    });
    return () => setUnauthorizedHandler(null);
  }, [queryClient]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <AppToaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
