import { Request, Response } from "express";

export const generateRobots = (_req: Request, res: Response) => {
  const baseUrl =
    process.env.FRONTEND_URL || "https://assignflowhub.karanart.com";

  const robots = `
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
  `;

  res.header("Content-Type", "text/plain");
  res.send(robots);
};