import type { Metadata } from "next";
import { AssistantProvider } from "@/components/Assistant";
import { AssistantButton } from "@/components/AssistantButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Closing";
import { getDb } from "@/lib/db";
import { listPublished } from "@/lib/listings-db";
import { inLang, type Listing } from "@/lib/listing-format";
import { setLang } from "@/i18n/server";
import { localize, type Lang } from "@/i18n/lang";
import { ListingsBrowser } from "./ListingsBrowser";
import s from "./imobiliare.module.css";

// Shared by /imobiliare and /en/properties — see page.tsx in both route trees.

const T = {
  ro: {
    metaTitle: "Proprietăți de vânzare | VALUEFY",
    metaDescription: "Apartamente, case, terenuri și spații comerciale de vânzare, cu comision 0% la cumpărare, prezentate transparent de echipa VALUEFY.",
    home: "Acasă", crumb: "Proprietăți de vânzare",
    titleA: "Proprietăți de vânzare, ", titleB: "prezentate transparent.",
    lead: "Vindem proprietăți pentru clienții noștri, cu documentele verificate și informații clare despre fiecare imobil — fără surprize la vizionare și fără comision la cumpărare.",
    trust: ["Comision 0% la toate proprietățile", "Documente verificate înainte de publicare", "Informații complete și fotografii reale", "Vizionări programate rapid"],
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
    trust: ["0% commission on every property", "Documents verified before publication", "Complete information and real photos", "Viewings arranged quickly"],
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
  const [zeroFee, ...trust] = t.trust;
  return (
    <AssistantProvider>
      <Header />
      <main id="top">
        <section aria-labelledby="page-title" className={s.hero}>
          <div aria-hidden="true" className={s.heroGlow} />
          <div className={`container ${s.heroInner}`}>
            <nav aria-label="Breadcrumb" className={s.crumbs}>
              <a href={localize(lang, "/")}>{t.home}</a><span aria-hidden="true">/</span><span aria-current="page">{t.crumb}</span>
            </nav>
            <h1 id="page-title" className={s.title}>
              {t.titleA}<span>{t.titleB}</span>
            </h1>
            <p className={s.lead}>{t.lead}</p>
            <ul className={s.trustRow}>
              <li className={s.zeroFeeHero}><span>0</span>{zeroFee}</li>
              {trust.map((x) => <li key={x}><span>✓</span>{x}</li>)}
            </ul>
          </div>
        </section>

        <section aria-label={t.listLabel} className={`container ${s.listSection}`}>
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
