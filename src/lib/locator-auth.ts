// Server-only: password for /localizare (cadastral search). LOCALIZARE_PASSWORD overrides the default,
// whose SHA-256 is kept here instead of the password itself. The session is an HMAC-signed cookie.
import { cookies } from "next/headers";

export const LOC_COOKIE = "vf_loc";
const DAYS = 30;
const DEFAULT_HASH = "bb4e9bc1c18aaac8ae29ddee713bc43ff8adcdfc49137a2275e3395e1597e94d";

const enc = new TextEncoder();
const hex = (b: ArrayBuffer) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, "0")).join("");
const sha256 = async (s: string) => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));
const passwordHash = async () => (process.env.LOCALIZARE_PASSWORD ? sha256(process.env.LOCALIZARE_PASSWORD) : DEFAULT_HASH);

async function hmac(data: string) {
  // Changing the password signs everyone out.
  const secret = `${process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ""}:${await passwordHash()}`;
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function checkLocatorPassword(input: string) {
  return safeEqual(await sha256(input), await passwordHash());
}

export async function locatorToken() {
  const exp = Date.now() + DAYS * 864e5;
  return `${exp}.${await hmac(`loc.${exp}`)}`;
}

export async function hasLocatorAccess() {
  const t = (await cookies()).get(LOC_COOKIE)?.value;
  if (!t) return false;
  const [expStr, sig] = t.split(".");
  const exp = Number(expStr);
  if (!exp || exp < Date.now() || !sig) return false;
  return safeEqual(sig, await hmac(`loc.${exp}`));
}

export const LOC_MAX_AGE = DAYS * 86400;
