import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Served as-is: Unsplash URLs already request the right width and a modern format (auto=format),
    // which avoids needing the paid Cloudflare Images binding for Next.js image optimization.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
