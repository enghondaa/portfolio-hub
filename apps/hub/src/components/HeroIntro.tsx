"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

function useItem(reduced: boolean | null): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0.2 : 0.55, ease: "easeOut" } },
  };
}

/** Staggers the hero's kicker/heading/paragraph/CTAs in on first load. */
export function HeroIntro({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const item = useItem(shouldReduceMotion);

  return (
    <motion.div initial="hidden" animate="visible" variants={container}>
      <motion.p
        variants={item}
        className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)]"
      >
        Senior Front-End Engineer
      </motion.p>
      <motion.h1
        variants={item}
        className="mt-4 font-[family-name:var(--font-heading)] text-5xl font-semibold leading-[1.05] tracking-tight text-[var(--color-neutral-800)] sm:text-6xl"
      >
        Mohand Elshahawy
      </motion.h1>
      <motion.p
        variants={item}
        className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-neutral-600)]"
      >
        Five years building React and Next.js products for teams in Web3,
        crypto, and EdTech: cryptocurrency platforms that ran for 10,000+
        daily users, and the analytics dashboards 150+ schools use today.
        Everything below is live, not a mockup.
      </motion.p>
      <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
        {children}
      </motion.div>
    </motion.div>
  );
}
