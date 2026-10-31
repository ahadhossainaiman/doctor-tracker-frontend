import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center px-4 py-16">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
