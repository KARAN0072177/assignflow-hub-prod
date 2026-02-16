import { Request, Response } from "express";
import { Blog } from "../../models/blog.model";

export const generateSitemap = async (_req: Request, res: Response) => {
  try {
    const baseUrl =
      process.env.FRONTEND_URL || "https://assignflowhub.karanart.com";

    // Static routes
    const staticRoutes = [
      "",
      "/blog",
      "/contact",
      "/help",
      "/privacy",
      "/terms",
      "/cookies",
      "/accessibility",
      "/login",
      "/register",
    ];

    // Fetch published blogs
    const blogs = await Blog.find({ isPublished: true })
      .select("slug updatedAt")
      .lean();

    const blogRoutes = blogs.map(
      (blog) => `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${new Date(blog.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    );

    const staticUrls = staticRoutes.map(
      (route) => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join("")}
${blogRoutes.join("")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    res.status(500).send("Error generating sitemap");
  }
};