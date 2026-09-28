// Listing types and formatting helpers — safe to import in client components.

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
};

export const photoUrl = (id: string) => `/api/photos/${id}`;
export const socialUrl = (id: string, version: string) => `/api/social/${id}?v=${encodeURIComponent(version)}`;

/** Every property is sold with no commission for the buyer. */
export const COMMISSION_NOTE = "Comision 0%";

/** Short spec line, e.g. "3 camere · 74 m² · etaj 2 din 4". */
export function specLine(l: Pick<Listing, "rooms" | "surface" | "land" | "floor">) {
  return [
    l.rooms ? `${l.rooms} ${l.rooms === 1 ? "cameră" : "camere"}` : "",
    l.surface ? `${l.surface.toLocaleString("ro-RO")} m²` : "",
    l.land ? `teren ${l.land.toLocaleString("ro-RO")} m²` : "",
    l.floor ? `etaj ${l.floor}` : "",
  ].filter(Boolean).join(" · ");
}

/** Recommendation message for WhatsApp / SMS / email. */
export function shareMessage(l: Listing, url: string) {
  const where = [l.zone, l.city].filter(Boolean).join(", ");
  return [
    `Salut! Uite o proprietate care cred că te-ar interesa:`,
    ``,
    `🏠 ${l.title}`,
    `📍 ${where}`,
    `💶 ${formatEur(l.price)}${specLine(l) ? " · " + specLine(l) : ""}`,
    `✅ ${COMMISSION_NOTE} — fără comision la cumpărare${l.report ? "\n📄 Are raport de evaluare ANEVAR" : ""}`,
    ``,
    url,
  ].join("\n");
}

/** Longer post for Facebook / Instagram / LinkedIn. */
export function socialPost(l: Listing, url: string) {
  const where = [l.zone, l.city].filter(Boolean).join(", ");
  const tag = (s: string) => "#" + slugify(s).replace(/-/g, "");
  return [
    `${l.type} de vânzare · ${where}`,
    ``,
    `${l.title}`,
    `💶 ${formatEur(l.price)}${specLine(l) ? " · " + specLine(l) : ""}`,
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

export const formatEur = (n: number) => new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(n) + " €";

export const pricePerSqm = (l: Pick<Listing, "price" | "surface" | "land">) => {
  const area = l.surface ?? l.land;
  return area ? Math.round(l.price / area) : undefined;
};

export const reportDate = (d: string) => {
  const [y, m] = d.split("-").map(Number);
  if (!y || !m) return d;
  return new Date(y, m - 1, 1).toLocaleDateString("ro-RO", { month: "long", year: "numeric" });
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
