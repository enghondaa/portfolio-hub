import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export interface ArticleFrontmatter {
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
}

export interface ArticleSummary extends ArticleFrontmatter {
  slug: string;
  readingTime: string;
}

export interface Article extends ArticleSummary {
  content: string;
}

function readArticleFile(filename: string): Article {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as ArticleFrontmatter;

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    tags: frontmatter.tags ?? [],
    excerpt: frontmatter.excerpt ?? "",
    readingTime: readingTime(content).text,
    content,
  };
}

/**
 * Every article that exists as a .mdx file in content/articles, newest
 * first. This is the "zero-code-change publishing" part of the demo: drop a
 * new .mdx file in that directory and it appears here on the next build —
 * nothing in this file has to change.
 */
export function getAllArticles(): ArticleSummary[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(readArticleFile)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((article): ArticleSummary => ({
      slug: article.slug,
      title: article.title,
      date: article.date,
      tags: article.tags,
      excerpt: article.excerpt,
      readingTime: article.readingTime,
    }));
}

export function getArticle(slug: string): Article | undefined {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;
  return readArticleFile(`${slug}.mdx`);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const article of getAllArticles()) {
    for (const tag of article.tags) tags.add(tag);
  }
  return Array.from(tags).sort();
}
