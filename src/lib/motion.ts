"use client";

import { useReducedMotion, type Transition, type Variants } from "motion/react";

export const easeOut = [0.22, 1, 0.36, 1] as const;
export const springSoft = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;

export const motionDuration = {
  fast: 0.15,
  base: 0.2,
  slow: 0.25,
} as const;

export const enterTransition: Transition = {
  duration: motionDuration.base,
  ease: easeOut,
};

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: enterTransition },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: enterTransition },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: enterTransition },
};

export const sheet: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDuration.slow, ease: easeOut },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0 } },
};

export function useSafeVariants(variants: Variants) {
  const reduced = useReducedMotion();
  return reduced ? reducedVariants : variants;
}
