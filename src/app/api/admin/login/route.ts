import { NextResponse } from "next/server";
import { adminConfigured, checkPassword, createSessionToken, sessionCookie, SESSION_MAX_AGE } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!adminConfigured()) return NextResponse.json({ error: "Adminul nu este configurat: lipsește ADMIN_PASSWORD." }, { status: 503 });
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || !(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return NextResponse.json({ error: "Parolă greșită." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie(await createSessionToken(), SESSION_MAX_AGE));
  return res;
}
