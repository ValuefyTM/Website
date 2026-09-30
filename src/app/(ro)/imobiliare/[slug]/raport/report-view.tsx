import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssistantProvider } from "@/components/Assistant";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Closing";
import { getDb } from "@/lib/db";
import { getBySlug } from "@/lib/listings-db";
import { formatEur, inLang, reportDate } from "@/lib/listing-format";
import { setLang } from "@/i18n/server";
import { localize, type Lang } from "@/i18n/lang";
import { ReportRequestForm } from "./ReportRequestForm";
import s from "./raport.module.css";

// Shared by /imobiliare/[slug]/raport and /en/properties/[slug]/report — see page.tsx in both route trees.

const T = {
  ro: {
    metaTitle: (title: string) => `Solicită raportul de evaluare — ${title} | VALUEFY`,
    home: "Acasă", listings: "Proprietăți de vânzare", crumb: "Raport de evaluare",
    eyebrow: "Raport de evaluare",
    title: "Solicită raportul de evaluare al proprietății.",
    lead: "Completează câteva date și îți trimitem raportul pe email. Le folosim ca să știm cine consultă raportul și ca să te putem contacta pentru detalii sau o vizionare.",
    badge: (date: string) => `✓ Raport ANEVAR · ${date}`,
    steps: [
      ["Completezi formularul", "Durează sub un minut."],
      ["Verificăm solicitarea", "Confirmăm datele, de regulă în aceeași zi lucrătoare."],
      ["Primești raportul pe email", "Împreună cu datele de contact ale consultantului."],
    ],
  },
  en: {
    metaTitle: (title: string) => `Request the valuation report — ${title} | VALUEFY`,
    home: "Home", listings: "Properties for sale", crumb: "Valuation report",
    eyebrow: "Valuation report",
    title: "Request the property's valuation report.",
    lead: "Fill in a few details and we will email you the report. We use them to know who is reading the report and to be able to contact you with more details or to arrange a viewing.",
    badge: (date: string) => `✓ ANEVAR report · ${date}`,
    steps: [
      ["You fill in the form", "It takes less than a minute."],
      ["We check your request", "We confirm the details, usually on the same working day."],
      ["You receive the report by email", "Together with your consultant's contact details."],
    ],
  },
};

async function load(slug: string) {
  const db = await getDb();
  return db ? getBySlug(db, slug) : null;
}

export async function reportMetadata(slug: string, lang: Lang): Promise<Metadata> {
  const listing = await load(slug);
  if (!listing) return {};
  const l = inLang(listing, lang);
  const roPath = `/imobiliare/${l.slug}/raport`;
  return {
    title: T[lang].metaTitle(l.title),
    robots: { index: false, follow: false },
    alternates: { canonical: localize(lang, roPath), languages: { ro: roPath, en: localize("en", roPath) } },
  };
}

export async function ReportView({ slug, lang }: { slug: string; lang: Lang }) {
  setLang(lang);
  const t = T[lang];
  const listing = await load(slug);
  if (!listing || !listing.report) notFound();
  const l = inLang(listing, lang);
  const listingHref = localize(lang, `/imobiliare/${l.slug}`);

  return (
    <AssistantProvider>
      <Header />
      <main id="top" className={s.page}>
        <div className={`container ${s.inner}`}>
          <nav aria-label="Breadcrumb" className={s.crumbs}>
            <a href={localize(lang, "/")}>{t.home}</a><span aria-hidden="true">/</span>
            <a href={localize(lang, "/imobiliare")}>{t.listings}</a><span aria-hidden="true">/</span>
            <a href={listingHref}>{l.city}</a><span aria-hidden="true">/</span>
            <span aria-current="page">{t.crumb}</span>
          </nav>

          <div className={s.layout}>
            <div className={s.intro}>
              <div className="eyebrow">{t.eyebrow}</div>
              <h1 className={s.title}>{t.title}</h1>
              <p className={s.lead}>{t.lead}</p>

              <a href={listingHref} className={s.property}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {l.photos[0] ? <img src={l.photos[0]} alt="" /> : <span className={s.thumbEmpty} />}
                <span>
                  <b>{l.title}</b>
                  <small>{[l.zone, l.city].filter(Boolean).join(", ")} · {formatEur(l.price, lang)}</small>
                  <em>{t.badge(reportDate(l.report!.date, lang))}</em>
                </span>
              </a>

              <ol className={s.steps}>
                {t.steps.map(([b, text]) => <li key={b}><b>{b}</b><span>{text}</span></li>)}
              </ol>
            </div>

            <ReportRequestForm listingTitle={l.title} slug={l.slug} />
          </div>
        </div>
      </main>
      <Footer />
    </AssistantProvider>
  );
}
