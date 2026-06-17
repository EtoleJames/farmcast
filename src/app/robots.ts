// This tells search engine crawlers to index the whole site
// and where to find the sitemap.

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/", // No need to index API routes
    },
    sitemap: "https://farmcast.vercel.app/sitemap.xml",
  };
}
