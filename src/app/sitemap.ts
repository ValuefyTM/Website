import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getDb } from "@/lib/db";
import { listPublished } from "@/lib/listings-db";
import { localize } from "@/i18n/lang";

// Public pages to index, by their Romanian path. Add each new landing page here;
// the English URL is derived with `localize`.
const PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/evaluare-pentru-impozitare", priority: 0.8 },
  { path: "/evaluare-bunuri-mobile", priority: 0.8 },
  { path: "/imobiliare", priority: 0.7 },
];

// Includes published listings, so it is generated on request.
export const dynamic = "force-dynamic";

type Entry = MetadataRoute.Sitemap[number];

/** One entry per language, each listing both language versions as alternates. */
function both(roPath: string, rest: Omit<Entry, "url" | "alternates">): MetadataRoute.Sitemap {
  const ro = `${site.url}${roPath}`;
  const en = `${site.url}${localize("en", roPath)}`;
  const alternates = { languages: { ro, en } };
  return [
    { url: ro, ...rest, alternates },
    { url: en, ...rest, alternates },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = PAGES.flatMap(({ path, priority }) =>
    both(path, { changeFrequency: "monthly", priority }),
  );
  try {
    const db = await getDb();
    const listings = db ? await listPublished(db) : [];
    for (const l of listings) {
      pages.push(...both(`/imobiliare/${l.slug}`, { lastModified: l.updatedAt, changeFrequency: "weekly", priority: 0.6 }));
    }
  } catch (error) {
    console.error("[sitemap] listings unavailable", error);
  }
  return pages;
}
