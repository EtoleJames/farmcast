// next-pwa wraps the Next.js config and injects a service worker
// automatically during production builds. In development it is disabled
// so hot reload is not affected.

import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",           // service worker files go into /public
  register: true,           // auto-register the service worker
  skipWaiting: true,        // activate new SW immediately on update
  disable: process.env.NODE_ENV === "development", // off in dev
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig: NextConfig = {
  // No extra config needed — next-pwa handles the rest
};

export default withPWA(nextConfig);
