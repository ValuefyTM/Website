import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { LeadRecord } from "./lead";

type FileMeta = { name: string; size: number; type: string };

/** The D1 database bound as `DB`, or null when unavailable (e.g. plain `next start`). */
export async function getDb(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.DB ?? null;
  } catch {
    return null;
  }
}

const digits = (s?: string | null) => (s || "").replace(/\D/g, "");

/** Finds a client by email, then by phone; creates one if none matches. */
async function upsertClient(db: D1Database, r: LeadRecord): Promise<string> {
  const email = r.email?.trim().toLowerCase() || null;
  const phoneDigits = digits(r.phone) || null;

  let existing: { id: string } | null = null;
  if (email) existing = await db.prepare("SELECT id FROM clients WHERE email = ? LIMIT 1").bind(email).first();
  if (!existing && phoneDigits) existing = await db.prepare("SELECT id FROM clients WHERE phone_digits = ? LIMIT 1").bind(phoneDigits).first();

  if (existing) {
    // Fill in details the client gave now but we didn't have before.
    await db
      .prepare(
        `UPDATE clients SET name = ?, customer_type = COALESCE(?, customer_type), email = COALESCE(email, ?),
         phone = COALESCE(phone, ?), phone_digits = COALESCE(phone_digits, ?),
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?`,
      )
      .bind(r.name, r.customer_type, email, r.phone, phoneDigits, existing.id)
      .run();
    return existing.id;
  }

  const id = crypto.randomUUID();
  await db
    .prepare("INSERT INTO clients (id, customer_type, name, email, phone, phone_digits) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(id, r.customer_type, r.name ?? "", email, r.phone, phoneDigits)
    .run();
  return id;
}

const numOrNull = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

/** Stores a website lead with its client, property and attached-file metadata. */
export async function saveLead(db: D1Database, r: LeadRecord, files: FileMeta[]): Promise<void> {
  const clientId = await upsertClient(db, r);
  const propertyId = crypto.randomUUID();
  const rooms = numOrNull(r.rooms);

  await db.batch([
    db
      .prepare(
        "INSERT INTO properties (id, client_id, property_type, city, address, surface_area, land_area, rooms, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(propertyId, clientId, r.property_type, r.city, r.address, numOrNull(r.surface_area), numOrNull(r.land_area), rooms === null ? null : Math.round(rooms), r.notes),
    db
      .prepare(
        `INSERT INTO leads (id, created_at, source, status, priority, client_id, property_id, valuation_purpose,
         deadline, documents_status, conversation_summary, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(r.lead_id, r.created_at, r.source, r.lead_status, r.priority, clientId, propertyId, r.valuation_purpose, r.deadline, r.documents_status, r.conversation_summary, JSON.stringify(r)),
    ...files.map((f) =>
      db.prepare("INSERT INTO lead_files (lead_id, filename, size_bytes, content_type) VALUES (?, ?, ?, ?)").bind(r.lead_id, f.name, f.size, f.type || null),
    ),
  ]);
}

export async function markLeadEmailed(db: D1Database, leadId: string): Promise<void> {
  await db.prepare("UPDATE leads SET email_sent = 1 WHERE id = ?").bind(leadId).run();
}
