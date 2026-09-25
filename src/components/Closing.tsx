import Image from "next/image";
import { site, phoneHref } from "@/config/site";
import { unsplash } from "@/lib/icons";
import { AssistantButton } from "./AssistantButton";
import s from "./Closing.module.css";

const FOOTER_COLS = [
  {
    t: "SERVICII",
    links: [["Evaluări imobiliare", "/#servicii"], ["Creditare", "/#servicii"], ["Impozitare", "/evaluare-pentru-impozitare"], ["Raportare financiară", "/#servicii"], ["Proprietăți comerciale", "/#servicii"]],
  },
  {
    t: "COMPANIE",
    links: [["Portal client", site.portalUrl], ["Despre noi", "/#despre"], ["Contact", "/#contact"], ["Întrebări frecvente", "/#faq"]],
  },
  {
    t: "LEGAL",
    links: [["Politica de confidențialitate", "/politica-de-confidentialitate"], ["Politica cookies", "/politica-cookies"], ["Termeni și condiții", "/termeni-si-conditii"]],
  },
];

export function FinalCta() {
  return (
    <section id="contact" aria-labelledby="cta-title" className={`anchor ${s.ctaSection}`}>
      <div className={s.cta}>
        <Image src={unsplash("photo-1449824913935-59a10b8d2000", 1800)} alt="" aria-hidden="true" fill sizes="100vw" className={s.ctaBg} />
        <div aria-hidden="true" className={s.ctaShade} />
        <div aria-hidden="true" className={s.ctaDots} />
        <div aria-hidden="true" className={s.ctaGlow} />
        <h2 id="cta-title">Ai nevoie de o evaluare?</h2>
        <p>Spune-ne câteva lucruri despre proprietate. Durează doar câteva minute.</p>
        <div className={s.ctaActions}>
          <AssistantButton className={s.ctaBtn}>Începe solicitarea →</AssistantButton>
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
  return (
    <footer className={`container ${s.footer}`}>
      <div className={s.cols}>
        <div className={s.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/valuefy-logo.png" alt="VALUEFY" width={117} height={24} loading="lazy" />
          <p>Servicii profesionale de evaluare imobiliară.</p>
          <div className={s.brandContact}>
            <a href={phoneHref(site.phone)}>{site.phone}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
        {FOOTER_COLS.map((col) => (
          <nav key={col.t} aria-label={col.t} className={s.col}>
            <div className={s.colTitle}>{col.t}</div>
            {col.links.map(([label, href]) => (
              <a key={label} href={href}>{label}</a>
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
