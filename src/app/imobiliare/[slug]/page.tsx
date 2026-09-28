import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site, phoneHref } from "@/config/site";
import { AssistantProvider } from "@/components/Assistant";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Closing";
import { LISTINGS, findListing, formatEur, pricePerSqm, reportDate } from "@/lib/listings";
import { ViewingForm } from "./ViewingForm";
import s from "./listing.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return LISTINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = findListing((await params).slug);
  if (!l) return {};
  return {
    title: `${l.title} | VALUEFY`,
    description: `${l.type} de vânzare în ${l.city}, ${l.zone} — ${formatEur(l.price)}.`,
    alternates: { canonical: `/imobiliare/${l.slug}` },
    robots: { index: false, follow: false }, // demo listing
  };
}

export default async function ListingPage({ params }: Props) {
  const l = findListing((await params).slug);
  if (!l) notFound();
  const ppsm = pricePerSqm(l);
  const facts: [string, string][] = [
    ["Tip", l.type],
    ...(l.surface ? ([["Suprafață utilă", `${l.surface} m²`]] as [string, string][]) : []),
    ...(l.land ? ([["Teren", `${l.land.toLocaleString("ro-RO")} m²`]] as [string, string][]) : []),
    ...(l.rooms ? ([["Camere", String(l.rooms)]] as [string, string][]) : []),
    ...(l.baths ? ([["Băi", String(l.baths)]] as [string, string][]) : []),
    ...(l.floor ? ([["Etaj", l.floor]] as [string, string][]) : []),
    ...(l.year ? ([["An construcție", String(l.year)]] as [string, string][]) : []),
    ["Localizare", `${l.zone}, ${l.city}`],
  ];
  const similar = LISTINGS.filter((x) => x.slug !== l.slug).sort((a, b) => Number(b.type === l.type) - Number(a.type === l.type)).slice(0, 3);
  const [main, ...rest] = l.photos;

  return (
    <AssistantProvider>
      <Header />
      <main id="top" className={s.page}>
        <div className="container">
          <nav aria-label="Breadcrumb" className={s.crumbs}>
            <a href="/">Acasă</a><span aria-hidden="true">/</span><a href="/imobiliare">Proprietăți de vânzare</a><span aria-hidden="true">/</span>
            <span aria-current="page">{l.city}</span>
          </nav>

          <div className={s.gallery} data-count={Math.min(l.photos.length, 3)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={main} alt={l.title} className={s.mainPhoto} />
            {rest.slice(0, 2).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt={`${l.title} — fotografia ${i + 2}`} loading="lazy" />
            ))}
          </div>

          <div className={s.layout}>
            <div className={s.content}>
              <div className={s.head}>
                <div className={s.tags}>
                  <span className={s.tag}>{l.type}</span>
                  {l.status && <span className={`${s.tag} ${s.tagAcc}`}>{l.status}</span>}
                  {l.report && <span className={`${s.tag} ${s.tagNavy}`}>✓ Raport de evaluare</span>}
                  <span className={s.tag}>Vânzare</span>
                </div>
                <h1 className={s.title}>{l.title}</h1>
                <p className={s.loc}>{l.zone}, {l.city}</p>
                <div className={s.price}>
                  <b>{formatEur(l.price)}</b>
                  {ppsm && <span>{formatEur(ppsm)}/m²</span>}
                </div>
              </div>

              {l.report && (
                <section aria-labelledby="report-title" className={s.report}>
                  <div className={s.reportSeal} aria-hidden="true"><b>✓</b><small>ANEVAR</small></div>
                  <div className={s.reportText}>
                    <h2 id="report-title">Proprietatea are raport de evaluare</h2>
                    <p>
                      Raport întocmit de evaluator autorizat ANEVAR, conform Standardelor de Evaluare ({reportDate(l.report.date)}).
                      Îl poți consulta înainte de vizionare sau de o ofertă — util și pentru discuția cu banca.
                    </p>
                  </div>
                  <a href={`/imobiliare/${l.slug}/raport`} className={s.reportBtn}>Solicită raportul →</a>
                </section>
              )}

              <section aria-labelledby="facts-title" className={s.block}>
                <h2 id="facts-title">Detalii</h2>
                <dl className={s.facts}>
                  {facts.map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="desc-title" className={s.block}>
                <h2 id="desc-title">Descriere</h2>
                {l.description.map((para) => <p key={para}>{para}</p>)}
                <ul className={s.features}>
                  {l.features.map((f) => <li key={f}><span aria-hidden="true">✓</span>{f}</li>)}
                </ul>
              </section>

              <section aria-labelledby="why-title" className={s.why}>
                <h2 id="why-title">Vândut prin VALUEFY</h2>
                <ul>
                  <li><b>Documente verificate</b><span>Extrasul de carte funciară și actele de proprietate sunt verificate înainte de publicare.</span></li>
                  <li><b>Informații complete</b><span>Suprafețe, an de construcție și dotări, prezentate corect — fără surprize la vizionare.</span></li>
                  <li><b>Asistență până la notar</b><span>Te ajutăm cu documentele, programarea la notar și, dacă e cazul, cu evaluarea pentru credit.</span></li>
                </ul>
              </section>
            </div>

            <aside className={s.side}>
              <div className={s.contact}>
                <div className={s.contactHead}>
                  <span className={s.avatar} aria-hidden="true">V</span>
                  <span><b>Echipa VALUEFY</b><small>Consultant vânzări</small></span>
                </div>
                <a href={phoneHref(site.phone)} className={s.call}>Sună: {site.phone}</a>
                {l.report && <a href={`/imobiliare/${l.slug}/raport`} className={s.reportSide}><span aria-hidden="true">✓</span>Solicită raportul de evaluare</a>}
                <ViewingForm listingTitle={l.title} />
              </div>
            </aside>
          </div>

          <section aria-labelledby="similar-title" className={s.similar}>
            <h2 id="similar-title">Alte proprietăți</h2>
            <ul>
              {similar.map((x) => (
                <li key={x.slug}>
                  <a href={`/imobiliare/${x.slug}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={x.photos[0]} alt="" loading="lazy" />
                    <span className={s.simBody}>
                      <b>{formatEur(x.price)}</b>
                      <span>{x.title}</span>
                      <small>{x.zone}, {x.city}</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </AssistantProvider>
  );
}
