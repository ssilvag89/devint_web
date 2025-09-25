import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString() || "https://devint.cl";

  const [services, posts] = await Promise.all([
    getCollection("services"),
    getCollection("blog"),
  ]);

  const staticPages = [
    {
      loc: baseUrl,
      changefreq: "weekly",
      priority: "1.0",
      lastmod: new Date(),
    },
    ...["servicios", "nosotros", "blog", "contacto"].map((path) => ({
      loc: `${baseUrl}/${path}`,
      changefreq: "monthly",
      priority: "0.8",
      lastmod: new Date(),
    })),
  ];

  const serviceUrls = services.map(({ slug, data }) => ({
    loc: `${baseUrl}/servicios/${slug}`,
    changefreq: "quarterly",
    priority: "0.7",
    lastmod: data.updatedDate ?? data.publishDate ?? new Date(),
  }));

  const blogUrls = posts.map(({ slug, data }) => ({
    loc: `${baseUrl}/blog/${slug}`,
    changefreq: "monthly",
    priority: data.featured ? "0.8" : "0.6",
    lastmod: data.updatedDate ?? data.publishDate,
  }));

  const urls = [...staticPages, ...serviceUrls, ...blogUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((entry) => {
    return `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod.toISOString().split("T")[0]}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=3600",
    },
  });
};
