import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Served as-is: Unsplash URLs already request the right width and a modern format (auto=format),
    // which avoids needing the paid Cloudflare Images binding for Next.js image optimization.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  // Keep preview hosts (e.g. website.<account>.workers.dev) out of search results —
  // only the real domain should be indexed.
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.*\\.workers\\.dev)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
