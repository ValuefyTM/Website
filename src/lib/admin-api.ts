// Server-only helpers for /api/admin/* route handlers.
import { NextResponse } from "next/server";
import { isAdmin } from "./admin-auth";
import { getDb } from "./db";

/** Returns the database when the caller is a logged-in admin, otherwise an error response. */
export async function adminDb(): Promise<{ db: D1Database } | { error: NextResponse }> {
  if (!(await isAdmin())) return { error: NextResponse.json({ error: "Neautorizat." }, { status: 401 }) };
  const db = await getDb();
  if (!db) return { error: NextResponse.json({ error: "Baza de date nu este disponibilă." }, { status: 503 }) };
  return { db };
}
