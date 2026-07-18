import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How this was built",
  description: "How the zero-code-change MDX publishing model behind this demo works.",
  alternates: { canonical: "/how-this-was-built" },
};

export default function HowThisWasBuiltPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-6 sm:py-24">
      <Link href="/" className="font-mono text-xs text-[var(--color-neutral-600)] hover:text-[var(--color-accent)]">
        ← All notes
      </Link>

      <h1 className="mt-8 font-[family-name:var(--font-heading)] text-[clamp(34px,5.6vw,58px)] font-semibold italic leading-[1.02] tracking-[-0.03em] text-[var(--color-neutral-800)]">
        How this was built
      </h1>

      <div className="prose-article mt-8">
        <p>
          Every article on this site is a single <code>.mdx</code> file in{" "}
          <code>content/articles/</code>, with a small YAML frontmatter block
          at the top:
        </p>
        <pre>{`---
title: "Your title"
date: "2026-07-15"
tags: ["Next.js", "Debugging"]
excerpt: "One sentence for the list view."
---

Your article body, in Markdown + JSX.`}</pre>
        <p>
          A small loader (<code>lib/articles.ts</code>) reads every file in
          that folder with <code>gray-matter</code>, computes a reading-time
          estimate, and sorts by date. Nothing in that file names any
          individual article — it just reads whatever is in the directory.
          Add a new <code>.mdx</code> file and rebuild; it shows up in the
          list, on the RSS feed, and in the sitemap, with zero code changes.
        </p>
        <h2>Rendering</h2>
        <p>
          Article bodies render through{" "}
          <code>next-mdx-remote/rsc</code> as an async Server Component, with{" "}
          <code>remark-gfm</code> for tables and strikethrough, and{" "}
          <code>rehype-pretty-code</code> (backed by Shiki) for the syntax
          highlighting on code blocks.
        </p>
        <h2>What&apos;s real here</h2>
        <p>
          The three articles published so far aren&apos;t filler — they&apos;re
          written from actual bugs hit while building this monorepo: a
          Tailwind v4 content-detection gap, a Next.js 16 breaking change in
          how <code>params</code> works, and the reduced-motion animation
          pattern used across every app in this project.
        </p>
      </div>
    </div>
  );
}
