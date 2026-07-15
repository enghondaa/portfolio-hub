"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Renders a stat value like "10,000+" or "99.8%" and counts the numeric
 * portion up from 0 the first time it scrolls into view, keeping any
 * prefix/suffix (commas, "+", "%") and decimal precision intact. Snaps
 * straight to the final value under prefers-reduced-motion.
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
      const current = eased * target;
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
  const match = value.match(/\d[\d,]*(\.\d+)?/);
  return match ? Number(match[0].replace(/,/g, "")) : null;
}

function decimalPlaces(value: string): number {
  const match = value.match(/\.(\d+)/);
  return match && match[1] ? match[1].length : 0;
}

function formatWith(value: string, current: number): string {
  const match = value.match(/^(\D*)([\d,]*\.?\d+)(\D*)$/);
  if (!match) return value;
  const prefix = match[1] ?? "";
  const suffix = match[3] ?? "";
  const decimals = decimalPlaces(value);
  const formatted = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString("en-US");
  return `${prefix}${formatted}${suffix}`;
}
