import { setLang } from "@/i18n/server";
import { site } from "@/config/site";
import { localize, type Lang } from "@/i18n/lang";
import { AssistantProvider } from "./Assistant";
import { AssistantButton } from "./AssistantButton";
import { Header } from "./Header";
import { Footer } from "./Closing";
import s from "./NotFound.module.css";

const T = {
  ro: {
    eyebrow: "Eroare 404",
    title: "Pagina pe care o cauți nu există.",
    lead: "Poate a fost mutată, anunțul a fost vândut sau adresa are o greșeală de scriere. Te ajutăm să ajungi unde voiai.",
    home: "Mergi la prima pagină",
    estate: "Vezi proprietățile de vânzare",
    request: "Solicită o evaluare →",
    popular: "Pagini utile",
    links: [
      ["Evaluări imobiliare", "/#servicii"],
      ["Portal Imobiliar", "/imobiliare"],
      ["Evaluarea bunurilor mobile", "/evaluare-bunuri-mobile"],
      ["Evaluare pentru impozitare", "/evaluare-pentru-impozitare"],
      ["Întrebări frecvente", "/#faq"],
      ["Portal client", site.portalUrl],
    ],
  },
  en: {
    eyebrow: "Error 404",
    title: "The page you're looking for doesn't exist.",
    lead: "It may have moved, the property may have been sold, or the address has a typo. Let us help you get where you wanted to go.",
    home: "Go to the home page",
    estate: "See properties for sale",
    request: "Request a valuation →",
    popular: "Useful pages",
    links: [
      ["Property valuations", "/#servicii"],
      ["Real Estate Portal", "/imobiliare"],
      ["Movable asset valuation", "/evaluare-bunuri-mobile"],
      ["Valuation for tax purposes", "/evaluare-pentru-impozitare"],
      ["FAQ", "/#faq"],
      ["Client portal", site.portalUrl],
    ],
  },
};

/** 404 page in the site's layout. `bilingual` adds a link to the English site (used when the language is unknown). */
export function NotFoundView({ lang, bilingual = false }: { lang: Lang; bilingual?: boolean }) {
  setLang(lang);
  const t = T[lang];
  const L = (p: string) => localize(lang, p);
  return (
    <AssistantProvider>
      <Header />
      <main id="top" className={s.page}>
        <div className={`container ${s.inner}`}>
          <div className={s.code} aria-hidden="true">404</div>
          <div className={s.copy}>
            <div className="eyebrow">{t.eyebrow}</div>
            <h1 className={s.title}>{t.title}</h1>
            <p className={s.lead}>{t.lead}</p>
            <div className={s.actions}>
              <a href={L("/")} className={s.primary}>{t.home}</a>
              <a href={L("/imobiliare")} className={s.secondary}>{t.estate}</a>
              <AssistantButton className={s.ghost}>{t.request}</AssistantButton>
            </div>
            <nav aria-labelledby="nf-links" className={s.links}>
              <h2 id="nf-links">{t.popular}</h2>
              <ul>
                {t.links.map(([label, href]) => (
                  <li key={href}><a href={L(href)}>{label}<span aria-hidden="true">→</span></a></li>
                ))}
              </ul>
            </nav>
            {bilingual && (
              <p className={s.alt} lang="en">
                Page not found. <a href="/en">Go to the English website</a>.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </AssistantProvider>
  );
}
