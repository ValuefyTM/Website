import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// "/" allows both the Romanian site and the English one under /en.
// The client portal (both languages), the API and the admin panel stay out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/", "/en"], disallow: ["/api/", "/client", "/en/client", "/admin"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
