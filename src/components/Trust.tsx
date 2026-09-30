import Image from "next/image";
import { site } from "@/config/site";
import { ICONS, svg, unsplash } from "@/lib/icons";
import { getLang } from "@/i18n/server";
import s from "./Trust.module.css";

const MOSAIC_IMG = ["photo-1600596542815-ffad4c1539a9", "photo-1554224155-6726b3ff858f", "photo-1560448204-e02f11c3d0e2"];
const TRUST_ICONS = [ICONS.badge, ICONS.std, ICONS.eye, ICONS.lock];
const CLIENT_ICONS = [
  '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/>',
  '<path d="M4 19l5-6 4 3 7-9"/><path d="M15 7h5v5"/>',
  '<path d="M3 21h18"/><path d="M6 21V9l6-5 6 5v12"/><path d="M10 21v-5h4v5"/>',
  '<path d="M3 10l9-6 9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 21h18"/>',
  '<path d="M12 4v16M7 20h10"/><path d="M5 8h14"/><path d="M5 8l-3 6a3 3 0 006 0zM19 8l-3 6a3 3 0 006 0z"/>',
];
const OFFICE_CODES = ["TM", "CJ"];

const T = {
  ro: {
    title: "Evaluări realizate cu rigoare profesională.",
    anevarEyebrow: "AUTORIZARE PROFESIONALĂ",
    anevarTitle: "Firmă autorizată ANEVAR",
    anevarNo: "Autorizație nr.",
    anevarText: "VALUEFY este firmă de evaluare autorizată de Asociația Națională a Evaluatorilor Autorizați din România (ANEVAR). Rapoartele sunt întocmite de evaluatori autorizați, conform Standardelor de Evaluare ANEVAR, și pot fi folosite în relația cu băncile, instanțele și autoritățile.",
    tags: ["Evaluatori autorizați", "Standarde SEV", "Verificare internă a rapoartelor"],
    mosaic: ["Inspecție la fața locului", "Analiză documentară și de piață", "Raport semnat, gata de depus"],
    trust: [
      ["Evaluator autorizat", "Servicii de evaluare realizate de profesioniști autorizați."],
      ["Standarde profesionale", "Rapoarte realizate conform standardelor de evaluare aplicabile."],
      ["Proces transparent", "Știi ce informații sunt necesare și care sunt etapele evaluării."],
      ["Date protejate", "Documentele și informațiile clienților sunt tratate în mod responsabil."],
    ],
    covEyebrow: "Acoperire națională",
    covTitle: "Evaluăm oriunde în România.",
    covText: "Birourile din Timișoara și Cluj-Napoca coordonează fiecare dosar. În restul țării lucrăm printr-o rețea de evaluatori colaboratori autorizați ANEVAR, cu același proces și același standard de calitate.",
    offices: [
      ["Timișoara", "Sediu central · Vestul României"],
      ["Cluj-Napoca", "Birou regional · Transilvania și Nord-Vest"],
    ],
    network: "Rețea de colaboratori",
    networkSub: "Evaluatori autorizați în toate regiunile țării",
    mapAlt: "Harta acoperirii VALUEFY în România: birouri în Timișoara și Cluj-Napoca, colaboratori în restul țării",
    legendOffice: "Birou VALUEFY",
    legendPartner: "Colaborator",
    clientsEyebrow: "Pentru cine lucrăm",
    clientsTitle: "Aceeași rigoare, pentru fiecare tip de client.",
    clientsLead: "De la proprietarul unui apartament la bănci și dezvoltatori — adaptăm raportul la scopul tău, nu invers.",
    clients: [
      ["Persoane fizice", "Credite ipotecare, vânzare-cumpărare, succesiuni și partaje."],
      ["Companii", "Garanții bancare, reevaluări și raportare financiară."],
      ["Investitori", "Analiza valorii înainte de achiziție sau vânzare."],
      ["Dezvoltatori", "Terenuri, proiecte în dezvoltare și finanțare."],
      ["Instituții financiare", "Rapoarte pentru garantarea creditelor, conform cerințelor băncii."],
      ["Juriști și contabili", "Expertize, litigii și evaluări pentru raportare."],
    ],
  },
  en: {
    title: "Valuations carried out with professional rigour.",
    anevarEyebrow: "PROFESSIONAL AUTHORISATION",
    anevarTitle: "ANEVAR-authorised firm",
    anevarNo: "Authorisation no.",
    anevarText: "VALUEFY is a valuation firm authorised by the National Association of Authorised Romanian Valuers (ANEVAR). Our reports are prepared by authorised valuers in line with the ANEVAR Valuation Standards and can be used with banks, courts and public authorities.",
    tags: ["Authorised valuers", "SEV standards", "Internal report review"],
    mosaic: ["On-site inspection", "Document and market analysis", "Signed report, ready to submit"],
    trust: [
      ["Authorised valuer", "Valuation services carried out by authorised professionals."],
      ["Professional standards", "Reports prepared in line with the applicable valuation standards."],
      ["Transparent process", "You know what information is needed and what the stages of the valuation are."],
      ["Protected data", "Clients' documents and information are handled responsibly."],
    ],
    covEyebrow: "Nationwide coverage",
    covTitle: "We carry out valuations anywhere in Romania.",
    covText: "Our offices in Timișoara and Cluj-Napoca coordinate every file. Across the rest of the country we work through a network of ANEVAR-authorised partner valuers, with the same process and the same quality standard.",
    offices: [
      ["Timișoara", "Head office · Western Romania"],
      ["Cluj-Napoca", "Regional office · Transylvania and the North-West"],
    ],
    network: "Partner network",
    networkSub: "Authorised valuers in every region of the country",
    mapAlt: "Map of VALUEFY coverage in Romania: offices in Timișoara and Cluj-Napoca, partner valuers across the rest of the country",
    legendOffice: "VALUEFY office",
    legendPartner: "Partner",
    clientsEyebrow: "Who we work for",
    clientsTitle: "The same rigour, for every type of client.",
    clientsLead: "From apartment owners to banks and developers — we tailor the report to your purpose, not the other way round.",
    clients: [
      ["Individuals", "Mortgages, sales and purchases, inheritance and division of property."],
      ["Companies", "Bank collateral, revaluations and financial reporting."],
      ["Investors", "Value analysis before a purchase or sale."],
      ["Developers", "Land, projects under development and financing."],
      ["Financial institutions", "Reports to secure loans, in line with the bank's requirements."],
      ["Lawyers and accountants", "Expert reports, litigation and valuations for reporting."],
    ],
  },
};

export function Trust() {
  const t = T[getLang()];
  return (
    <section id="despre" aria-labelledby="trust-title" className={`container anchor ${s.trust}`}>
      <h2 id="trust-title" className={`h2 ${s.title}`}>{t.title}</h2>

      <div data-rv className={s.anevar}>
        <div aria-hidden="true" className={s.anevarGlow} />
        <div className={s.anevarLeft}>
          <span className={s.seal} aria-hidden="true"><b>✓</b><small>ANEVAR</small></span>
          <div className={s.anevarName}>
            <span className={s.anevarEyebrow}>{t.anevarEyebrow}</span>
            <span className={s.anevarTitle}>{t.anevarTitle}</span>
            {site.anevarNo && <span className={s.anevarNo}>{t.anevarNo} {site.anevarNo}</span>}
          </div>
        </div>
        <div className={s.anevarRight}>
          <p>{t.anevarText}</p>
          <div className={s.tags}>
            {t.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </div>

      <div data-rv className={s.mosaic}>
        {t.mosaic.map((caption, i) => {
          const n = String(i + 1).padStart(2, "0");
          return (
            <figure key={n}>
              <Image src={unsplash(MOSAIC_IMG[i], 900)} alt={caption} fill sizes="(max-width: 720px) 100vw, 400px" />
              <div className={s.mosaicShade} />
              <figcaption><span>{n}</span><b>{caption}</b></figcaption>
            </figure>
          );
        })}
      </div>

      <div className={s.cards}>
        {t.trust.map(([title, d], i) => (
          <div data-rv key={title} className={s.card}>
            <div className={s.cardIcon}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={TRUST_ICONS[i]} alt="" width={20} height={20} />
            </div>
            <h3>{title}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Coverage() {
  const t = T[getLang()];
  return (
    <section id="acoperire" aria-labelledby="cov-title" className={`anchor ${s.coverage}`}>
      <div className={`container ${s.coverageInner}`}>
        <div className={s.coverageCopy}>
          <div className="eyebrow">{t.covEyebrow}</div>
          <h2 id="cov-title" className="h2">{t.covTitle}</h2>
          <p>{t.covText}</p>
          <div className={s.offices}>
            {t.offices.map(([city, d], i) => (
              <div key={city} className={s.office}>
                <span className={s.officeCode}>{OFFICE_CODES[i]}</span>
                <span className={s.officeText}><b>{city}</b><span>{d}</span></span>
              </div>
            ))}
            <div className={`${s.office} ${s.officeNetwork}`}>
              <span className={s.networkIcon} aria-hidden="true"><span /></span>
              <span className={s.officeText}><b>{t.network}</b><span>{t.networkSub}</span></span>
            </div>
          </div>
        </div>
        <div data-rv className={s.map}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/romania-map.svg" alt={t.mapAlt} loading="lazy" />
          <div className={s.legend} aria-hidden="true">
            <span><i className={s.legendOffice} />{t.legendOffice}</span>
            <span><i className={s.legendPartner} />{t.legendPartner}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Clients() {
  const t = T[getLang()];
  return (
    <section aria-labelledby="clients-title" className={s.clients}>
      <div className={`container ${s.clientsInner}`}>
        <div className={s.clientsHead}>
          <div className={s.clientsTitle}>
            <div className="eyebrow">{t.clientsEyebrow}</div>
            <h2 id="clients-title" className="h2">{t.clientsTitle}</h2>
          </div>
          <p>{t.clientsLead}</p>
        </div>
        <ul data-rv className={s.clientGrid}>
          {t.clients.map(([title, d], i) => (
            <li key={title}>
              <span className={s.clientIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={svg(CLIENT_ICONS[i], "#F2A93B")} alt="" width={26} height={26} />
              </span>
              <span className={s.clientText}><b>{title}</b><span>{d}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
