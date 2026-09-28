// Server-only: assistant requests (valuation and sale) for the admin panel.
import type { LeadRecord } from "./lead";

export const LEAD_STATUSES = [
  ["NEW", "Nouă"],
  ["CONTACTED", "Contactat"],
  ["OFFER", "Ofertă trimisă"],
  ["WON", "Acceptată"],
  ["LOST", "Închisă fără contract"],
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number][0];
export const statusLabel = (s: string) => LEAD_STATUSES.find(([k]) => k === s)?.[1] ?? s;

export type AdminLead = {
  id: string;
  created_at: string;
  status: string;
  priority: string;
  kind: "sale" | "valuation";
  property_type: string | null;
  description: string | null;
  city: string | null;
  address: string | null;
  surface_area: number | null;
  land_area: number | null;
  rooms: number | null;
  purpose: string | null;
  deadline: string | null;
  asking_price: number | null;
  documents_status: string | null;
  customer_type: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  summary: string | null;
  email_sent: boolean;
  admin_notes: string | null;
  files: string[];
};

type Row = {
  id: string; created_at: string; status: string; priority: string; source: string; valuation_purpose: string | null; deadline: string | null;
  documents_status: string | null; conversation_summary: string | null; email_sent: number; payload: string; admin_notes: string | null;
  property_type: string | null; description: string | null; city: string | null; address: string | null; surface_area: number | null;
  land_area: number | null; rooms: number | null; prop_notes: string | null; name: string; email: string | null; phone: string | null; customer_type: string | null;
  files: string | null;
};

const SELECT = `SELECT l.*, p.property_type, p.description, p.city, p.address, p.surface_area, p.land_area, p.rooms, p.notes AS prop_notes,
  c.name, c.email, c.phone, c.customer_type,
  (SELECT group_concat(filename, '|') FROM lead_files f WHERE f.lead_id = l.id) AS files
  FROM leads l JOIN properties p ON p.id = l.property_id JOIN clients c ON c.id = l.client_id`;

function toLead(r: Row): AdminLead {
  let payload: Partial<LeadRecord> = {};
  try { payload = JSON.parse(r.payload) as Partial<LeadRecord>; } catch { /* keep empty */ }
  const sale = r.source === "WEBSITE_AI_SALE";
  const price = payload.asking_price;
  return {
    id: r.id, created_at: r.created_at, status: r.status, priority: r.priority, kind: sale ? "sale" : "valuation",
    property_type: r.property_type, description: r.description, city: r.city, address: r.address,
    surface_area: r.surface_area, land_area: r.land_area, rooms: r.rooms,
    purpose: sale ? null : r.valuation_purpose, deadline: sale ? null : r.deadline,
    asking_price: typeof price === "number" ? price : price ? Number(price) || null : null,
    documents_status: r.documents_status, customer_type: r.customer_type, name: r.name, email: r.email, phone: r.phone,
    notes: r.prop_notes, summary: r.conversation_summary, email_sent: r.email_sent === 1, admin_notes: r.admin_notes,
    files: r.files ? r.files.split("|") : [],
  };
}

export async function listLeads(db: D1Database): Promise<AdminLead[]> {
  const { results } = await db.prepare(`${SELECT} ORDER BY l.created_at DESC LIMIT 500`).all<Row>();
  return results.map(toLead);
}

export async function getLead(db: D1Database, id: string): Promise<AdminLead | null> {
  const r = await db.prepare(`${SELECT} WHERE l.id = ?`).bind(id).first<Row>();
  return r ? toLead(r) : null;
}

export async function updateLead(db: D1Database, id: string, patch: { status?: string; admin_notes?: string }) {
  const sets: string[] = [];
  const vals: (string | null)[] = [];
  if (patch.status !== undefined) {
    if (!LEAD_STATUSES.some(([k]) => k === patch.status)) throw new Error("status");
    sets.push("status = ?");
    vals.push(patch.status);
  }
  if (patch.admin_notes !== undefined) {
    sets.push("admin_notes = ?");
    vals.push(patch.admin_notes.slice(0, 5000) || null);
  }
  if (!sets.length) return;
  await db
    .prepare(`UPDATE leads SET ${sets.join(", ")}, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?`)
    .bind(...vals, id)
    .run();
}

export async function countNewLeads(db: D1Database): Promise<number> {
  const r = await db.prepare("SELECT COUNT(*) AS n FROM leads WHERE status = 'NEW'").first<{ n: number }>();
  return r?.n ?? 0;
}
