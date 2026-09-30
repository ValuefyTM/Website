import { NextResponse } from "next/server";
import { adminDb } from "@/lib/admin-api";
import { deleteListing, getById, setPublished, updateListing, validateInput } from "@/lib/listings-db";
import { withAutoEnglish } from "@/lib/translate-listing";

export const runtime = "nodejs";
type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const a = await adminDb();
  if ("error" in a) return a.error;
  const { id } = await params;
  if (!(await getById(a.db, id))) return NextResponse.json({ error: "Anunțul nu există." }, { status: 404 });
  const v = validateInput(await req.json().catch(() => null));
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const value = await withAutoEnglish(v.value);
  const slug = await updateListing(a.db, id, value);
  return NextResponse.json({ ok: true, slug, en: { title: value.title_en ?? "", description: value.description_en ?? "", features: value.features_en ?? [] } });
}

/** Quick publish / unpublish from the admin list. */
export async function PATCH(req: Request, { params }: Ctx) {
  const a = await adminDb();
  if ("error" in a) return a.error;
  const { id } = await params;
  const { published } = (await req.json().catch(() => ({}))) as { published?: boolean };
  await setPublished(a.db, id, published === true);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const a = await adminDb();
  if ("error" in a) return a.error;
  await deleteListing(a.db, (await params).id);
  return NextResponse.json({ ok: true });
}
