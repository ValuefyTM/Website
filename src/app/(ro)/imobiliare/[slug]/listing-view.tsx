import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { site, phoneHref } from "@/config/site";
import { AssistantProvider } from "@/components/Assistant";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Closing";
import { getDb } from "@/lib/db";
import { getBySlug, listPublished } from "@/lib/listings-db";
import { commissionNote, floorText, formatEur, inLang, pricePerSqm, reportDate, specLine } from "@/lib/listing-format";
import { isAdmin } from "@/lib/admin-auth";
import { setLang } from "@/i18n/server";
import { localize, numberLocale, type Lang } from "@/i18n/lang";
import { label } from "@/i18n/labels";
import { ViewingForm } from "./ViewingForm";
import { Gallery } from "./Gallery";
import { ShareButton } from "./ShareButton";
import s from "./listing.module.css";

// Shared by /imobiliare/[slug] and /en/properties/[slug] — see page.tsx in both route trees.

const T = {
  ro: {
    metaFee: (fee: string) => `${fee} la cumpărare`, metaReport: "raport de evaluare ANEVAR disponibil",
    draft: "Previzualizare admin — acest anunț nu este publicat și nu e vizibil pentru vizitatori.",
    home: "Acasă", listings: "Proprietăți de vânzare",
    reportTag: "✓ Raport de evaluare", sale: "Vânzare",
    commission: "Nu plătești comision de intermediere când cumperi această proprietate.",
    reportTitle: "Proprietatea are raport de evaluare",
    reportText: (date: string) => `Raport întocmit de evaluator autorizat ANEVAR, conform Standardelor de Evaluare (${date}).`,
    reportText2: "Îl poți consulta înainte de vizionare sau de o ofertă — util și pentru discuția cu banca.",
    reportBtn: "Solicită raportul →",
    details: "Detalii", type: "Tip", surface: "Suprafață utilă", land: "Teren", rooms: "Camere", baths: "Băi", floor: "Etaj", year: "An construcție", location: "Localizare",
    description: "Descriere",
    whyTitle: "Vândut prin VALUEFY",
    why: [
      ["", "Toate proprietățile noastre se vând fără comision pentru cumpărător."],
      ["Documente verificate", "Extrasul de carte funciară și actele de proprietate sunt verificate înainte de publicare."],
      ["Informații complete", "Suprafețe, an de construcție și dotări, prezentate corect — fără surprize la vizionare."],
      ["Asistență până la notar", "Te ajutăm cu documentele, programarea la notar și, dacă e cazul, cu evaluarea pentru credit."],
    ],
    team: "Echipa VALUEFY", consultant: "Consultant vânzări", call: "Sună:", reportSide: "Solicită raportul de evaluare",
    similar: "Alte proprietăți",
  },
  en: {
    metaFee: (fee: string) => `${fee} for the buyer`, metaReport: "ANEVAR valuation report available",
    draft: "Admin preview — this listing is not published and is not visible to visitors.",
    home: "Home", listings: "Properties for sale",
    reportTag: "✓ Valuation report", sale: "For sale",
    commission: "You pay no agency commission when you buy this property.",
    reportTitle: "This property has a valuation report",
    reportText: (date: string) => `Report prepared by an ANEVAR-authorised valuer, in line with the Valuation Standards (${date}).`,
    reportText2: "You can read it before a viewing or an offer — it is also useful when talking to your bank.",
    reportBtn: "Request the report →",
    details: "Details", type: "Type", surface: "Usable area", land: "Land", rooms: "Rooms", baths: "Bathrooms", floor: "Floor", year: "Year built", location: "Location",
    description: "Description",
    whyTitle: "Sold through VALUEFY",
    why: [
      ["", "All our properties are sold with no commission for the buyer."],
      ["Verified documents", "The land registry extract and the title documents are checked before publication."],
      ["Complete information", "Areas, year of construction and features, presented accurately — no surprises at the viewing."],
      ["Support all the way to the notary", "We help with the documents, booking the notary and, if needed, the valuation for your mortgage."],
    ],
    team: "The VALUEFY team", consultant: "Sales consultant", call: "Call:", reportSide: "Request the valuation report",
    similar: "Other properties",
  },
};

/** Published listing, or an unpublished one when an admin previews it. */
async function load(slug: string) {
  const db = await getDb();
  if (!db) return { db: null, listing: null };
  return { db, listing: await getBySlug(db, slug, await isAdmin()) };
}

/** Origin the visitor used (workers.dev today, the own domain later), so shared links and previews point to this site. */
async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return host ? `${h.get("x-forwarded-proto") ?? "https"}://${host}` : undefined;
}

export async function listingMetadata(slug: string, lang: Lang): Promise<Metadata> {
  const { listing } = await load(slug);
  if (!listing) return {};
  const l = inLang(listing, lang);
  const t = T[lang];
  const base = await origin();
  const abs = (p: string) => (base ? new URL(p, base).toString() : p);
  const where = [l.zone, l.city].filter(Boolean).join(", ");
  const price = formatEur(l.price, lang);
  const description = [`${price} · ${where}`, specLine(l, lang), t.metaFee(commissionNote(lang)), l.report ? t.metaReport : ""]
    .filter(Boolean)
    .join(" · ");
  // Share card generated in the admin, in the page's language (English falls back to the Romanian one).
  const card = lang === "en" ? l.socialImageEn ?? l.socialImage : l.socialImage;
  const image = card
    ? { url: abs(card), width: 1200, height: 630, alt: l.title }
    : { url: abs(l.photos[0] ?? "/opengraph-image.png"), alt: l.title };
  const roPath = `/imobiliare/${l.slug}`;
  const path = localize(lang, roPath);
  return {
    title: `${l.title} | VALUEFY`,
    description,
    alternates: { canonical: path, languages: { ro: roPath, en: localize("en", roPath) } },
    openGraph: {
      type: "website",
      siteName: "VALUEFY",
      locale: lang === "en" ? "en_GB" : "ro_RO",
      title: `${l.title} — ${price}`,
      description,
      url: abs(path),
      images: [image],
    },
    twitter: { card: "summary_large_image", title: `${l.title} — ${price}`, description, images: [image.url] },
    robots: l.published ? undefined : { index: false, follow: false },
  };
}

export async function ListingView({ slug, lang }: { slug: string; lang: Lang }) {
  setLang(lang);
  const t = T[lang];
  const { db, listing } = await load(slug);
  if (!db || !listing) notFound();
  const l = inLang(listing, lang);
  const loc = numberLocale(lang);
  const fee = commissionNote(lang);
  const eur = (n: number) => formatEur(n, lang);
  const ppsm = pricePerSqm(l);
  const facts: [string, string][] = [
    [t.type, label(l.type, lang)],
    ...(l.surface ? ([[t.surface, `${l.surface} m²`]] as [string, string][]) : []),
    ...(l.land ? ([[t.land, `${l.land.toLocaleString(loc)} m²`]] as [string, string][]) : []),
    ...(l.rooms ? ([[t.rooms, String(l.rooms)]] as [string, string][]) : []),
    ...(l.baths ? ([[t.baths, String(l.baths)]] as [string, string][]) : []),
    ...(l.floor ? ([[t.floor, floorText(l.floor, lang)]] as [string, string][]) : []),
    ...(l.year ? ([[t.year, String(l.year)]] as [string, string][]) : []),
    [t.location, `${l.zone}, ${l.city}`],
  ];
  const similar = (await listPublished(db))
    .filter((x) => x.slug !== l.slug)
    .sort((a, b) => Number(b.type === l.type) - Number(a.type === l.type))
    .slice(0, 3)
    .map((x) => inLang(x, lang));
  const reportHref = localize(lang, `/imobiliare/${l.slug}/raport`);

  return (
    <AssistantProvider saleCta>
      <Header />
      <main id="top" className={s.page}>
        <div className="container">
          {!l.published && <div className={s.draft}>{t.draft}</div>}
          <nav aria-label="Breadcrumb" className={s.crumbs}>
            <a href={localize(lang, "/")}>{t.home}</a><span aria-hidden="true">/</span><a href={localize(lang, "/imobiliare")}>{t.listings}</a><span aria-hidden="true">/</span>
            <span aria-current="page">{l.city}</span>
          </nav>

          <Gallery photos={l.photos} title={l.title} />

          <div className={s.layout}>
            <div className={s.content}>
              <div className={s.head}>
                <div className={s.tags}>
                  <span className={s.tag}>{label(l.type, lang)}</span>
                  {l.status && <span className={`${s.tag} ${s.tagAcc}`}>{label(l.status, lang)}</span>}
                  {l.report && <span className={`${s.tag} ${s.tagNavy}`}>{t.reportTag}</span>}
                  <span className={s.tag}>{t.sale}</span>
                </div>
                <h1 className={s.title}>{l.title}</h1>
                <p className={s.loc}>{[l.zone, l.city].filter(Boolean).join(", ")}</p>
                <div className={s.priceRow}>
                  <div className={s.price}>
                    <b>{eur(l.price)}</b>
                    {ppsm && <span>{eur(ppsm)}/m²</span>}
                  </div>
                  <ShareButton listing={l} />
                </div>
                <div className={s.commission}>
                  <b>{fee}</b>
                  <span>{t.commission}</span>
                </div>
              </div>

              {l.report && (
                <section aria-labelledby="report-title" className={s.report}>
                  <div className={s.reportSeal} aria-hidden="true"><b>✓</b><small>ANEVAR</small></div>
                  <div className={s.reportText}>
                    <h2 id="report-title">{t.reportTitle}</h2>
                    <p>
                      {t.reportText(reportDate(l.report.date, lang))}
                      {" "}{t.reportText2}
                    </p>
                  </div>
                  <a href={reportHref} className={s.reportBtn}>{t.reportBtn}</a>
                </section>
              )}

              <section aria-labelledby="facts-title" className={s.block}>
                <h2 id="facts-title">{t.details}</h2>
                <dl className={s.facts}>
                  {facts.map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="desc-title" className={s.block}>
                <h2 id="desc-title">{t.description}</h2>
                {l.description.map((para) => <p key={para}>{para}</p>)}
                <ul className={s.features}>
                  {l.features.map((f) => <li key={f}><span aria-hidden="true">✓</span>{f}</li>)}
                </ul>
              </section>

              <section aria-labelledby="why-title" className={s.why}>
                <h2 id="why-title">{t.whyTitle}</h2>
                <ul>
                  {t.why.map(([b, text], i) => <li key={i}><b>{b || fee}</b><span>{text}</span></li>)}
                </ul>
              </section>
            </div>

            <aside className={s.side}>
              <div className={s.contact}>
                <div className={s.contactHead}>
                  <span className={s.avatar} aria-hidden="true">V</span>
                  <span><b>{t.team}</b><small>{t.consultant}</small></span>
                </div>
                <a href={phoneHref(site.phone)} className={s.call}>{t.call} {site.phone}</a>
                {l.report && <a href={reportHref} className={s.reportSide}><span aria-hidden="true">✓</span>{t.reportSide}</a>}
                <ViewingForm listingTitle={l.title} slug={l.slug} />
              </div>
            </aside>
          </div>

          {similar.length > 0 && <section aria-labelledby="similar-title" className={s.similar}>
            <h2 id="similar-title">{t.similar}</h2>
            <ul>
              {similar.map((x) => (
                <li key={x.slug}>
                  <a href={localize(lang, `/imobiliare/${x.slug}`)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {x.photos[0] ? <img src={x.photos[0]} alt="" loading="lazy" /> : <span className={s.simNoPhoto} />}
                    <span className={s.simBody}>
                      <b>{eur(x.price)}</b>
                      <span>{x.title}</span>
                      <small>{[x.zone, x.city].filter(Boolean).join(", ")}</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>}
        </div>
      </main>
      <Footer />
    </AssistantProvider>
  );
}
