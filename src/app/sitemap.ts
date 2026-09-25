import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// Public pages to index. Add each new landing page here.
const PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/evaluare-pentru-impozitare", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
