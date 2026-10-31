"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { fadeRise, useSafeVariants } from "@/lib/motion";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  const variants = useSafeVariants(fadeRise);

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-start gap-3 rounded-card border border-dashed border-border bg-surface-raised px-5 py-8 sm:px-6 sm:py-10"
    >
      <h2 className="text-lg font-semibold text-text sm:text-xl">{title}</h2>
      <p className="max-w-md text-sm text-text-muted">{description}</p>
      {action}
    </motion.div>
  );
}
