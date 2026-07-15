import { Feed } from "feed";
import { getAllArticles } from "@/lib/articles";

const siteUrl = "https://mohand-cms-demo.vercel.app";

export function GET() {
  const feed = new Feed({
    title: "Notes — Mohand Elshahawy",
    description: "Field notes from building this portfolio's monorepo.",
    id: siteUrl,
    link: siteUrl,
    language: "en",
    copyright: `All rights reserved ${new Date().getFullYear()}, Mohand Elshahawy`,
    feedLinks: { rss: `${siteUrl}/rss.xml` },
  });

  for (const article of getAllArticles()) {
    feed.addItem({
      title: article.title,
      id: `${siteUrl}/articles/${article.slug}`,
      link: `${siteUrl}/articles/${article.slug}`,
      description: article.excerpt,
      date: new Date(article.date),
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
