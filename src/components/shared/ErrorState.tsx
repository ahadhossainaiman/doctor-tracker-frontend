"use client";

import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { fadeRise, useSafeVariants } from "@/lib/motion";

type ErrorStateProps = {
  title: string;
  description: string;
  onRetry: () => void;
};

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  const variants = useSafeVariants(fadeRise);

  return (
    <motion.div
      role="alert"
      variants={variants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-start gap-3 rounded-card border border-border bg-surface-raised px-5 py-8 sm:px-6 sm:py-10"
    >
      <h2 className="text-lg font-semibold text-text sm:text-xl">{title}</h2>
      <p className="max-w-md text-sm text-text-muted">{description}</p>
      <Button type="button" className="h-11 px-4" onClick={onRetry}>
        Retry
      </Button>
    </motion.div>
  );
}
