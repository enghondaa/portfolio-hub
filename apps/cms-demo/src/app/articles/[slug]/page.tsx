import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllArticles, getArticle } from "@/lib/articles";
import { ReadingProgress } from "@/components/ReadingProgress";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
    },
  };
}

const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }] as never],
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: { "@type": "Person", name: "Mohand Elshahawy" },
  };

  return (
    <>
      <ReadingProgress />

      <article className="mx-auto max-w-2xl px-5 py-14 sm:px-6 sm:py-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)]"
        >
          ← All notes
        </Link>

        <div className="mt-10 flex items-center gap-3 font-mono text-[11px] text-[var(--color-neutral-400)]">
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </time>
          <span aria-hidden="true">·</span>
          <span>{article.readingTime}</span>
        </div>

        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-[clamp(34px,5.6vw,58px)] font-semibold italic leading-[1.02] tracking-[-0.03em] text-[var(--color-neutral-800)]">
          {article.title}
        </h1>

        <p className="mt-5 text-[17px] leading-relaxed text-[var(--color-neutral-600)]">{article.excerpt}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-neutral-200)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-neutral-600)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="mt-10 h-px bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-neutral-200)] to-transparent"
        />

        <div className="prose-article mt-10">
          <MDXRemote source={article.content} options={{ mdxOptions }} />
        </div>
      </article>
    </>
  );
}
