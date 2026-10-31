"use client";

import { useReducedMotion, type Transition, type Variants } from "motion/react";

export const easeOut = [0.22, 1, 0.36, 1] as const;

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
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: enterTransition },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

export const sheet: Variants = {
  hidden: { opacity: 0, y: 16 },
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
