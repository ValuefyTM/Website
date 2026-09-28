import { NextResponse } from "next/server";
import { adminDb } from "@/lib/admin-api";
import { MAX_PHOTO_BYTES, PHOTO_TYPES, addPhoto, getById, reorderPhotos } from "@/lib/listings-db";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  const a = await adminDb();
  if ("error" in a) return a.error;
  const { id } = await params;
  if (!(await getById(a.db, id))) return NextResponse.json({ error: "Anunțul nu există." }, { status: 404 });
  const form = await req.formData().catch(() => null);
  const files = (form?.getAll("photos") ?? []).filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return NextResponse.json({ error: "Nicio fotografie primită." }, { status: 400 });
  const ids: string[] = [];
  const skipped: string[] = [];
  for (const f of files) {
    if (!PHOTO_TYPES.includes(f.type) || f.size > MAX_PHOTO_BYTES) { skipped.push(f.name); continue; }
    ids.push(await addPhoto(a.db, id, await f.arrayBuffer(), f.type));
  }
  return NextResponse.json({ ok: true, ids, skipped });
}

export async function PUT(req: Request, { params }: Ctx) {
  const a = await adminDb();
  if ("error" in a) return a.error;
  const { order } = (await req.json().catch(() => ({}))) as { order?: string[] };
  if (!Array.isArray(order)) return NextResponse.json({ error: "Ordine invalidă." }, { status: 400 });
  await reorderPhotos(a.db, (await params).id, order.map(String).slice(0, 100));
  return NextResponse.json({ ok: true });
}
