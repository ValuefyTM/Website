import { hasLocatorAccess } from "@/lib/locator-auth";
import { locatorAsset } from "@/lib/locator-files";

// /localizare — cadastral search (Timiș), behind a password.
export const dynamic = "force-dynamic";

const PRIVATE = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "same-origin" };

export async function GET(req: Request) {
  if (!(await hasLocatorAccess())) {
    const wrong = new URL(req.url).searchParams.has("eroare");
    return new Response(loginPage(wrong), { status: 401, headers: { "Content-Type": "text/html; charset=utf-8", ...PRIVATE } });
  }
  const page = await locatorAsset("index.html", req);
  if (!page) return new Response("Pagina nu este disponibilă momentan.", { status: 503, headers: PRIVATE });
  // The page is the one supplied as is; the export to PDF / Word / PNG is added as a separate script.
  const html = (await page.text()).replace("</body>", '<script src="/api/localizare/script" defer></script></body>');
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", ...PRIVATE } });
}

function loginPage(wrong: boolean) {
  return `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Localizare · VALUEFY</title><link rel="icon" href="/icon.png">
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:#F2ECE0;color:#17173A;font-family:Verdana,Geneva,sans-serif}
.box{width:min(400px,100%);background:#fff;border:1px solid #E2D8C4;border-radius:22px;padding:30px 26px;display:flex;flex-direction:column;gap:14px}
img{height:28px;width:auto;align-self:flex-start}h1{margin:6px 0 0;font-size:22px;letter-spacing:-.02em}p{margin:0;font-size:14px;line-height:1.6;color:#4A4A66}
label{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:700;color:#4A4A66}
input{height:48px;padding:0 14px;border:1px solid #E2D8C4;border-radius:12px;background:#FBF8F2;font-size:16px;color:#17173A;outline:none}input:focus{border-color:#9A5F00;background:#fff}
button{height:50px;border:0;border-radius:999px;background:#17173A;color:#fff;font-size:15px;font-weight:700;cursor:pointer}button:hover{background:#24245A}
.err{padding:10px 14px;border-radius:12px;background:#FBE9E7;color:#B3261E;font-size:13px;font-weight:700}
</style></head><body>
<form class="box" method="post" action="/api/localizare/login">
<img src="/valuefy-logo.png" alt="VALUEFY">
<h1>Localizare cadastrală</h1>
<p>Pagină internă VALUEFY. Introdu parola ca să vezi harta.</p>
${wrong ? '<div class="err" role="alert">Parola nu este corectă.</div>' : ""}
<label>Parolă<input type="password" name="password" autocomplete="current-password" required autofocus></label>
<button type="submit">Intră</button>
</form></body></html>`;
}
