"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin accent line across the very top of the viewport, tracking scroll position. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40, mass: 0.2 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-[var(--color-accent)]"
      aria-hidden="true"
    />
  );
}
