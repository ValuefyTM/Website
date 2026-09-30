// Listing types and formatting helpers — safe to import in client components.
import { numberLocale, type Lang } from "@/i18n/lang";
import { label } from "@/i18n/labels";

export const LISTING_TYPES = ["Apartament", "Casă", "Teren", "Spațiu comercial", "Hală / industrial"] as const;
export const LISTING_STATUSES = ["Nou", "Rezervat", "Preț redus"] as const;

export type Listing = {
  id: string;
  slug: string;
  title: string;
  type: string;
  city: string;
  zone: string;
  price: number; // EUR
  surface?: number;
  land?: number;
  rooms?: number;
  baths?: number;
  floor?: string;
  year?: number;
  status?: string;
  features: string[];
  description: string[]; // paragraphs
  report?: { date: string }; // YYYY-MM
  published: boolean;
  photos: string[]; // URLs
  photoIds: string[];
  updatedAt?: string;
  socialImage?: string; // 1200×630 share image URL, when generated
  /** English version of the text fields, when available (empty fields fall back to Romanian). */
  en?: { title?: string; description?: string[]; features?: string[] };
};

/** The listing with its text fields in the visitor's language (falls back to Romanian). */
export function inLang(l: Listing, lang: Lang): Listing {
  if (lang !== "en" || !l.en) return l;
  return {
    ...l,
    title: l.en.title?.trim() || l.title,
    description: l.en.description?.length ? l.en.description : l.description,
    features: l.en.features?.length ? l.en.features : l.features,
  };
}

export const photoUrl = (id: string) => `/api/photos/${id}`;
export const socialUrl = (id: string, version: string) => `/api/social/${id}?v=${encodeURIComponent(version)}`;

/** Every property is sold with no commission for the buyer. (Romanian; used by the admin.) */
export const COMMISSION_NOTE = "Comision 0%";

/** The "0% commission" note in the visitor's language. */
export const commissionNote = (lang: Lang = "ro") => (lang === "en" ? "0% commission" : COMMISSION_NOTE);

/** Floor as entered by the admin (Romanian, e.g. "2 din 4", "parter"), in the visitor's language. */
export function floorText(floor: string, lang: Lang = "ro") {
  if (lang !== "en") return floor;
  return floor
    .replace(/\bdin\b/gi, "of")
    .replace(/\bparter\b/gi, "ground floor")
    .replace(/\bdemisol\b/gi, "semi-basement")
    .replace(/\bsubsol\b/gi, "basement")
    .replace(/\bmansard[aă]/gi, "attic");
}

/** Short spec line, e.g. "3 camere · 74 m² · etaj 2 din 4" / "3 rooms · 74 m² · floor 2 of 4". */
export function specLine(l: Pick<Listing, "rooms" | "surface" | "land" | "floor">, lang: Lang = "ro") {
  const loc = numberLocale(lang);
  if (lang === "en") {
    const floor = l.floor ? floorText(l.floor, "en") : "";
    return [
      l.rooms ? `${l.rooms} ${l.rooms === 1 ? "room" : "rooms"}` : "",
      l.surface ? `${l.surface.toLocaleString(loc)} m²` : "",
      l.land ? `land ${l.land.toLocaleString(loc)} m²` : "",
      floor ? (/floor|basement|attic/i.test(floor) ? floor : `floor ${floor}`) : "",
    ].filter(Boolean).join(" · ");
  }
  return [
    l.rooms ? `${l.rooms} ${l.rooms === 1 ? "cameră" : "camere"}` : "",
    l.surface ? `${l.surface.toLocaleString("ro-RO")} m²` : "",
    l.land ? `teren ${l.land.toLocaleString("ro-RO")} m²` : "",
    l.floor ? `etaj ${l.floor}` : "",
  ].filter(Boolean).join(" · ");
}

/** Recommendation message for WhatsApp / SMS / email. Pass a listing already run through inLang() for English. */
export function shareMessage(l: Listing, url: string, lang: Lang = "ro") {
  const where = [l.zone, l.city].filter(Boolean).join(", ");
  const spec = specLine(l, lang);
  if (lang === "en") {
    return [
      `Hi! Here's a property I think you'd like:`,
      ``,
      `🏠 ${l.title}`,
      `📍 ${where}`,
      `💶 ${formatEur(l.price, "en")}${spec ? " · " + spec : ""}`,
      `✅ ${commissionNote("en")} — no commission to pay when you buy${l.report ? "\n📄 ANEVAR valuation report available" : ""}`,
      ``,
      url,
    ].join("\n");
  }
  return [
    `Salut! Uite o proprietate care cred că te-ar interesa:`,
    ``,
    `🏠 ${l.title}`,
    `📍 ${where}`,
    `💶 ${formatEur(l.price)}${spec ? " · " + spec : ""}`,
    `✅ ${COMMISSION_NOTE} — fără comision la cumpărare${l.report ? "\n📄 Are raport de evaluare ANEVAR" : ""}`,
    ``,
    url,
  ].join("\n");
}

/** Longer post for Facebook / Instagram / LinkedIn. Pass a listing already run through inLang() for English. */
export function socialPost(l: Listing, url: string, lang: Lang = "ro") {
  const where = [l.zone, l.city].filter(Boolean).join(", ");
  const tag = (s: string) => "#" + slugify(s).replace(/-/g, "");
  const spec = specLine(l, lang);
  if (lang === "en") {
    const type = label(l.type, "en");
    return [
      `${type} for sale · ${where}`,
      ``,
      `${l.title}`,
      `💶 ${formatEur(l.price, "en")}${spec ? " · " + spec : ""}`,
      ``,
      ...l.features.slice(0, 5).map((f) => `✓ ${f}`),
      ...(l.features.length ? [``] : []),
      `✅ ${commissionNote("en")} — you pay no commission when you buy.`,
      ...(l.report ? [`📄 The property has a valuation report prepared by an ANEVAR-authorised valuer.`] : []),
      ``,
      `Details and viewings: ${url}`,
      ``,
      [tag(type), tag(l.city), "#realestate", "#forsale", "#romania", "#valuefy"].join(" "),
    ].join("\n");
  }
  return [
    `${l.type} de vânzare · ${where}`,
    ``,
    `${l.title}`,
    `💶 ${formatEur(l.price)}${spec ? " · " + spec : ""}`,
    ``,
    ...l.features.slice(0, 5).map((f) => `✓ ${f}`),
    ...(l.features.length ? [``] : []),
    `✅ ${COMMISSION_NOTE} — nu plătești comision la cumpărare.`,
    ...(l.report ? [`📄 Proprietatea are raport de evaluare întocmit de evaluator autorizat ANEVAR.`] : []),
    ``,
    `Detalii și programare vizionare: ${url}`,
    ``,
    [tag(l.type), tag(l.city), "#imobiliare", "#devanzare", "#valuefy"].join(" "),
  ].join("\n");
}

/** "142.000 €" (ro) / "€142,000" (en). */
export const formatEur = (n: number, lang: Lang = "ro") =>
  lang === "en"
    ? "€" + new Intl.NumberFormat(numberLocale(lang), { maximumFractionDigits: 0 }).format(n)
    : new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(n) + " €";

export const pricePerSqm = (l: Pick<Listing, "price" | "surface" | "land">) => {
  const area = l.surface ?? l.land;
  return area ? Math.round(l.price / area) : undefined;
};

export const reportDate = (d: string, lang: Lang = "ro") => {
  const [y, m] = d.split("-").map(Number);
  if (!y || !m) return d;
  return new Date(y, m - 1, 1).toLocaleDateString(numberLocale(lang), { month: "long", year: "numeric" });
};

/** URL-safe slug from a Romanian title. */
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
