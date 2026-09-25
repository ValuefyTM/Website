import Image from "next/image";
import { site } from "@/config/site";
import { ICONS, svg, unsplash } from "@/lib/icons";
import s from "./Trust.module.css";

const MOSAIC = [
  ["01", "Inspecție la fața locului", "photo-1600596542815-ffad4c1539a9"],
  ["02", "Analiză documentară și de piață", "photo-1554224155-6726b3ff858f"],
  ["03", "Raport semnat, gata de depus", "photo-1560448204-e02f11c3d0e2"],
];

const TRUST = [
  [ICONS.badge, "Evaluator autorizat", "Servicii de evaluare realizate de profesioniști autorizați."],
  [ICONS.std, "Standarde profesionale", "Rapoarte realizate conform standardelor de evaluare aplicabile."],
  [ICONS.eye, "Proces transparent", "Știi ce informații sunt necesare și care sunt etapele evaluării."],
  [ICONS.lock, "Date protejate", "Documentele și informațiile clienților sunt tratate în mod responsabil."],
];

const CLIENTS = [
  ["Persoane fizice", "Credite ipotecare, vânzare-cumpărare, succesiuni și partaje.", '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'],
  ["Companii", "Garanții bancare, reevaluări și raportare financiară.", '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2"/>'],
  ["Investitori", "Analiza valorii înainte de achiziție sau vânzare.", '<path d="M4 19l5-6 4 3 7-9"/><path d="M15 7h5v5"/>'],
  ["Dezvoltatori", "Terenuri, proiecte în dezvoltare și finanțare.", '<path d="M3 21h18"/><path d="M6 21V9l6-5 6 5v12"/><path d="M10 21v-5h4v5"/>'],
  ["Instituții financiare", "Rapoarte pentru garantarea creditelor, conform cerințelor băncii.", '<path d="M3 10l9-6 9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8"/><path d="M3 21h18"/>'],
  ["Juriști și contabili", "Expertize, litigii și evaluări pentru raportare.", '<path d="M12 4v16M7 20h10"/><path d="M5 8h14"/><path d="M5 8l-3 6a3 3 0 006 0zM19 8l-3 6a3 3 0 006 0z"/>'],
];

export function Trust() {
  return (
    <section id="despre" aria-labelledby="trust-title" className={`container anchor ${s.trust}`}>
      <h2 id="trust-title" className={`h2 ${s.title}`}>Evaluări realizate cu rigoare profesională.</h2>

      <div data-rv className={s.anevar}>
        <div aria-hidden="true" className={s.anevarGlow} />
        <div className={s.anevarLeft}>
          <span className={s.seal} aria-hidden="true"><b>✓</b><small>ANEVAR</small></span>
          <div className={s.anevarName}>
            <span className={s.anevarEyebrow}>AUTORIZARE PROFESIONALĂ</span>
            <span className={s.anevarTitle}>Firmă autorizată ANEVAR</span>
            {site.anevarNo && <span className={s.anevarNo}>Autorizație nr. {site.anevarNo}</span>}
          </div>
        </div>
        <div className={s.anevarRight}>
          <p>
            VALUEFY este firmă de evaluare autorizată de Asociația Națională a Evaluatorilor Autorizați din România (ANEVAR). Rapoartele sunt întocmite de evaluatori autorizați, conform Standardelor de Evaluare ANEVAR, și pot fi folosite în relația cu băncile, instanțele și autoritățile.
          </p>
          <div className={s.tags}>
            <span>Evaluatori autorizați</span><span>Standarde SEV</span><span>Verificare internă a rapoartelor</span>
          </div>
        </div>
      </div>

      <div data-rv className={s.mosaic}>
        {MOSAIC.map(([n, t, id]) => (
          <figure key={n}>
            <Image src={unsplash(id, 900)} alt={t} fill sizes="(max-width: 720px) 100vw, 400px" />
            <div className={s.mosaicShade} />
            <figcaption><span>{n}</span><b>{t}</b></figcaption>
          </figure>
        ))}
      </div>

      <div className={s.cards}>
        {TRUST.map(([icon, t, d]) => (
          <div data-rv key={t} className={s.card}>
            <div className={s.cardIcon}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icon} alt="" width={20} height={20} />
            </div>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Clients() {
  return (
    <section aria-labelledby="clients-title" className={s.clients}>
      <div className={`container ${s.clientsInner}`}>
        <div className={s.clientsHead}>
          <div className={s.clientsTitle}>
            <div className="eyebrow">Pentru cine lucrăm</div>
            <h2 id="clients-title" className="h2">Aceeași rigoare, pentru fiecare tip de client.</h2>
          </div>
          <p>De la proprietarul unui apartament la bănci și dezvoltatori — adaptăm raportul la scopul tău, nu invers.</p>
        </div>
        <ul data-rv className={s.clientGrid}>
          {CLIENTS.map(([t, d, p]) => (
            <li key={t}>
              <span className={s.clientIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={svg(p, "#F2A93B")} alt="" width={26} height={26} />
              </span>
              <span className={s.clientText}><b>{t}</b><span>{d}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
