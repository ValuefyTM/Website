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
};

export const photoUrl = (id: string) => `/api/photos/${id}`;

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
