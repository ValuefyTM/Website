import { NextResponse } from "next/server";
import { adminDb } from "@/lib/admin-api";
import { createListing, validateInput } from "@/lib/listings-db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const a = await adminDb();
  if ("error" in a) return a.error;
  const v = validateInput(await req.json().catch(() => null));
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const id = await createListing(a.db, v.value);
  return NextResponse.json({ ok: true, id });
}
