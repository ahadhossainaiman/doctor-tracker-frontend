"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { fadeRise, stagger, useSafeVariants } from "@/lib/motion";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  heading?: "h1" | "h2";
};

export function PageHeader({
  title,
  description,
  actions,
  heading = "h1",
}: PageHeaderProps) {
  const Heading = heading;
  const group = useSafeVariants(stagger);
  const item = useSafeVariants(fadeRise);

  return (
    <motion.header
      variants={group}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-end min-[480px]:justify-between"
    >
      <motion.div variants={item} className="min-w-0 space-y-1">
        <Heading className="text-xl font-semibold tracking-tight text-text sm:text-2xl xl:text-[1.75rem]">
          {title}
        </Heading>
        {description ? (
          <p className="max-w-2xl text-sm text-text-muted xl:text-base">{description}</p>
        ) : null}
      </motion.div>
      {actions ? (
        <motion.div variants={item} className="flex flex-wrap items-center gap-2">
          {actions}
        </motion.div>
      ) : null}
    </motion.header>
  );
}
