import Image from "next/image";
import { site } from "@/config/site";
import { unsplash } from "@/lib/icons";
import { getLang } from "@/i18n/server";
import { localize } from "@/i18n/lang";
import { AssistantButton } from "./AssistantButton";
import s from "./Process.module.css";

// Language-independent service data; type/purpose are stored Romanian values passed to the assistant.
const SERVICES: { n: string; img: string; type?: string; purpose?: string; href?: string }[] = [
  { n: "01", img: "photo-1564013799919-ab600027ffc6" },
  { n: "02", img: "photo-1582407947304-fd86f028f716", purpose: "Credit bancar" },
  { n: "03", img: "photo-1512917774080-9991f1c4c750", purpose: "Impozitare", href: "/evaluare-pentru-impozitare" },
  { n: "04", img: "photo-1554224155-6726b3ff858f", purpose: "Raportare financiară" },
  { n: "05", img: "photo-1497366216548-37526070297c", type: "Spațiu comercial" },
  { n: "06", img: "photo-1565793298595-6a879b1d9492", purpose: "Expertiză / litigiu" },
];

const DASH_STATES: ("done" | "active" | "todo")[] = ["done", "done", "done", "active", "todo"];

const T = {
  ro: {
    steps: [
      ["Spune-ne ce trebuie evaluat", "Completezi câteva informații despre proprietate."],
      ["Primești oferta", "Stabilim documentele necesare, costul și termenul."],
      ["Primești raportul", "Realizăm inspecția, analiza și raportul de evaluare."],
    ],
    howEyebrow: "Cum funcționează",
    howTitle: "De la solicitare la raport, fără complicații.",
    servicesTitle: "Servicii de evaluare",
    services: [
      ["Evaluări imobiliare", "Apartamente, case, terenuri și alte proprietăți."],
      ["Evaluări pentru creditare", "Rapoarte de evaluare pentru garantarea creditelor."],
      ["Evaluări pentru impozitare", "Evaluarea clădirilor în scop fiscal."],
      ["Raportare financiară", "Evaluarea activelor pentru raportare financiară și contabilitate."],
      ["Proprietăți comerciale", "Retail, birouri, hale, industrial și alte proprietăți specializate."],
      ["Expertize și consultanță", "Analize și servicii specializate de evaluare."],
    ],
    svcCta: "Solicită evaluare →",
    svcMore: "Detalii",
    portalEyebrow: "Portal client",
    portalTitle: "Urmărești evaluarea în timp real, din portalul client.",
    portalLead: "Fiecare client VALUEFY primește acces la un portal personal. Vezi în ce etapă e dosarul, primești livrabilele și vorbești direct cu evaluatorul — fără emailuri pierdute și fără telefoane de verificare.",
    feats: [
      ["Status pe fiecare etapă", "De la documente și programarea inspecției până la analiză, verificare și raport."],
      ["Livrabile la un clic", "Raportul semnat, anexele și facturile sunt disponibile oricând în contul tău."],
      ["Legătură directă cu evaluatorul", "Mesaje, programări și documente noi — totul în același dosar."],
    ],
    portalLink: "Vezi portalul client →",
    portalStart: "Începe o solicitare",
    dashAria: "Exemplu de interfață VALUEFY pentru urmărirea solicitării",
    dashTitle: "Apartament · Timișoara",
    dashBadge: "În lucru",
    dash: [
      ["Solicitare primită", ""],
      ["Documente încărcate", "2 fișiere"],
      ["Inspecție realizată", ""],
      ["Analiză în desfășurare", ""],
      ["Raport", ""],
    ],
    files: ["Extras CF.pdf", "Releveu.pdf"],
  },
  en: {
    steps: [
      ["Tell us what needs valuing", "Fill in a few details about the property."],
      ["Receive a quote", "We set out the documents needed, the cost and the timeframe."],
      ["Receive the report", "We carry out the inspection, the analysis and the valuation report."],
    ],
    howEyebrow: "How it works",
    howTitle: "From request to report, without the hassle.",
    servicesTitle: "Valuation services",
    services: [
      ["Property valuations", "Apartments, houses, land and other properties."],
      ["Valuations for lending", "Valuation reports to secure loans."],
      ["Valuations for taxation", "Building valuations for tax purposes."],
      ["Financial reporting", "Asset valuations for financial reporting and accounting."],
      ["Commercial properties", "Retail, offices, warehouses, industrial and other specialised properties."],
      ["Expert reports and consultancy", "Specialised valuation analyses and services."],
    ],
    svcCta: "Request a valuation →",
    svcMore: "Details",
    portalEyebrow: "Client portal",
    portalTitle: "Follow your valuation in real time, in the client portal.",
    portalLead: "Every VALUEFY client gets access to a personal portal. See which stage your file is at, receive the deliverables and talk directly to the valuer — no lost emails and no follow-up calls.",
    feats: [
      ["Status at every stage", "From documents and scheduling the inspection to analysis, review and the report."],
      ["Deliverables in one click", "The signed report, appendices and invoices are available in your account at any time."],
      ["A direct line to the valuer", "Messages, appointments and new documents — all in the same file."],
    ],
    portalLink: "View the client portal →",
    portalStart: "Start a request",
    dashAria: "Example of the VALUEFY interface for tracking a request",
    dashTitle: "Apartment · Timișoara",
    dashBadge: "In progress",
    dash: [
      ["Request received", ""],
      ["Documents uploaded", "2 files"],
      ["Inspection completed", ""],
      ["Analysis under way", ""],
      ["Report", ""],
    ],
    files: ["Land registry extract.pdf", "Floor plan.pdf"],
  },
};

export function HowItWorks() {
  const t = T[getLang()];
  return (
    <section id="cum-functioneaza" aria-labelledby="how-title" className={`anchor ${s.how}`}>
      <div className={`container ${s.howInner}`}>
        <div className={s.howHead}>
          <div className="eyebrow">{t.howEyebrow}</div>
          <h2 id="how-title" className="h2">{t.howTitle}</h2>
        </div>
        <div className={s.stepsWrap}>
          <div aria-hidden="true" className={s.line} />
          <div aria-hidden="true" className={`${s.line} ${s.lineFill}`} />
          <ol className={s.steps}>
            {t.steps.map(([title, d], i) => {
              const n = String(i + 1).padStart(2, "0");
              return (
                <li key={n}>
                  <div className={s.stepN}>{n}</div>
                  <h3>{title}</h3>
                  <p>{d}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const lang = getLang();
  const t = T[lang];
  return (
    <section id="servicii" aria-labelledby="serv-title" className={`container anchor ${s.services}`}>
      <h2 id="serv-title" className="h2">{t.servicesTitle}</h2>
      <div className={s.svcGrid}>
        {SERVICES.map((sv, i) => {
          const [title, d] = t.services[i];
          const href = sv.href && localize(lang, sv.href);
          return (
            <article key={sv.n} className={s.svc}>
              <div className={s.svcImg}>
                <Image src={unsplash(sv.img, 800)} alt={title} fill sizes="(max-width: 720px) 100vw, 420px" />
                <span className={s.svcN}>{sv.n}</span>
              </div>
              <div className={s.svcBody}>
                <h3>{href ? <a href={href}>{title}</a> : title}</h3>
                <p>{d}</p>
                <div className={s.svcActions}>
                  <AssistantButton type_={sv.type} purpose={sv.purpose} className={s.svcCta}>{t.svcCta}</AssistantButton>
                  {href && <a href={href} className={s.svcMore}>{t.svcMore}</a>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function PortalShowcase() {
  const lang = getLang();
  const t = T[lang];
  return (
    <section aria-labelledby="tech-title" className={s.portal}>
      <Image src={unsplash("photo-1486406146926-c627a92ad1ab", 1800)} alt="" aria-hidden="true" fill sizes="100vw" className={s.portalBg} />
      <div aria-hidden="true" className={s.portalShade} />
      <div aria-hidden="true" className={s.portalGlow} />
      <div className={s.portalInner}>
        <div className={s.portalCopy}>
          <div className={s.portalEyebrow}>{t.portalEyebrow}</div>
          <h2 id="tech-title">{t.portalTitle}</h2>
          <p>{t.portalLead}</p>
          <ul className={s.feats}>
            {t.feats.map(([title, d], i) => {
              const n = String(i + 1).padStart(2, "0");
              return (
                <li key={n}>
                  <span className={s.featN}>{n}</span>
                  <span className={s.featText}><b>{title}</b><span>{d}</span></span>
                </li>
              );
            })}
          </ul>
          <div className={s.portalActions}>
            <a href={localize(lang, site.portalUrl)} className={s.portalLink}>{t.portalLink}</a>
            <AssistantButton className={s.portalStart}>{t.portalStart}</AssistantButton>
          </div>
        </div>

        <div data-rv role="img" aria-label={t.dashAria} className={s.dash}>
          <div className={s.dashBar}>
            <span /><span /><span />
            <em>portal.valuefy.ro</em>
          </div>
          <div className={s.dashBody}>
            <div className={s.dashHead}>
              <div>
                <div className={s.dashId}>VF-2417</div>
                <div className={s.dashTitle}>{t.dashTitle}</div>
              </div>
              <span className={s.dashBadge}>{t.dashBadge}</span>
            </div>
            <div className={s.dashProgress}>
              <span className={s.on} /><span className={s.on} /><span className={s.on} />
              <span className={s.shimmer}><span /></span><span />
            </div>
            <ul className={s.dashList}>
              {t.dash.map(([label, meta], i) => {
                const k = DASH_STATES[i];
                return (
                  <li key={label} className={k === "active" ? s.dashActive : undefined}>
                    <span className={`${s.dashDot} ${s["dot_" + k]}`}>{k === "done" ? "✓" : ""}</span>
                    <span className={s.dashLabel} style={{ color: k === "todo" ? "#8A8BA8" : "#F4F5F7" }}>{label}</span>
                    <span className={s.dashMeta}>{meta}</span>
                  </li>
                );
              })}
            </ul>
            <div className={s.dashFiles}>
              {t.files.map((f) => (
                <div key={f}><span /><em>{f}</em></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
