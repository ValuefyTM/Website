import { NextResponse } from "next/server";
import { adminDb } from "@/lib/admin-api";
import { MAX_SOCIAL_BYTES, getById, setSocialImage } from "@/lib/listings-db";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ id: string }> };

/** Stores the 1200×630 share image generated in the admin browser. */
export async function PUT(req: Request, { params }: Ctx) {
  const a = await adminDb();
  if ("error" in a) return a.error;
  const { id } = await params;
  if (!(await getById(a.db, id))) return NextResponse.json({ error: "Anunțul nu există." }, { status: 404 });
  const type = req.headers.get("content-type") ?? "";
  if (type !== "image/jpeg") return NextResponse.json({ error: "Format invalid." }, { status: 400 });
  const data = await req.arrayBuffer();
  if (!data.byteLength || data.byteLength > MAX_SOCIAL_BYTES) return NextResponse.json({ error: "Imagine prea mare." }, { status: 400 });
  await setSocialImage(a.db, id, data, type);
  return NextResponse.json({ ok: true });
}
