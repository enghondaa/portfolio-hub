import Link from "next/link";
import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { ArticleRow } from "@/components/ArticleRow";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-24">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent)]">/ notes</p>
      </Reveal>

      <Reveal delay={0.06}>
        <h1 className="mt-6 font-[family-name:var(--font-heading)] text-[clamp(44px,8vw,88px)] font-semibold italic leading-[0.94] tracking-[-0.035em] text-[var(--color-neutral-800)]">
          Field notes
          <span className="block not-italic text-[var(--color-neutral-400)]">from the build.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-[var(--color-neutral-600)]">
          Real bugs and real fixes, written from this exact monorepo. Drop a new{" "}
          <code className="rounded bg-[var(--color-accent-soft)] px-1.5 py-0.5 font-mono text-sm text-[var(--color-accent)]">
            .mdx
          </code>{" "}
          file into{" "}
          <code className="rounded bg-[var(--color-accent-soft)] px-1.5 py-0.5 font-mono text-sm text-[var(--color-accent)]">
            content/articles
          </code>{" "}
          and it appears here on the next build, with no code changes.{" "}
          <Link
            href="/how-this-was-built"
            className="text-[var(--color-accent)] underline decoration-[var(--color-accent)]/35 underline-offset-4 transition-colors hover:decoration-[var(--color-accent)]"
          >
            How that works →
          </Link>
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-neutral-400)]">
          {articles.length} {articles.length === 1 ? "note" : "notes"}
        </p>
      </Reveal>

      <div className="mt-4">
        {articles.map((article, i) => (
          <ArticleRow
            key={article.slug}
            index={i}
            slug={article.slug}
            title={article.title}
            date={article.date}
            excerpt={article.excerpt}
            tags={article.tags}
            readingTime={article.readingTime}
          />
        ))}
      </div>
    </div>
  );
}
