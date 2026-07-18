"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export interface ArticleRowProps {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
  index: number;
}

/** An article row that reveals on scroll, with a rule that draws itself in and a number that fills on hover. */
export function ArticleRow({ slug, title, date, excerpt, tags, readingTime, index }: ArticleRowProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.6,
        delay: shouldReduceMotion ? 0 : index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: shouldReduceMotion ? 0.2 : 0.85,
          delay: shouldReduceMotion ? 0 : index * 0.08 + 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="block h-px origin-left bg-[var(--color-neutral-200)]"
      />

      <Link href={`/articles/${slug}`} className="block py-9">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[11px] tabular-nums text-[var(--color-neutral-400)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] text-[var(--color-neutral-400)]">
              <time dateTime={date}>
                {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </time>
              <span aria-hidden="true">·</span>
              <span>{readingTime}</span>
            </div>

            <h2 className="mt-2.5 font-[family-name:var(--font-heading)] text-[clamp(24px,3.2vw,34px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-neutral-800)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
              {title}
            </h2>

            <p className="mt-3 max-w-xl leading-relaxed text-[var(--color-neutral-600)]">{excerpt}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--color-neutral-200)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-neutral-600)]"
                >
                  {tag}
                </span>
              ))}
              <span className="ml-1 font-mono text-[11px] text-[var(--color-accent)] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                Read →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
