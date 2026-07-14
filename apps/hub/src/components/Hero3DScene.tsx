"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Plane {
  className: string;
  size: string;
  top: string;
  left: string;
  tone: "accent" | "neutral";
  depth: number;
}

const planes: Plane[] = [
  { className: "hero-plane-1", size: "9rem", top: "4%", left: "10%", tone: "accent", depth: 1 },
  { className: "hero-plane-2", size: "6.5rem", top: "52%", left: "68%", tone: "neutral", depth: 0.6 },
  { className: "hero-plane-3", size: "5rem", top: "70%", left: "8%", tone: "neutral", depth: 0.8 },
  { className: "hero-plane-4", size: "7.5rem", top: "12%", left: "62%", tone: "accent", depth: 0.5 },
];

/**
 * Decorative 3D-ish composition behind the hero stat column: a handful of
 * flat planes, each looping through its own slow CSS keyframe rotation/drift
 * (20-30s, GPU-composited, no JS animation loop), plus a subtle whole-scene
 * parallax that follows the cursor (max ~14px shift). Pure CSS 3D transforms
 * rather than react-three-fiber/three.js, on purpose, to keep this chunk
 * tiny — it's loaded via next/dynamic(ssr:false) so it never blocks the
 * hero's first paint. Renders nothing on small viewports or under
 * prefers-reduced-motion.
 */
export function Hero3DScene() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isSmallViewport, setIsSmallViewport] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsSmallViewport(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || isSmallViewport) return;
    function handleMouseMove(event: MouseEvent) {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      setParallax({ x: nx * 14, y: ny * 14 });
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shouldReduceMotion, isSmallViewport]);

  // Static fallback: on mobile / small viewports we skip the composition
  // entirely rather than paying the layout + paint cost for something this
  // decorative.
  if (isSmallViewport) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block"
      style={{ perspective: 1200 }}
    >
      <motion.div
        animate={{ x: parallax.x, y: parallax.y }}
        transition={{ type: "spring", stiffness: 60, damping: 20, mass: 0.6 }}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {planes.map((plane, i) => (
          <div
            key={i}
            className={shouldReduceMotion ? "absolute rounded-md" : `absolute rounded-md ${plane.className}`}
            style={{
              width: plane.size,
              height: plane.size,
              top: plane.top,
              left: plane.left,
              opacity: plane.depth * 0.5,
              background:
                plane.tone === "accent"
                  ? "linear-gradient(135deg, var(--color-accent), transparent)"
                  : "linear-gradient(135deg, var(--color-neutral-400), transparent)",
              transformStyle: "preserve-3d",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
