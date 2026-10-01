// Languages and localized paths — safe to import anywhere (server and client).

export type Lang = "ro" | "en";
export const LANGS: Lang[] = ["ro", "en"];

/** Pick the strings for a language from a { ro, en } dictionary. */
export const pick = <T,>(dict: { ro: T; en: T }, lang: Lang): T => dict[lang];

// Romanian path prefix → English path prefix. Longest first.
const PATHS: [string, string][] = [
  ["/politica-de-confidentialitate", "/en/privacy-policy"],
  ["/evaluare-bunuri-mobile", "/en/movable-asset-valuation"],
  ["/evaluare-pentru-impozitare", "/en/tax-valuation"],
  ["/termeni-si-conditii", "/en/terms"],
  ["/politica-cookies", "/en/cookie-policy"],
  ["/imobiliare", "/en/properties"],
  ["/client", "/en/client"],
];

/** Localize a site path written in Romanian, e.g. localize("en", "/imobiliare/x/raport") → "/en/properties/x/report". */
export function localize(lang: Lang, path: string): string {
  if (lang === "ro" || !path.startsWith("/") || path.startsWith("/api/") || path.startsWith("/admin")) return path;
  const [base, hash = ""] = path.split("#");
  const h = hash ? `#${hash}` : "";
  if (base === "/" || base === "") return `/en${h}`;
  for (const [ro, en] of PATHS) {
    if (base === ro || base.startsWith(ro + "/")) {
      const rest = base.slice(ro.length).replace(/\/raport$/, "/report");
      return en + rest + h;
    }
  }
  return base + h; // pages that exist only in Romanian
}

/** The Romanian path for any path on the site. */
export function toRomanian(path: string): string {
  if (path !== "/en" && !path.startsWith("/en/") && !path.startsWith("/en#")) return path;
  const [base, hash = ""] = path.split("#");
  const h = hash ? `#${hash}` : "";
  if (base === "/en" || base === "/en/") return `/${h}`;
  for (const [ro, en] of PATHS) {
    if (base === en || base.startsWith(en + "/")) return ro + base.slice(en.length).replace(/\/report$/, "/raport") + h;
  }
  return base.slice(3) + h;
}

export const langOf = (path: string): Lang => (path === "/en" || path.startsWith("/en/") ? "en" : "ro");

/** Same page in the other language. */
export const switchPath = (path: string, to: Lang) => localize(to, toRomanian(path));

export const numberLocale = (lang: Lang) => (lang === "en" ? "en-GB" : "ro-RO");
