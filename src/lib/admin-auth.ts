// Server-only: password login for /admin with an HMAC-signed session cookie.
// ADMIN_PASSWORD (secret) is required; ADMIN_SESSION_SECRET is optional (defaults to the password,
// so changing the password logs everyone out).
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "vf_admin";
const SESSION_DAYS = 7;

const enc = new TextEncoder();
const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
export const adminConfigured = () => !!process.env.ADMIN_PASSWORD;

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function checkPassword(input: string) {
  const pw = process.env.ADMIN_PASSWORD || "";
  if (!pw) return false;
  // Compare HMACs so timing does not depend on the password length.
  return safeEqual(await hmac(`pw:${input}`), await hmac(`pw:${pw}`));
}

export async function createSessionToken() {
  const exp = Date.now() + SESSION_DAYS * 864e5;
  return `${exp}.${await hmac(`admin.${exp}`)}`;
}

export async function verifySessionToken(token?: string | null) {
  if (!token || !adminConfigured()) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || exp < Date.now() || !sig) return false;
  return safeEqual(sig, await hmac(`admin.${exp}`));
}

export const sessionCookie = (value: string, maxAgeSeconds: number) => ({
  name: ADMIN_COOKIE,
  value,
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: maxAgeSeconds,
});
export const SESSION_MAX_AGE = SESSION_DAYS * 86400;

/** For server components and route handlers. */
export async function isAdmin() {
  const c = (await cookies()).get(ADMIN_COOKIE);
  return verifySessionToken(c?.value);
}
