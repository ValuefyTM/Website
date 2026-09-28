import { getDb } from "@/lib/db";
import { getPhoto } from "@/lib/listings-db";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  if (!db || !/^[0-9a-f-]{36}$/.test(id)) return new Response("Not found", { status: 404 });
  const photo = await getPhoto(db, id);
  if (!photo) return new Response("Not found", { status: 404 });
  const bytes = photo.data instanceof ArrayBuffer ? new Uint8Array(photo.data) : new Uint8Array(photo.data as number[]);
  return new Response(bytes, {
    headers: { "Content-Type": photo.content_type, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
