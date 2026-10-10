import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root (a stray lockfile in a parent folder can confuse Turbopack).
  turbopack: { root: process.cwd() },
  images: {
    // Sanity's image CDN — used once products come from the CMS.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
};

export default nextConfig;
