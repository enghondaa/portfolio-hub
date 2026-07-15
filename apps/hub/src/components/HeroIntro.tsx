"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { HeroStats } from "@/components/HeroStats";

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

/** Staggers the hero's kicker/heading/paragraph/CTAs in on first load, with a subtle scroll parallax between the text column and the stat column. */
export function HeroIntro({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const item = useItem(shouldReduceMotion);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -12]);
  const statsY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 12]);

  return (
    <div ref={sectionRef} className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-8">
      <motion.div initial="hidden" animate="visible" variants={container} style={{ y: textY }} className="lg:col-span-8">
        <motion.p
          variants={item}
          className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)]"
        >
          Full-Stack Developer
        </motion.p>
        <motion.h1
          variants={item}
          className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold leading-[1.05] tracking-tight text-[var(--color-neutral-800)] sm:text-6xl lg:text-7xl"
        >
          Mohand Elshahawy
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-neutral-600)]"
        >
          Five years building React and Next.js products for teams in Web3,
          crypto, and EdTech. Every finished project below links to live,
          deployed code.
        </motion.p>
        <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-4">
          {children}
        </motion.div>
        <motion.p variants={item} className="mt-4 flex items-center gap-2 font-mono text-xs text-[var(--color-neutral-400)]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          Available for freelance projects. I reply within a day.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.55, delay: 0.3, ease: "easeOut" }}
        style={{ y: statsY }}
        className="lg:col-span-4 lg:justify-self-end"
      >
        <HeroStats />
      </motion.div>
    </div>
  );
}
