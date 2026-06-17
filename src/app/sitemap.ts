// sitemap.ts is a Next.js route handler that generates /sitemap.xml.
// Search engine crawlers fetch this to understand the site structure.
// Next.js calls this at build time and serves the result as XML.

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://farmcast-zeta.vercel.app",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
