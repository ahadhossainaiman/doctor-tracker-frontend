"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { authErrorMessage, useLogin } from "@/features/auth/hooks";
import { loginSchema, type LoginInput } from "@/features/auth/schema";
import { fadeScale, useSafeVariants } from "@/lib/motion";

export function LoginForm() {
  const searchParams = useSearchParams();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const sessionExpired = searchParams.get("session") === "expired";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const serverError = login.error ? authErrorMessage(login.error) : null;
  const variants = useSafeVariants(fadeScale);

  return (
    <motion.form
      variants={variants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md rounded-card border border-border bg-surface-raised/90 p-5 shadow-overlay backdrop-blur-xl min-[480px]:p-6 sm:p-8"
      onSubmit={handleSubmit((values) => login.submit(values, searchParams.get("next")))}
      noValidate
    >
      <h1 className="text-2xl font-semibold tracking-tight text-text">Sign in</h1>
      <p className="mt-2 text-sm text-text-muted">
        Admin access for doctors, patients, and the dashboard.
      </p>

      {sessionExpired ? (
        <p className="mt-4 text-sm text-text-muted" role="status">
          Your session expired. Sign in again.
        </p>
      ) : null}

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-text">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            className="h-11 w-full rounded-lg border border-input bg-surface px-3 text-sm text-text outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p id="email-error" className="text-sm text-danger-text">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-text">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className="h-11 w-full rounded-lg border border-input bg-surface px-3 pr-14 text-sm text-text outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            <button
              type="button"
              className="absolute top-0 right-0 inline-flex size-11 items-center justify-center rounded-lg text-text-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password ? (
            <p id="password-error" className="text-sm text-danger-text">
              {errors.password.message}
            </p>
          ) : null}
        </div>
      </div>

      {serverError ? (
        <p className="mt-4 text-sm text-danger-text" role="alert">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" className="mt-6 h-11 w-full" disabled={login.isPending}>
        {login.isPending ? "Signing in" : "Sign in"}
      </Button>
    </motion.form>
  );
}
