import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <main className="relative isolate flex min-h-svh flex-1 items-center justify-center overflow-hidden px-4 py-10 min-[480px]:px-6 sm:py-16">
      <div className="login-orb pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-brand/20 blur-3xl dark:bg-brand/25" />
      <div className="login-orb login-orb-delay pointer-events-none absolute -right-10 bottom-0 size-80 rounded-full bg-chart-3/25 blur-3xl dark:bg-chart-3/20" />
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
