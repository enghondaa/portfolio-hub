"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A gold rule across the top of an article that tracks scroll position. Purely decorative, so it's hidden from assistive tech. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="read-progress fixed inset-x-0 top-0 z-50 h-[2px] bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)]"
    />
  );
}
