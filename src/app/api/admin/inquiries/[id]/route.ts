import { NextResponse } from "next/server";
import { adminDb } from "@/lib/admin-api";

export const runtime = "nodejs";

/** Mark an inquiry as handled (e.g. report sent). */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const a = await adminDb();
  if ("error" in a) return a.error;
  const { status } = (await req.json().catch(() => ({}))) as { status?: string };
  if (!["NEW", "SENT", "DONE"].includes(status || "")) return NextResponse.json({ error: "Status invalid." }, { status: 400 });
  await a.db.prepare("UPDATE listing_inquiries SET status = ? WHERE id = ?").bind(status, Number((await params).id)).run();
  return NextResponse.json({ ok: true });
}
