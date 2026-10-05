import Image from "next/image";
import { site, phoneHref } from "@/config/site";
import { unsplash } from "@/lib/icons";
import { getLang } from "@/i18n/server";
import { localize } from "@/i18n/lang";
import { AssistantButton } from "./AssistantButton";
import s from "./Closing.module.css";

const T = {
  ro: {
    ctaTitle: "Ai nevoie de o evaluare?",
    ctaText: "Spune-ne câteva lucruri despre proprietate. Durează doar câteva minute.",
    ctaBtn: "Începe solicitarea →",
    tagline: "Servicii profesionale de evaluare imobiliară.",
    cols: [
      {
        t: "SERVICII",
        links: [["Evaluări imobiliare", "/#servicii"], ["Creditare", "/#servicii"], ["Impozitare", "/evaluare-pentru-impozitare"], ["Eșalonare ANAF", "/evaluare-esalonare-anaf"], ["Raportare financiară", "/#servicii"], ["Proprietăți comerciale", "/#servicii"], ["Bunuri mobile", "/evaluare-bunuri-mobile"]],
      },
      {
        t: "COMPANIE",
        links: [["Portal client", site.portalUrl], ["Portal Imobiliar", "/imobiliare"], ["Despre noi", "/#despre"], ["Contact", "/#contact"], ["Întrebări frecvente", "/#faq"]],
      },
      {
        t: "LEGAL",
        links: [["Politica de confidențialitate", "/politica-de-confidentialitate"], ["Politica cookies", "/politica-cookies"], ["Termeni și condiții", "/termeni-si-conditii"]],
      },
    ],
  },
  en: {
    ctaTitle: "Need a valuation?",
    ctaText: "Tell us a few things about the property. It only takes a few minutes.",
    ctaBtn: "Start your request →",
    tagline: "Professional property valuation services.",
    cols: [
      {
        t: "SERVICES",
        links: [["Property valuations", "/#servicii"], ["Lending", "/#servicii"], ["Taxation", "/evaluare-pentru-impozitare"], ["ANAF instalment plans", "/evaluare-esalonare-anaf"], ["Financial reporting", "/#servicii"], ["Commercial properties", "/#servicii"], ["Movable assets", "/evaluare-bunuri-mobile"]],
      },
      {
        t: "COMPANY",
        links: [["Client portal", site.portalUrl], ["Real Estate Portal", "/imobiliare"], ["About us", "/#despre"], ["Contact", "/#contact"], ["FAQ", "/#faq"]],
      },
      {
        t: "LEGAL",
        links: [["Privacy policy", "/politica-de-confidentialitate"], ["Cookie policy", "/politica-cookies"], ["Terms and conditions", "/termeni-si-conditii"]],
      },
    ],
  },
};

export function FinalCta() {
  const t = T[getLang()];
  return (
    <section id="contact" aria-labelledby="cta-title" className={`anchor ${s.ctaSection}`}>
      <div className={s.cta}>
        <Image src={unsplash("photo-1449824913935-59a10b8d2000", 1800)} alt="" aria-hidden="true" fill sizes="100vw" className={s.ctaBg} />
        <div aria-hidden="true" className={s.ctaShade} />
        <div aria-hidden="true" className={s.ctaDots} />
        <div aria-hidden="true" className={s.ctaGlow} />
        <h2 id="cta-title">{t.ctaTitle}</h2>
        <p>{t.ctaText}</p>
        <div className={s.ctaActions}>
          <AssistantButton className={s.ctaBtn}>{t.ctaBtn}</AssistantButton>
        </div>
        <div className={s.ctaContact}>
          <a href={phoneHref(site.phone)}>{site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const lang = getLang();
  const t = T[lang];
  return (
    <footer className={`container ${s.footer}`}>
      <div className={s.cols}>
        <div className={s.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/valuefy-logo.png" alt="VALUEFY" width={117} height={24} loading="lazy" />
          <p>{t.tagline}</p>
          <div className={s.brandContact}>
            <a href={phoneHref(site.phone)}>{site.phone}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
        {t.cols.map((col) => (
          <nav key={col.t} aria-label={col.t} className={s.col}>
            <div className={s.colTitle}>{col.t}</div>
            {col.links.map(([label, href]) => (
              <a key={label} href={localize(lang, href)}>{label}</a>
            ))}
          </nav>
        ))}
      </div>
      <div className={s.bottom}>
        <span>© {new Date().getFullYear()} VALUEFY</span>
        <div>
          <a href="https://anpc.ro/ce-este-sal/" rel="noopener">ANPC – SAL</a>
          <a href="https://ec.europa.eu/consumers/odr" rel="noopener">SOL</a>
        </div>
      </div>
    </footer>
  );
}
