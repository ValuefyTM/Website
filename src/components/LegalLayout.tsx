import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site, phoneHref } from "@/config/site";
import { AssistantProvider } from "./Assistant";
import { Header } from "./Header";
import { Footer } from "./Closing";
import { localize, type Lang } from "@/i18n/lang";
import s from "./Legal.module.css";

// Shared layout for the legal pages: /politica-de-confidentialitate, /politica-cookies, /termeni-si-conditii
// (and their /en counterparts). The page view calls setLang(lang) before rendering this.

export type LegalSection = { id: string; title: string; body: ReactNode };

const LEGAL_PAGES = [
  ["/politica-de-confidentialitate", { ro: "Politica de confidențialitate", en: "Privacy policy" }],
  ["/politica-cookies", { ro: "Politica cookies", en: "Cookie policy" }],
  ["/termeni-si-conditii", { ro: "Termeni și condiții", en: "Terms and conditions" }],
] as const;

const T = {
  ro: {
    home: "Acasă",
    updated: "Ultima actualizare: 1 octombrie 2026",
    toc: "Cuprins",
    note: "Acest document va fi revizuit periodic.",
    related: "Alte documente",
  },
  en: {
    home: "Home",
    updated: "Last updated: 1 October 2026",
    toc: "Contents",
    note: "This document will be reviewed periodically.",
    related: "Other documents",
  },
};

export function legalMetadata(lang: Lang, roPath: string, title: string, description: string): Metadata {
  const url = localize(lang, roPath);
  return {
    title,
    description,
    alternates: { canonical: url, languages: { ro: roPath, en: localize("en", roPath) } },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: lang === "en" ? "en_GB" : "ro_RO",
      type: "website",
      images: ["/opengraph-image.png"],
    },
  };
}

/** Company identification block, used at the top of each legal page. */
export function CompanyDetails({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <div className={s.card}>
      <p>
        <strong>{site.legalName}</strong>
        <br />
        {en ? "Tax identification number (CUI)" : "CUI"}: {site.cui} ({en ? "VAT number" : "cod de TVA"}: {site.vatNo})
        <br />
        {en ? "Trade Register no." : "Nr. Registrul Comerțului"}: {site.regCom}
        <br />
        {en ? "Registered office" : "Sediu social"}: {site.address}
        <br />
        Email: <a href={`mailto:${site.email}`}>{site.email}</a> · {en ? "Phone" : "Telefon"}: <a href={phoneHref(site.phone)}>{site.phone}</a>
        {site.anevarNo ? (
          <>
            <br />
            {en ? "ANEVAR authorisation no." : "Nr. autorizație ANEVAR"}: {site.anevarNo}
          </>
        ) : null}
      </p>
    </div>
  );
}

export function LegalLayout({
  lang,
  roPath,
  title,
  lead,
  sections,
}: {
  lang: Lang;
  roPath: string;
  title: string;
  lead?: ReactNode;
  sections: LegalSection[];
}) {
  const t = T[lang];
  return (
    <AssistantProvider>
      <Header />
      <main id="top">
        <section aria-labelledby="page-title" className={s.hero}>
          <div className="container">
            <div className={`${s.narrow} ${s.heroInner}`}>
              <nav aria-label="Breadcrumb" className={s.crumbs}>
                <a href={localize(lang, "/")}>{t.home}</a>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{title}</span>
              </nav>
              <h1 id="page-title" className={s.title}>{title}</h1>
              <p className={s.updated}>{t.updated}</p>
              {lead ? <p className={s.lead}>{lead}</p> : null}
            </div>
          </div>
        </section>

        <div className="container">
          <div className={`${s.narrow} ${s.body}`}>
            <nav aria-labelledby="toc-title" className={s.toc}>
              <div id="toc-title" className={s.tocTitle}>{t.toc}</div>
              <ol>
                {sections.map((sec) => (
                  <li key={sec.id}><a href={`#${sec.id}`}>{sec.title}</a></li>
                ))}
              </ol>
            </nav>

            {sections.map((sec, i) => (
              <section key={sec.id} id={sec.id} aria-labelledby={`${sec.id}-title`} className={s.section}>
                <h2 id={`${sec.id}-title`}>{i + 1}. {sec.title}</h2>
                {sec.body}
              </section>
            ))}

            <p className={s.note}>{t.note}</p>
            <nav aria-label={t.related} className={s.related}>
              {LEGAL_PAGES.filter(([p]) => p !== roPath).map(([p, names]) => (
                <a key={p} href={localize(lang, p)}>{names[lang]}</a>
              ))}
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </AssistantProvider>
  );
}

/** Table helper for the legal pages. */
export function LegalTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
