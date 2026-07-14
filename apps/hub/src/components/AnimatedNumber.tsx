"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Renders a stat value like "10,000+" and counts the numeric portion up
 * from 0 the first time it scrolls into view, keeping any prefix/suffix
 * (commas, "+", "%") intact. Snaps straight to the final value under
 * prefers-reduced-motion.
 */
export function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(shouldReduceMotion ? value : formatWith(value, 0));

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setDisplay(value);
      return;
    }

    const parsed = extractNumber(value);
    if (parsed === null) {
      setDisplay(value);
      return;
    }
    const target: number = parsed;

    const duration = 1200;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(formatWith(value, current));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, shouldReduceMotion, value]);

  return <span ref={ref}>{display}</span>;
}

function extractNumber(value: string): number | null {
  const match = value.replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : null;
}

function formatWith(value: string, current: number): string {
  const match = value.match(/^(\D*)([\d,]+)(\D*)$/);
  if (!match) return value;
  const [, prefix, , suffix] = match;
  return `${prefix}${current.toLocaleString("en-US")}${suffix}`;
}
