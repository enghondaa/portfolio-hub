import Link from "next/link";
import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-0 sm:py-20">
      <p className="font-mono text-xs text-[var(--color-accent)]">/ notes</p>
      <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold italic tracking-tight text-[var(--color-neutral-800)] sm:text-5xl">
        Field notes from building this site.
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--color-neutral-600)]">
        Real bugs, real fixes, written from this exact monorepo. Drop a new{" "}
        <code className="rounded bg-[var(--color-accent-soft)] px-1.5 py-0.5 font-mono text-sm text-[var(--color-accent)]">
          .mdx
        </code>{" "}
        file into <code className="rounded bg-[var(--color-accent-soft)] px-1.5 py-0.5 font-mono text-sm text-[var(--color-accent)]">content/articles</code> and it shows up here on the next
        build — no code changes.{" "}
        <Link href="/how-this-was-built" className="text-[var(--color-accent)] underline underline-offset-2">
          How this works →
        </Link>
      </p>

      <div className="mt-12 flex flex-col divide-y divide-[var(--color-neutral-200)]">
        {articles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="group py-7">
            <div className="flex items-center gap-3 font-mono text-xs text-[var(--color-neutral-400)]">
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </time>
              <span aria-hidden="true">·</span>
              <span>{article.readingTime}</span>
            </div>
            <h2 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--color-neutral-800)] transition-colors group-hover:text-[var(--color-accent)]">
              {article.title}
            </h2>
            <p className="mt-2 leading-relaxed text-[var(--color-neutral-600)]">{article.excerpt}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[var(--color-neutral-100)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-neutral-600)]">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
