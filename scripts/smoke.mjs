// Smoke test: key pages in both languages answer correctly.
// Usage: npm run test:smoke -- <base url>   (default http://localhost:3000)
const BASE = (process.argv[2] || process.env.SMOKE_URL || "http://localhost:3000").replace(/\/$/, "");

const pages = [
  // [path, expected status, html lang, text that must appear]
  ["/", 200, "ro", "Evaluări imobiliare"],
  ["/en", 200, "en", "Property valuations"],
  ["/imobiliare", 200, "ro", "Proprietăți de vânzare"],
  ["/en/properties", 200, "en", "Properties for sale"],
  ["/evaluare-bunuri-mobile", 200, "ro", "bunuri mobile"],
  ["/en/movable-asset-valuation", 200, "en", "movable assets"],
  ["/evaluare-pentru-impozitare", 200, "ro", "impozit"],
  ["/en/tax-valuation", 200, "en", "tax"],
  ["/evaluare-esalonare-anaf", 200, "ro", "eșalonare"],
  ["/en/anaf-instalment-valuation", 200, "en", "instalment"],
  ["/client", 200, "ro", "Colaborator"],
  ["/en/client", 200, "en", "Partner"],
  ["/politica-de-confidentialitate", 200, "ro", "VALUEFY S.R.L."],
  ["/en/privacy-policy", 200, "en", "VALUEFY S.R.L."],
  ["/politica-cookies", 200, "ro", "cookie"],
  ["/en/cookie-policy", 200, "en", "cookie"],
  ["/termeni-si-conditii", 200, "ro", "VALUEFY"],
  ["/en/terms", 200, "en", "VALUEFY"],
  ["/pagina-care-nu-exista", 404, "ro", "404"],
  ["/en/page-that-does-not-exist", 404, "en", "doesn't exist"],
  ["/imobiliare/anunt-inexistent", 404, "ro", "404"],
];
// Romanian interface text that must never show on English pages.
const RO_ON_EN = ["Solicită evaluare", "Portal Imobiliar</", "Întrebări frecvente", "Despre noi"];

let failed = 0;
const fail = (msg) => { failed++; console.log(`  ✗ ${msg}`); };

for (const [path, status, lang, text] of pages) {
  try {
    const res = await fetch(BASE + path, { redirect: "manual" });
    const html = await res.text();
    const errs = [];
    if (res.status !== status) errs.push(`status ${res.status} (expected ${status})`);
    const htmlLang = /<html[^>]*\blang="([a-z-]+)"/i.exec(html)?.[1];
    // Dynamic pages answer a 404 with Next's error shell (the language is set on hydration), so only check it on 200s.
    if (status === 200 && htmlLang !== lang) errs.push(`html lang="${htmlLang}" (expected ${lang})`);
    if (!html.toLowerCase().includes(text.toLowerCase())) errs.push(`missing text "${text}"`);
    if (lang === "en") for (const ro of RO_ON_EN) if (html.includes(ro)) errs.push(`Romanian text on English page: "${ro}"`);
    if (errs.length) fail(`${path}: ${errs.join("; ")}`);
    else console.log(`  ✓ ${path}`);
  } catch (e) {
    fail(`${path}: ${e.message}`);
  }
}

for (const [path, check] of [
  ["/robots.txt", (r, b) => r.status === 200 && b.includes("Disallow: /admin")],
  ["/sitemap.xml", (r, b) => r.status === 200 && b.includes("/en/properties")],
  ["/api/assistant/status", (r, b) => r.status === 200 && b.includes('"online"')],
  ["/admin", (r) => [302, 303, 307, 308].includes(r.status) && (r.headers.get("location") || "").includes("/admin/login")],
]) {
  try {
    const res = await fetch(BASE + path, { redirect: "manual" });
    if (check(res, await res.text())) console.log(`  ✓ ${path}`);
    else fail(`${path}: unexpected response ${res.status}`);
  } catch (e) {
    fail(`${path}: ${e.message}`);
  }
}

console.log(failed ? `\n${failed} check(s) failed on ${BASE}` : `\nAll checks passed on ${BASE}`);
process.exit(failed ? 1 : 0);
