import { NextResponse } from "next/server";
import { adminDb } from "@/lib/admin-api";
import { deletePhoto } from "@/lib/listings-db";

export const runtime = "nodejs";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const a = await adminDb();
  if ("error" in a) return a.error;
  await deletePhoto(a.db, (await params).id);
  return NextResponse.json({ ok: true });
}
