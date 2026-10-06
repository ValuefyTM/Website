import type { Metadata } from "next";
import { AssistantProvider } from "@/components/Assistant";
import { site, phoneHref } from "@/config/site";
import { localize, type Lang } from "@/i18n/lang";
import { MOBILE } from "@/lib/lead";
import s from "./Order.module.css";

// /comanda — a link to send to clients: the website's valuation assistant as a page of its own.
// Optional presets: ?tip=apartament&scop=credit (see TYPE and PURPOSE below).

const TYPE: Record<string, string> = {
  apartament: "Apartament", casa: "Casă", teren: "Teren", "spatiu-comercial": "Spațiu comercial", hala: "Hală / industrial",
  alta: "Altă proprietate", "bunuri-mobile": MOBILE,
};
const PURPOSE: Record<string, string> = {
  credit: "Credit bancar", vanzare: "Vânzare / cumpărare", impozitare: "Impozitare", raportare: "Raportare financiară",
  succesiune: "Succesiune / partaj", expertiza: "Expertiză / litigiu", anaf: "Garanție eșalonare ANAF", alt: "Alt scop",
};

const T = {
  ro: {
    title: "Comandă o evaluare | VALUEFY",
    description: "Spune-ne ce dorești să evaluezi și primești oferta VALUEFY. Firmă autorizată ANEVAR.",
    eyebrow: "Solicitare evaluare",
    h1: "Comandă o evaluare",
    lead: "Asistentul VALUEFY te întreabă doar ce e nevoie pentru ofertă. Durează câteva minute, iar documentele le poți trimite și mai târziu.",
    steps: [
      ["Spune-ne ce evaluezi", "Tipul proprietății, localitatea, scopul și termenul."],
      ["Primești oferta", "Un evaluator verifică solicitarea și îți trimite tariful și termenul."],
      ["Programăm inspecția", "După acceptare, stabilim împreună vizita și documentele."],
    ],
    trust: "Firmă autorizată ANEVAR",
    help: "Preferi să vorbim?",
    home: "Înapoi la valuefy.ro",
    terms: "Termeni și condiții",
    privacy: "Confidențialitate",
  },
  en: {
    title: "Order a valuation | VALUEFY",
    description: "Tell us what you need valued and receive a VALUEFY offer. ANEVAR-authorised firm.",
    eyebrow: "Valuation request",
    h1: "Order a valuation",
    lead: "The VALUEFY assistant only asks what it needs for the offer. It takes a few minutes, and you can send the documents later.",
    steps: [
      ["Tell us what to value", "Property type, location, purpose and deadline."],
      ["Receive the offer", "A valuer reviews the request and sends you the fee and timeline."],
      ["We schedule the inspection", "Once accepted, we agree the visit and the documents together."],
    ],
    trust: "ANEVAR-authorised firm",
    help: "Prefer to talk?",
    home: "Back to valuefy.ro",
    terms: "Terms and conditions",
    privacy: "Privacy",
  },
};

export function orderMetadata(lang: Lang): Metadata {
  const t = T[lang];
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: localize(lang, "/comanda"), languages: { ro: "/comanda", en: localize("en", "/comanda") } },
    openGraph: { title: t.title, description: t.description, url: localize(lang, "/comanda"), siteName: site.name, type: "website", images: ["/opengraph-image.png"] },
  };
}

export function OrderView({ lang, tip, scop }: { lang: Lang; tip?: string; scop?: string }) {
  const t = T[lang];
  const start = { type: tip ? TYPE[tip] : undefined, purpose: scop ? PURPOSE[scop] : undefined };
  return (
    <div className={s.page}>
      <header className={s.bar}>
        <a href={localize(lang, "/")} className={s.logo} aria-label={t.home}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/valuefy-logo.png" alt="VALUEFY" />
        </a>
        <a href={phoneHref(site.phone)} className={s.phone}>{site.phone}</a>
      </header>

      <main className={s.main}>
        <section className={s.intro} aria-labelledby="order-title">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 id="order-title">{t.h1}</h1>
          <p className={s.lead}>{t.lead}</p>
          <ol className={s.steps}>
            {t.steps.map(([h, p]) => <li key={h}><b>{h}</b><span>{p}</span></li>)}
          </ol>
          <div className={s.trust}>
            <span className={s.badge}>✓ {t.trust}{site.anevarNo ? ` · ${site.anevarNo}` : ""}</span>
            <span>{t.help} <a href={phoneHref(site.phone)}>{site.phone}</a> · <a href={`mailto:${site.email}`}>{site.email}</a></span>
          </div>
        </section>
        <div className={s.chat}>
          <AssistantProvider embedded start={start} />
        </div>
      </main>

      <footer className={s.foot}>
        <span>© {new Date().getFullYear()} {site.legalName}</span>
        <a href={localize(lang, "/termeni-si-conditii")}>{t.terms}</a>
        <a href={localize(lang, "/politica-de-confidentialitate")}>{t.privacy}</a>
      </footer>
    </div>
  );
}
