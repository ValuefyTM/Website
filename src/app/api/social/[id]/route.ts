import { getDb } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { getSocialImage } from "@/lib/listings-db";

export const runtime = "nodejs";

/** Share image (link preview) of a listing. The ?v= query changes whenever the image is regenerated. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  if (!db || !/^[0-9a-f-]{36}$/.test(id)) return new Response("Not found", { status: 404 });
  const img = await getSocialImage(db, id, await isAdmin());
  if (!img) return new Response("Not found", { status: 404 });
  const bytes = img.data instanceof ArrayBuffer ? new Uint8Array(img.data) : new Uint8Array(img.data as number[]);
  return new Response(bytes, {
    headers: { "Content-Type": img.content_type, "Cache-Control": "public, max-age=86400" },
  });
}
