import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

const siteUrl = "https://mohand-cms-demo.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles().map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: article.date,
  }));

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/how-this-was-built`, lastModified: new Date() },
    ...articles,
  ];
}
