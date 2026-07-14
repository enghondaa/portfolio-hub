"use client";

import { useRef, useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export interface ProjectRowProps {
  index: number;
  href: string;
  title: string;
  tagline: string;
  stack: string[];
  status: "live" | "in-progress";
  outcome?: string;
  external?: boolean;
}

/**
 * One row in the numbered project list. The whole row is the hit target;
 * on hover it shifts background and tilts a couple of degrees toward the
 * cursor (disabled under prefers-reduced-motion), the index number fills
 * from an outline to solid accent, its bottom rule draws itself in the
 * first time it scrolls into view, and the trailing arrow slides right.
 */
export function ProjectRow({ index, href, title, tagline, stack, status, outcome, external }: ProjectRowProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const shouldReduceMotion = useReducedMotion();
  const Arrow = external ? ArrowUpRight : ArrowRight;

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -4, ry: px * 4 });
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  const metaParts = [stack.join(" · "), outcome].filter(Boolean);

  return (
    <div className="relative" style={{ perspective: 800 }}>
      <motion.a
        ref={ref}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.5 }}
        style={{ transformStyle: "preserve-3d" }}
        className="group flex items-center justify-between gap-6 px-3 py-7 transition-colors duration-200 ease-out hover:bg-[var(--color-neutral-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] -mx-3"
      >
        <div className="flex items-baseline gap-5 sm:gap-8">
          <span className="project-index font-mono text-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--color-neutral-800)] transition-colors group-hover:text-[var(--color-accent)] sm:text-3xl">
              {title}
            </h3>
            <p className="mt-1 text-[var(--color-neutral-600)]">{tagline}</p>
            {metaParts.length > 0 && (
              <p className="mt-2 font-mono text-xs text-[var(--color-neutral-400)]">
                {metaParts.join(" — ")}
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <span
            className={
              status === "live"
                ? "hidden font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] sm:inline"
                : "hidden font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-400)] sm:inline"
            }
          >
            {status === "live" ? "Live" : "In progress"}
          </span>
          <Arrow
            aria-hidden="true"
            size={18}
            strokeWidth={1.75}
            className="text-[var(--color-neutral-400)] transition-transform duration-150 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
          />
        </div>
      </motion.a>
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[var(--color-neutral-200)]"
      />
    </div>
  );
}
