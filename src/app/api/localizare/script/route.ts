import { hasLocatorAccess } from "@/lib/locator-auth";
import { locatorAsset } from "@/lib/locator-files";

/** PDF / Word / PNG export of the /localizare sheet (localizare-data/export.js), for signed-in users. */
export async function GET(req: Request) {
  if (!(await hasLocatorAccess())) return new Response("// autentificare necesară", { status: 401, headers: { "Content-Type": "text/javascript" } });
  const file = await locatorAsset("export.js", req);
  if (!file) return new Response("// indisponibil", { status: 404, headers: { "Content-Type": "text/javascript" } });
  return new Response(await file.text(), { headers: { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "private, no-cache" } });
}
