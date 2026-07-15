import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllArticles, getArticle } from "@/lib/articles";

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
    <article className="mx-auto max-w-2xl px-5 py-14 sm:px-0 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/" className="font-mono text-xs text-[var(--color-neutral-600)] hover:text-[var(--color-accent)]">
        ← All notes
      </Link>

      <div className="mt-6 flex items-center gap-3 font-mono text-xs text-[var(--color-neutral-400)]">
        <time dateTime={article.date}>
          {new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </time>
        <span aria-hidden="true">·</span>
        <span>{article.readingTime}</span>
      </div>

      <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold italic tracking-tight text-[var(--color-neutral-800)] sm:text-4xl">
        {article.title}
      </h1>

      <div className="mt-3 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-[var(--color-neutral-100)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-neutral-600)]">
            {tag}
          </span>
        ))}
      </div>

      <div className="prose-article mt-10">
        <MDXRemote source={article.content} options={{ mdxOptions }} />
      </div>
    </article>
  );
}
