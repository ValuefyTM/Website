import { NextResponse } from "next/server";
import { checkLocatorPassword, LOC_COOKIE, LOC_MAX_AGE, locatorToken } from "@/lib/locator-auth";

/** Password form of /localizare. */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const pw = String(form?.get("password") ?? "");
  const back = new URL("/localizare", req.url);
  if (!pw || !(await checkLocatorPassword(pw))) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    back.searchParams.set("eroare", "1");
    return NextResponse.redirect(back, 303);
  }
  const res = NextResponse.redirect(back, 303);
  res.cookies.set({ name: LOC_COOKIE, value: await locatorToken(), httpOnly: true, secure: back.protocol === "https:", sameSite: "lax", path: "/", maxAge: LOC_MAX_AGE });
  return res;
}
