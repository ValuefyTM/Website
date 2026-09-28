import { NextResponse } from "next/server";
import { adminDb } from "@/lib/admin-api";
import { updateLead } from "@/lib/leads-admin";

export const runtime = "nodejs";

/** Status change and internal notes on an assistant request. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const a = await adminDb();
  if ("error" in a) return a.error;
  const body = (await req.json().catch(() => ({}))) as { status?: unknown; admin_notes?: unknown };
  try {
    await updateLead(a.db, (await params).id, {
      status: typeof body.status === "string" ? body.status : undefined,
      admin_notes: typeof body.admin_notes === "string" ? body.admin_notes : undefined,
    });
  } catch {
    return NextResponse.json({ error: "Status invalid." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
