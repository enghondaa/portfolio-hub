"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

interface MagneticLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/** A link that leans gently toward the cursor on hover. Disabled entirely under prefers-reduced-motion. */
export function MagneticLink({ href, className, children }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    setOffset({ x: relX * 0.25, y: relY * 0.35 });
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 });
  }

  return (
    <motion.div
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.4 }}
      className="inline-block"
    >
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
      </Link>
    </motion.div>
  );
}
