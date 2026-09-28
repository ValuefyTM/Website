import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getDb } from "@/lib/db";
import { listPublished } from "@/lib/listings-db";

// Public pages to index. Add each new landing page here.
const PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/evaluare-pentru-impozitare", priority: 0.8 },
  { path: "/evaluare-bunuri-mobile", priority: 0.8 },
  { path: "/imobiliare", priority: 0.7 },
];

// Includes published listings, so it is generated on request.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = PAGES.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
  try {
    const db = await getDb();
    const listings = db ? await listPublished(db) : [];
    for (const l of listings) {
      pages.push({ url: `${site.url}/imobiliare/${l.slug}`, lastModified: l.updatedAt, changeFrequency: "weekly", priority: 0.6 });
    }
  } catch (error) {
    console.error("[sitemap] listings unavailable", error);
  }
  return pages;
}
