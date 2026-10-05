import type { Metadata } from "next";
import { AssistantProvider } from "@/components/Assistant";
import { AssistantButton } from "@/components/AssistantButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Closing";
import { getDb } from "@/lib/db";
import { listPublished } from "@/lib/listings-db";
import { commissionNote, formatEur, inLang, specLine, type Listing } from "@/lib/listing-format";
import { label } from "@/i18n/labels";
import { setLang } from "@/i18n/server";
import { localize, type Lang } from "@/i18n/lang";
import { ListingsBrowser } from "./ListingsBrowser";
import { SellButton } from "./SellButton";
import s from "./imobiliare.module.css";

// Shared by /imobiliare and /en/properties — see page.tsx in both route trees.

const T = {
  ro: {
    metaTitle: "Proprietăți de vânzare | VALUEFY",
    metaDescription: "Apartamente, case, terenuri și spații comerciale de vânzare, cu comision 0% la cumpărare, prezentate transparent de echipa VALUEFY.",
    home: "Acasă", crumb: "Proprietăți de vânzare",
    titleA: "Proprietăți de vânzare, ", titleB: "prezentate transparent.",
    lead: "Vindem proprietăți pentru clienții noștri, cu documentele verificate și informații clare despre fiecare imobil — fără surprize la vizionare și fără comision la cumpărare.",
    eyebrow: "Portal Imobiliar",
    browse: "Vezi proprietățile ↓",
    sell: "Vinde prin VALUEFY",
    statListings: (n: number) => (n === 1 ? "proprietate de vânzare" : "proprietăți de vânzare"),
    statCities: (n: number) => (n === 1 ? "localitate" : "localități"),
    statReports: "cu raport de evaluare ANEVAR",
    latest: "Cea mai nouă",
    reportChip: "Raport de evaluare disponibil",
    view: "Vezi anunțul →",
    emptyCardTitle: "Primele proprietăți apar în curând.",
    emptyCardText: "Fiecare anunț este verificat de evaluatori autorizați ANEVAR înainte de publicare.",
    trust: [
      ["Comision 0%", "La toate proprietățile, pentru cumpărător."],
      ["Documente verificate", "Carte funciară și acte, verificate înainte de publicare."],
      ["Informații complete", "Suprafețe, dotări și fotografii reale."],
      ["Vizionări rapide", "Programezi vizionarea direct din anunț."],
    ],
    listLabel: "Lista proprietăților",
    noneTitle: "Momentan nu avem proprietăți listate.",
    noneText: "Revino în curând sau scrie-ne dacă vrei să vinzi o proprietate prin VALUEFY.",
    sellEyebrow: "Vrei să vinzi?",
    sellTitle: "Îți vindem proprietatea, pornind de la valoarea ei reală.",
    sellText: "Stabilim un preț de listare argumentat, pregătim documentele și prezentarea, apoi ne ocupăm de vizionări și de negociere.",
    sellCta: "Discută cu noi →",
  },
  en: {
    metaTitle: "Properties for sale | VALUEFY",
    metaDescription: "Apartments, houses, land and commercial spaces for sale, with 0% commission for the buyer, presented transparently by the VALUEFY team.",
    home: "Home", crumb: "Properties for sale",
    titleA: "Properties for sale, ", titleB: "presented transparently.",
    lead: "We sell properties on behalf of our clients, with verified documents and clear information about every property — no surprises at the viewing and no commission for the buyer.",
    eyebrow: "Real Estate Portal",
    browse: "Browse properties ↓",
    sell: "Sell through VALUEFY",
    statListings: (n: number) => (n === 1 ? "property for sale" : "properties for sale"),
    statCities: (n: number) => (n === 1 ? "location" : "locations"),
    statReports: "with an ANEVAR valuation report",
    latest: "Newest",
    reportChip: "Valuation report available",
    view: "View listing →",
    emptyCardTitle: "The first properties are coming soon.",
    emptyCardText: "Every listing is checked by ANEVAR-authorised valuers before it goes live.",
    trust: [
      ["0% commission", "On every property, for the buyer."],
      ["Verified documents", "Land registry and deeds checked before publication."],
      ["Complete information", "Floor areas, features and real photos."],
      ["Quick viewings", "Book a viewing straight from the listing."],
    ],
    listLabel: "Property list",
    noneTitle: "There are no properties listed at the moment.",
    noneText: "Check back soon, or get in touch if you would like to sell a property through VALUEFY.",
    sellEyebrow: "Want to sell?",
    sellTitle: "We sell your property, starting from its real value.",
    sellText: "We set a well-argued listing price, prepare the documents and the presentation, then handle the viewings and the negotiation.",
    sellCta: "Talk to us →",
  },
};

export function listingsMetadata(lang: Lang): Metadata {
  const t = T[lang];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: localize(lang, "/imobiliare"), languages: { ro: "/imobiliare", en: localize("en", "/imobiliare") } },
  };
}

export async function ListingsView({ lang }: { lang: Lang }) {
  setLang(lang);
  const t = T[lang];
  const db = await getDb();
  let listings: Listing[] = [];
  try {
    if (db) listings = await listPublished(db);
  } catch (error) {
    console.error("[imobiliare] could not load listings", error);
  }
  listings = listings.map((l) => inLang(l, lang));
  const cities = [...new Set(listings.map((l) => l.city))].sort((a, b) => a.localeCompare(b, "ro"));
  const withReport = listings.filter((l) => l.report).length;
  const featured = listings.find((l) => l.photos[0]) ?? listings[0];
  const behind = listings.filter((l) => l !== featured && l.photos[0]).slice(0, 2);
  const L = (p: string) => localize(lang, p);
  return (
    <AssistantProvider>
      <Header />
      <main id="top">
        <section aria-labelledby="page-title" className={s.hero}>
          <div aria-hidden="true" className={s.heroGlow} />
          <div aria-hidden="true" className={s.heroGrid} />
          <div className={`container ${s.heroInner}`}>
            <div className={s.heroCopy}>
              <nav aria-label="Breadcrumb" className={s.crumbs}>
                <a href={L("/")}>{t.home}</a><span aria-hidden="true">/</span><span aria-current="page">{t.crumb}</span>
              </nav>
              <div className={s.heroEyebrow}><span aria-hidden="true" />{t.eyebrow}</div>
              <h1 id="page-title" className={s.title}>
                {t.titleA}<span>{t.titleB}</span>
              </h1>
              <p className={s.lead}>{t.lead}</p>
              <div className={s.heroActions}>
                <a href="#proprietati" className={s.heroPrimary}>{t.browse}</a>
                <SellButton className={s.heroSecondary}>{t.sell}</SellButton>
              </div>
              {listings.length > 0 && (
                <dl className={s.stats}>
                  <div><dt>{listings.length}</dt><dd>{t.statListings(listings.length)}</dd></div>
                  <div><dt>{cities.length}</dt><dd>{t.statCities(cities.length)}</dd></div>
                  {withReport > 0 && <div><dt>{withReport}</dt><dd>{t.statReports}</dd></div>}
                </dl>
              )}
            </div>

            <div className={s.heroVisual} aria-hidden={!featured}>
              {featured ? (
                <>
                  {behind.map((l, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={l.id} src={l.photos[0]} alt="" className={`${s.backCard} ${i ? s.backCard2 : s.backCard1}`} />
                  ))}
                  <a href={L(`/imobiliare/${featured.slug}`)} className={s.featured}>
                    <div className={s.featuredImg}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {featured.photos[0] ? <img src={featured.photos[0]} alt={featured.title} /> : null}
                      <span className={s.featuredTag}>{t.latest} · {label(featured.type, lang)}</span>
                    </div>
                    <div className={s.featuredBody}>
                      <div className={s.featuredPrice}>
                        <b>{formatEur(featured.price, lang)}</b>
                        <span className={s.zeroFee}>{commissionNote(lang)}</span>
                      </div>
                      <div className={s.featuredTitle}>{featured.title}</div>
                      <div className={s.featuredMeta}>{[[featured.zone, featured.city].filter(Boolean).join(", "), specLine(featured, lang)].filter(Boolean).join(" · ")}</div>
                      <span className={s.featuredLink}>{t.view}</span>
                    </div>
                  </a>
                  {featured.report && <div className={s.floatChip}><i>✓</i>{t.reportChip}</div>}
                </>
              ) : (
                <div className={s.emptyCard}>
                  <span className={s.emptySeal}><b>✓</b><small>ANEVAR</small></span>
                  <b>{t.emptyCardTitle}</b>
                  <span>{t.emptyCardText}</span>
                </div>
              )}
            </div>
          </div>
          <div className={`container ${s.trustWrap}`}>
            <ul className={s.trustStrip}>
              {t.trust.map(([title, d], i) => (
                <li key={title} className={i === 0 ? s.trustFee : undefined}>
                  <span className={s.trustIcon} aria-hidden="true">{i === 0 ? "0%" : "✓"}</span>
                  <span><b>{title}</b><small>{d}</small></span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="proprietati" aria-label={t.listLabel} className={`container anchor ${s.listSection}`}>
          {listings.length ? (
            <ListingsBrowser listings={listings} cities={cities} />
          ) : (
            <div className={s.none}>
              <b>{t.noneTitle}</b>
              <span>{t.noneText}</span>
            </div>
          )}
        </section>

        <section aria-labelledby="sell-title" className={s.sellBand}>
          <div className={`container ${s.sellInner}`}>
            <div>
              <div className="eyebrow">{t.sellEyebrow}</div>
              <h2 id="sell-title" className="h2">{t.sellTitle}</h2>
              <p>{t.sellText}</p>
            </div>
            <AssistantButton purpose="Vânzare / cumpărare" className={s.sellCta}>{t.sellCta}</AssistantButton>
          </div>
        </section>
      </main>
      <Footer />
    </AssistantProvider>
  );
}
