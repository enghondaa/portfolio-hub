"use client";

import Link from "next/link";
import { useRef, useState, type MouseEvent, type ReactNode } from "react";

type Variant = "accent" | "dark" | "outline" | "outline-light";

interface PillButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  magnetic?: boolean;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  accent:
    "bg-[var(--color-accent)] text-[var(--color-neutral-800)] shadow-[0_12px_28px_-14px_rgba(224,138,44,0.7)]",
  dark: "bg-[var(--color-neutral-800)] text-[var(--color-neutral-0)]",
  outline: "border border-[color-mix(in_srgb,var(--color-neutral-800)_22%,transparent)] text-[var(--color-neutral-800)]",
  "outline-light": "border border-[rgba(247,241,232,0.3)] text-[var(--color-neutral-0)]",
};

/** Rounded pill CTA that leans gently toward the cursor on hover (plain CSS transform, respects prefers-reduced-motion). */
export function PillButton({ href, children, variant = "accent", external, magnetic = true, className = "" }: PillButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    if (!magnetic || !ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    setOffset({
      x: (event.clientX - (rect.left + rect.width / 2)) * 0.3,
      y: (event.clientY - (rect.top + rect.height / 2)) * 0.4,
    });
  }

  const classes = `inline-flex items-center whitespace-nowrap rounded-full px-6 py-[15px] font-mono text-sm font-medium transition-transform duration-150 ease-out ${variantClasses[variant]} ${className}`;
  const style = { transform: `translate(${offset.x}px, ${offset.y}px)` };

  if (external) {
    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setOffset({ x: 0, y: 0 })}
        style={style}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={style}
      className={classes}
    >
      {children}
    </Link>
  );
}
