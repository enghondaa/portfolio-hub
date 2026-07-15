"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const WORDS = ["Web3.", "EdTech.", "crypto.", "dashboards."];

/** Cycles through a short list of words with a quick fade + slide, forever. Freezes on the first word under prefers-reduced-motion. */
export function RotatingWord() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 2200);
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  return (
    <span className="inline-block min-w-[3ch] text-[var(--color-accent)]" style={{ display: "inline-grid" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={shouldReduceMotion ? "static" : index}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: "easeOut" }}
          style={{ gridArea: "1 / 1" }}
        >
          {WORDS[shouldReduceMotion ? 0 : index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
