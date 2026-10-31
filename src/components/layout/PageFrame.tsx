"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { fadeRise, pageClass, useSafeVariants } from "@/lib/page-motion";

type PageFrameProps = {
  children: ReactNode;
  className?: string;
};

export function PageFrame({ children, className }: PageFrameProps) {
  const pathname = usePathname();
  const variants = useSafeVariants(fadeRise);

  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="hidden"
      animate="visible"
      className={className ?? pageClass}
    >
      {children}
    </motion.div>
  );
}
