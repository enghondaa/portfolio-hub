"use client";

import { motion, useReducedMotion } from "framer-motion";

/** A hairline rule that draws itself in from left to right once it scrolls into view. */
export function Divider({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay, ease: "easeOut" }}
      className={`h-px w-full origin-left bg-[var(--color-neutral-200)] ${className}`}
    />
  );
}
