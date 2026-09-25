import Image from "next/image";
import { site } from "@/config/site";
import { unsplash } from "@/lib/icons";
import { AssistantButton } from "./AssistantButton";
import s from "./Process.module.css";

const STEPS = [
  { n: "01", t: "Spune-ne ce trebuie evaluat", d: "Completezi câteva informații despre proprietate." },
  { n: "02", t: "Primești oferta", d: "Stabilim documentele necesare, costul și termenul." },
  { n: "03", t: "Primești raportul", d: "Realizăm inspecția, analiza și raportul de evaluare." },
];

const SERVICES: { n: string; t: string; d: string; img: string; type?: string; purpose?: string }[] = [
  { n: "01", t: "Evaluări imobiliare", d: "Apartamente, case, terenuri și alte proprietăți.", img: "photo-1564013799919-ab600027ffc6" },
  { n: "02", t: "Evaluări pentru creditare", d: "Rapoarte de evaluare pentru garantarea creditelor.", img: "photo-1582407947304-fd86f028f716", purpose: "Credit bancar" },
  { n: "03", t: "Evaluări pentru impozitare", d: "Evaluarea clădirilor în scop fiscal.", img: "photo-1512917774080-9991f1c4c750", purpose: "Impozitare" },
  { n: "04", t: "Raportare financiară", d: "Evaluarea activelor pentru raportare financiară și contabilitate.", img: "photo-1554224155-6726b3ff858f", purpose: "Raportare financiară" },
  { n: "05", t: "Proprietăți comerciale", d: "Retail, birouri, hale, industrial și alte proprietăți specializate.", img: "photo-1497366216548-37526070297c", type: "Spațiu comercial" },
  { n: "06", t: "Expertize și consultanță", d: "Analize și servicii specializate de evaluare.", img: "photo-1565793298595-6a879b1d9492", purpose: "Expertiză / litigiu" },
];

const PORTAL_FEATS = [
  ["01", "Status pe fiecare etapă", "De la documente și programarea inspecției până la analiză, verificare și raport."],
  ["02", "Livrabile la un clic", "Raportul semnat, anexele și facturile sunt disponibile oricând în contul tău."],
  ["03", "Legătură directă cu evaluatorul", "Mesaje, programări și documente noi — totul în același dosar."],
];

const DASH: [string, "done" | "active" | "todo", string][] = [
  ["Solicitare primită", "done", ""],
  ["Documente încărcate", "done", "2 fișiere"],
  ["Inspecție realizată", "done", ""],
  ["Analiză în desfășurare", "active", ""],
  ["Raport", "todo", ""],
];

export function HowItWorks() {
  return (
    <section id="cum-functioneaza" aria-labelledby="how-title" className={`anchor ${s.how}`}>
      <div className={`container ${s.howInner}`}>
        <div className={s.howHead}>
          <div className="eyebrow">Cum funcționează</div>
          <h2 id="how-title" className="h2">De la solicitare la raport, fără complicații.</h2>
        </div>
        <div className={s.stepsWrap}>
          <div aria-hidden="true" className={s.line} />
          <div aria-hidden="true" className={`${s.line} ${s.lineFill}`} />
          <ol className={s.steps}>
            {STEPS.map((st) => (
              <li key={st.n}>
                <div className={s.stepN}>{st.n}</div>
                <h3>{st.t}</h3>
                <p>{st.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="servicii" aria-labelledby="serv-title" className={`container anchor ${s.services}`}>
      <h2 id="serv-title" className="h2">Servicii de evaluare</h2>
      <div className={s.svcGrid}>
        {SERVICES.map((sv) => (
          <article key={sv.n} className={s.svc}>
            <div className={s.svcImg}>
              <Image src={unsplash(sv.img, 800)} alt={sv.t} fill sizes="(max-width: 720px) 100vw, 420px" />
              <span className={s.svcN}>{sv.n}</span>
            </div>
            <div className={s.svcBody}>
              <h3>{sv.t}</h3>
              <p>{sv.d}</p>
              <AssistantButton type_={sv.type} purpose={sv.purpose} className={s.svcCta}>Solicită evaluare →</AssistantButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PortalShowcase() {
  return (
    <section aria-labelledby="tech-title" className={s.portal}>
      <Image src={unsplash("photo-1486406146926-c627a92ad1ab", 1800)} alt="" aria-hidden="true" fill sizes="100vw" className={s.portalBg} />
      <div aria-hidden="true" className={s.portalShade} />
      <div aria-hidden="true" className={s.portalGlow} />
      <div className={s.portalInner}>
        <div className={s.portalCopy}>
          <div className={s.portalEyebrow}>Portal client</div>
          <h2 id="tech-title">Urmărești evaluarea în timp real, din portalul client.</h2>
          <p>
            Fiecare client VALUEFY primește acces la un portal personal. Vezi în ce etapă e dosarul, primești livrabilele și vorbești direct cu evaluatorul — fără emailuri pierdute și fără telefoane de verificare.
          </p>
          <ul className={s.feats}>
            {PORTAL_FEATS.map(([n, t, d]) => (
              <li key={n}>
                <span className={s.featN}>{n}</span>
                <span className={s.featText}><b>{t}</b><span>{d}</span></span>
              </li>
            ))}
          </ul>
          <div className={s.portalActions}>
            <a href={site.portalUrl} className={s.portalLink}>Vezi portalul client →</a>
            <AssistantButton className={s.portalStart}>Începe o solicitare</AssistantButton>
          </div>
        </div>

        <div data-rv role="img" aria-label="Exemplu de interfață VALUEFY pentru urmărirea solicitării" className={s.dash}>
          <div className={s.dashBar}>
            <span /><span /><span />
            <em>portal.valuefy.ro</em>
          </div>
          <div className={s.dashBody}>
            <div className={s.dashHead}>
              <div>
                <div className={s.dashId}>VF-2417</div>
                <div className={s.dashTitle}>Apartament · Timișoara</div>
              </div>
              <span className={s.dashBadge}>În lucru</span>
            </div>
            <div className={s.dashProgress}>
              <span className={s.on} /><span className={s.on} /><span className={s.on} />
              <span className={s.shimmer}><span /></span><span />
            </div>
            <ul className={s.dashList}>
              {DASH.map(([label, k, meta]) => (
                <li key={label} className={k === "active" ? s.dashActive : undefined}>
                  <span className={`${s.dashDot} ${s["dot_" + k]}`}>{k === "done" ? "✓" : ""}</span>
                  <span className={s.dashLabel} style={{ color: k === "todo" ? "#8A8BA8" : "#F4F5F7" }}>{label}</span>
                  <span className={s.dashMeta}>{meta}</span>
                </li>
              ))}
            </ul>
            <div className={s.dashFiles}>
              <div><span /><em>Extras CF.pdf</em></div>
              <div><span /><em>Releveu.pdf</em></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
