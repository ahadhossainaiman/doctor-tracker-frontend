"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, Eye, EyeOff, Stethoscope } from "lucide-react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { authErrorMessage, useLogin } from "@/features/auth/hooks";
import { loginSchema, type LoginInput } from "@/features/auth/schema";
import { fadeRise, stagger, useSafeVariants } from "@/lib/motion";

const inputClass =
  "h-11 w-full rounded-lg border border-input bg-surface px-3 text-sm text-text shadow-[inset_0_1px_0_oklch(1_0_0/0.35)] outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-ring/50 dark:shadow-[inset_0_1px_0_oklch(1_0_0/0.06)]";

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
  const group = useSafeVariants(stagger);
  const item = useSafeVariants(fadeRise);

  return (
    <motion.div
      variants={group}
      initial="hidden"
      animate="visible"
      className="relative z-10 grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16"
    >
      <motion.section variants={item} className="max-w-lg">
        <div className="mb-4 flex items-center gap-3">
          <span className="login-mark relative inline-flex size-12 items-center justify-center rounded-2xl bg-brand text-sm font-semibold text-brand-foreground shadow-overlay">
            DT
          </span>
          <p className="text-sm font-medium tracking-wide text-text-muted uppercase">Doctor Tracker</p>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          Clinic records, in one calm view.
        </h1>
        <p className="mt-3 max-w-md text-sm text-text-muted sm:text-base">
          Sign in to manage doctors, patients, and the live dashboard.
        </p>
        <ul className="mt-6 hidden gap-3 text-sm text-text-muted sm:grid">
          <li className="flex items-center gap-2">
            <Stethoscope className="size-4 text-brand" aria-hidden="true" />
            Doctors, patients, and assignments
          </li>
          <li className="flex items-center gap-2">
            <Activity className="size-4 text-brand" aria-hidden="true" />
            Charts that stay in step with the lists
          </li>
        </ul>
      </motion.section>

      <motion.form
        variants={item}
        className="panel login-card w-full rounded-sheet p-5 min-[480px]:p-6 sm:p-8"
        onSubmit={handleSubmit((values) => login.submit(values, searchParams.get("next")))}
        noValidate
      >
        <motion.div variants={group} initial="hidden" animate="visible" className="grid gap-0">
        <motion.div variants={item}>
          <h2 className="text-xl font-semibold tracking-tight text-text">Sign in</h2>
          <p className="mt-1 text-sm text-text-muted">Use the seeded admin account.</p>
        </motion.div>

        {sessionExpired ? (
          <motion.p className="mt-4 text-sm text-text-muted" role="status" variants={item}>
            Your session expired. Sign in again.
          </motion.p>
        ) : null}

        <motion.div className="mt-6 space-y-2" variants={item}>
            <label htmlFor="email" className="text-sm font-medium text-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              className={inputClass}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email ? (
              <p id="email-error" className="text-sm text-danger-text">
                {errors.email.message}
              </p>
            ) : null}
        </motion.div>

        <motion.div className="mt-4 space-y-2" variants={item}>
            <label htmlFor="password" className="text-sm font-medium text-text">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`${inputClass} pr-14`}
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
        </motion.div>

        {serverError ? (
          <p className="mt-4 text-sm text-danger-text" role="alert">
            {serverError}
          </p>
        ) : null}

        <motion.div variants={item}>
          <Button type="submit" className="mt-6 h-11 w-full" disabled={login.isPending}>
            {login.isPending ? "Signing in" : "Sign in"}
          </Button>
        </motion.div>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
