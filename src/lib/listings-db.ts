// Server-only: listings stored in D1.
import { photoUrl, slugify, type Listing } from "./listing-format";

type Row = {
  id: string; slug: string; title: string; type: string; city: string; zone: string; price: number;
  surface: number | null; land: number | null; rooms: number | null; baths: number | null; floor: string | null; year: number | null;
  status: string | null; features: string; description: string; report_date: string | null; published: number; updated_at: string;
  photo_ids: string | null;
};

const SELECT = `SELECT l.*, (SELECT group_concat(id, ',') FROM (SELECT id FROM listing_photos p WHERE p.listing_id = l.id ORDER BY position, created_at)) AS photo_ids FROM listings l`;

function toListing(r: Row): Listing {
  const photoIds = r.photo_ids ? r.photo_ids.split(",") : [];
  let features: string[] = [];
  try { features = JSON.parse(r.features) as string[]; } catch { /* keep empty */ }
  return {
    id: r.id, slug: r.slug, title: r.title, type: r.type, city: r.city, zone: r.zone, price: r.price,
    surface: r.surface ?? undefined, land: r.land ?? undefined, rooms: r.rooms ?? undefined, baths: r.baths ?? undefined,
    floor: r.floor ?? undefined, year: r.year ?? undefined, status: r.status ?? undefined, features,
    description: r.description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    report: r.report_date ? { date: r.report_date } : undefined,
    published: r.published === 1, photoIds, photos: photoIds.map(photoUrl), updatedAt: r.updated_at,
  };
}

export async function listPublished(db: D1Database): Promise<Listing[]> {
  const { results } = await db.prepare(`${SELECT} WHERE l.published = 1 ORDER BY l.created_at DESC`).all<Row>();
  return results.map(toListing);
}

export async function listAll(db: D1Database): Promise<Listing[]> {
  const { results } = await db.prepare(`${SELECT} ORDER BY l.created_at DESC`).all<Row>();
  return results.map(toListing);
}

export async function getBySlug(db: D1Database, slug: string, includeUnpublished = false): Promise<Listing | null> {
  const r = await db.prepare(`${SELECT} WHERE l.slug = ?${includeUnpublished ? "" : " AND l.published = 1"}`).bind(slug).first<Row>();
  return r ? toListing(r) : null;
}

export async function getById(db: D1Database, id: string): Promise<Listing | null> {
  const r = await db.prepare(`${SELECT} WHERE l.id = ?`).bind(id).first<Row>();
  return r ? toListing(r) : null;
}

/** Fields accepted from the admin form. */
export type ListingInput = {
  title: string; type: string; city: string; zone?: string; price: number;
  surface?: number | null; land?: number | null; rooms?: number | null; baths?: number | null; floor?: string | null; year?: number | null;
  status?: string | null; features?: string[]; description?: string; report_date?: string | null; published?: boolean;
};

const clean = (v: unknown) => (v === "" || v === undefined ? null : v);

export function validateInput(body: unknown): { ok: true; value: ListingInput } | { ok: false; error: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const str = (k: string, max = 300) => (typeof b[k] === "string" ? (b[k] as string).trim().slice(0, max) : "");
  const num = (k: string) => {
    const v = b[k];
    if (v === null || v === undefined || v === "") return null;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) && n >= 0 ? n : NaN;
  };
  const title = str("title", 160), type = str("type", 40), city = str("city", 80);
  const price = num("price");
  if (!title) return { ok: false, error: "Titlul este obligatoriu." };
  if (!type) return { ok: false, error: "Alege tipul proprietății." };
  if (!city) return { ok: false, error: "Localitatea este obligatorie." };
  if (price === null || Number.isNaN(price) || price <= 0) return { ok: false, error: "Prețul trebuie să fie un număr mai mare ca 0." };
  const nums: Record<string, number | null> = {};
  for (const k of ["surface", "land", "rooms", "baths", "year"]) {
    const n = num(k);
    if (Number.isNaN(n)) return { ok: false, error: `Câmpul „${k}” trebuie să fie un număr.` };
    nums[k] = n;
  }
  const report = str("report_date", 7);
  if (report && !/^\d{4}-\d{2}$/.test(report)) return { ok: false, error: "Data raportului trebuie să fie de forma AAAA-LL." };
  const features = Array.isArray(b.features) ? (b.features as unknown[]).map((x) => String(x).trim().slice(0, 80)).filter(Boolean).slice(0, 30) : [];
  return {
    ok: true,
    value: {
      title, type, city, zone: str("zone", 120), price: Math.round(price),
      surface: nums.surface, land: nums.land, rooms: nums.rooms === null ? null : Math.round(nums.rooms), baths: nums.baths === null ? null : Math.round(nums.baths),
      year: nums.year === null ? null : Math.round(nums.year), floor: clean(str("floor", 40)) as string | null, status: clean(str("status", 20)) as string | null,
      features, description: str("description", 8000), report_date: report || null, published: b.published === true,
    },
  };
}

async function uniqueSlug(db: D1Database, title: string, city: string, exceptId?: string) {
  const base = slugify(`${title} ${city}`) || "proprietate";
  let slug = base;
  for (let i = 2; i < 50; i++) {
    const hit = await db.prepare("SELECT id FROM listings WHERE slug = ?").bind(slug).first<{ id: string }>();
    if (!hit || hit.id === exceptId) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${crypto.randomUUID().slice(0, 6)}`;
}

const cols = (v: ListingInput) => [
  v.title, v.type, v.city, v.zone ?? "", v.price, v.surface ?? null, v.land ?? null, v.rooms ?? null, v.baths ?? null,
  v.floor ?? null, v.year ?? null, v.status ?? null, JSON.stringify(v.features ?? []), v.description ?? "", v.report_date ?? null, v.published ? 1 : 0,
];

export async function createListing(db: D1Database, v: ListingInput): Promise<string> {
  const id = crypto.randomUUID();
  const slug = await uniqueSlug(db, v.title, v.city);
  await db
    .prepare(
      `INSERT INTO listings (id, slug, title, type, city, zone, price, surface, land, rooms, baths, floor, year, status, features, description, report_date, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(id, slug, ...cols(v))
    .run();
  return id;
}

export async function updateListing(db: D1Database, id: string, v: ListingInput): Promise<void> {
  const slug = await uniqueSlug(db, v.title, v.city, id);
  await db
    .prepare(
      `UPDATE listings SET slug = ?, title = ?, type = ?, city = ?, zone = ?, price = ?, surface = ?, land = ?, rooms = ?, baths = ?, floor = ?,
       year = ?, status = ?, features = ?, description = ?, report_date = ?, published = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?`,
    )
    .bind(slug, ...cols(v), id)
    .run();
}

export async function setPublished(db: D1Database, id: string, published: boolean) {
  await db.prepare("UPDATE listings SET published = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?").bind(published ? 1 : 0, id).run();
}

export async function deleteListing(db: D1Database, id: string) {
  await db.batch([
    db.prepare("DELETE FROM listing_photos WHERE listing_id = ?").bind(id),
    db.prepare("UPDATE listing_inquiries SET listing_id = NULL WHERE listing_id = ?").bind(id),
    db.prepare("DELETE FROM listings WHERE id = ?").bind(id),
  ]);
}

// ---------- photos ----------
export const MAX_PHOTO_BYTES = 1_800_000; // D1 value limit is 2 MB
export const PHOTO_TYPES = ["image/jpeg", "image/webp", "image/png"];

export async function addPhoto(db: D1Database, listingId: string, bytes: ArrayBuffer, contentType: string): Promise<string> {
  const id = crypto.randomUUID();
  const pos = await db.prepare("SELECT COALESCE(MAX(position), -1) + 1 AS p FROM listing_photos WHERE listing_id = ?").bind(listingId).first<{ p: number }>();
  await db
    .prepare("INSERT INTO listing_photos (id, listing_id, position, content_type, size_bytes, data) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(id, listingId, pos?.p ?? 0, contentType, bytes.byteLength, bytes)
    .run();
  return id;
}

export async function getPhoto(db: D1Database, id: string) {
  return db.prepare("SELECT content_type, data FROM listing_photos WHERE id = ?").bind(id).first<{ content_type: string; data: ArrayBuffer | number[] }>();
}

export async function deletePhoto(db: D1Database, id: string) {
  await db.prepare("DELETE FROM listing_photos WHERE id = ?").bind(id).run();
}

export async function reorderPhotos(db: D1Database, listingId: string, ids: string[]) {
  if (!ids.length) return;
  await db.batch(ids.map((pid, i) => db.prepare("UPDATE listing_photos SET position = ? WHERE id = ? AND listing_id = ?").bind(i, pid, listingId)));
}

// ---------- inquiries ----------
export type Inquiry = {
  id: number; listing_id: string | null; listing_title: string; kind: string; name: string; email: string | null; phone: string | null;
  reason: string | null; message: string | null; status: string; email_sent: number; created_at: string;
};

export async function listInquiries(db: D1Database, limit = 100): Promise<Inquiry[]> {
  const { results } = await db.prepare("SELECT * FROM listing_inquiries ORDER BY created_at DESC LIMIT ?").bind(limit).all<Inquiry>();
  return results;
}
