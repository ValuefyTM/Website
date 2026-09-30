import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/config/site";
import { unsplash } from "@/lib/icons";
import { MOBILE } from "@/lib/lead";
import { AssistantProvider } from "@/components/Assistant";
import { AssistantButton } from "@/components/AssistantButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Closing";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { setLang } from "@/i18n/server";
import { localize, type Lang } from "@/i18n/lang";
import s from "@/components/Landing.module.css";
import m from "./page.module.css";

// Shared by /evaluare-bunuri-mobile and /en/movable-asset-valuation — see page.tsx in both route trees.

const PATH = "/evaluare-bunuri-mobile";

const T = {
  ro: {
    title: "Evaluare bunuri mobile: utilaje, echipamente, vehicule | VALUEFY",
    description:
      "Evaluarea utilajelor de construcții și agricole, a liniilor de producție, vehiculelor și echipamentelor, de evaluator autorizat ANEVAR. Pentru credit, raportare financiară, vânzare sau insolvență.",
    categories: [
      {
        img: "excavator",
        t: "Utilaje de construcții",
        items: ["Excavatoare", "Buldoexcavatoare", "Încărcătoare frontale", "Macarale", "Finisoare", "Betoniere"],
      },
      {
        img: "tractor",
        t: "Utilaje agricole",
        items: ["Tractoare", "Combine", "Semănători", "Pluguri și grape", "Prese de balotat", "Sisteme de irigații"],
      },
      {
        img: "production-line",
        t: "Linii de producție",
        items: ["Linii tehnologice complete", "Prese", "Roboți industriali", "Benzi transportoare", "Instalații de ambalare"],
      },
      {
        img: "truck",
        t: "Autovehicule și flote",
        items: ["Autoturisme", "Autoutilitare", "Camioane și capete tractor", "Remorci și semiremorci", "Flote întregi"],
      },
      {
        img: "forklift",
        t: "Depozitare și logistică",
        items: ["Stivuitoare", "Transpaleți electrici", "Sisteme de rafturi", "Echipamente de manipulare"],
      },
      {
        img: "equipment",
        t: "Echipamente și dotări",
        items: ["Mașini CNC", "Echipamente medicale", "Echipamente IT", "Bucătării profesionale HoReCa", "Mobilier și dotări"],
      },
    ],
    purposes: [
      ["Credit și leasing", "Bunurile aduse în garanție la bancă sau la societatea de leasing."],
      ["Raportare financiară", "Reevaluarea mijloacelor fixe pentru situațiile financiare."],
      ["Vânzare sau aport la capital", "Valoarea de piață înainte de o tranzacție sau de aportul în natură."],
      ["Insolvență și executare", "Evaluări pentru lichidatori, administratori judiciari și executori."],
      ["Asigurare", "Valoarea bunurilor pentru stabilirea sumei asigurate."],
      ["Partaj, succesiune, litigii", "Rapoarte pentru împărțirea bunurilor sau pentru instanță."],
    ],
    docs: [
      "Lista bunurilor (inventar sau registrul mijloacelor fixe)",
      "Facturile de achiziție, dacă sunt disponibile",
      "Fișe tehnice: marcă, model, an de fabricație, serie",
      "Pentru vehicule: certificatul de înmatriculare și cartea de identitate a vehiculului",
      "Ore de funcționare sau kilometraj, istoricul reparațiilor și reviziilor",
      "Fotografii recente, dacă inspecția nu se face imediat",
    ],
    steps: [
      ["Trimiți solicitarea", "Ne spui ce bunuri sunt, câte și unde se află. Poți încărca lista din asistent."],
      ["Primești oferta", "Îți comunicăm costul, termenul și documentele necesare pentru bunurile tale."],
      ["Inspecția bunurilor", "Evaluatorul identifică bunurile la fața locului și verifică starea tehnică."],
      ["Raportul de evaluare", "Primești raportul semnat de evaluator autorizat, pentru bancă, auditor sau instanță."],
    ],
    faq: [
      [
        "Ce bunuri mobile evaluați?",
        "Utilaje de construcții și agricole, linii și echipamente de producție, vehicule și flote, echipamente de depozit, echipamente medicale, IT, HoReCa, mobilier și alte dotări. Dacă nu găsești bunul tău în listă, descrie-l în solicitare și îți confirmăm.",
      ],
      [
        "Evaluați un singur utilaj sau un inventar întreg?",
        "Ambele. Putem evalua un singur bun, de exemplu un utilaj adus în garanție, sau toate mijloacele fixe ale unei companii, grupate în același raport.",
      ],
      [
        "Este necesară inspecția?",
        "De regulă, da: evaluatorul identifică bunurile și le verifică starea tehnică, pentru că acestea influențează valoarea. Modul exact al inspecției îl stabilim în ofertă, în funcție de numărul bunurilor și de locul în care se află.",
      ],
      [
        "Raportul este acceptat de bănci și de societățile de leasing?",
        "Rapoartele sunt întocmite de evaluatori autorizați ANEVAR, conform Standardelor de Evaluare. Dacă banca sau societatea de leasing are cerințe proprii, de exemplu evaluatori agreați, îți spunem înainte de a trimite oferta.",
      ],
      [
        "Cât costă și în cât timp primesc raportul?",
        "Depinde de numărul și tipul bunurilor, de locul în care se află și de documentele disponibile. Trimite-ne câteva informații și îți comunicăm oferta, cu cost și termen, înainte de începerea lucrării.",
      ],
    ],
    serviceName: "Evaluare bunuri mobile",
    serviceType: "Evaluarea utilajelor, echipamentelor și vehiculelor",
    home: "Acasă",
    services: "Servicii",
    crumb: "Bunuri mobile",
    h1: "Evaluarea bunurilor mobile.",
    h1Span: "Utilaje, echipamente, vehicule.",
    lead: "De la un singur excavator la toate mijloacele fixe ale unei fabrici: rapoarte de evaluare întocmite de evaluator autorizat ANEVAR, pentru bancă, auditor, lichidator sau instanță.",
    requestQuote: "Solicită o ofertă →",
    whatWeValue: "Ce evaluăm",
    badgeStrong: "Firmă autorizată ANEVAR",
    badgeText: "Rapoarte conforme Standardelor de Evaluare",
    heroAlt: "Hală industrială cu echipamente",
    getTitle: "Ce primești",
    get: [
      "Raport de evaluare conform Standardelor de Evaluare",
      "Identificarea bunurilor și a stării tehnice",
      "Un singur raport pentru tot inventarul",
      "Disponibil și în portalul client",
    ],
    catTitle: "Exemple de bunuri mobile pe care le evaluăm.",
    catIntro:
      "Evaluăm bunuri individuale sau inventare complete, pentru companii și persoane fizice. Lista de mai jos conține doar exemple — dacă bunul tău nu apare, descrie-l în solicitare.",
    examples: "Exemple",
    requestValuation: "Solicită evaluare →",
    purposeEyebrow: "Scopul evaluării",
    purposeTitle: "Când ai nevoie de evaluarea bunurilor mobile.",
    docsEyebrow: "Documente",
    docsTitle: "Ce documente sunt utile.",
    docsSmall: "Lista exactă depinde de bunuri și de scop. O primești în ofertă, iar documentele le poți trimite online.",
    stepsEyebrow: "Cum decurge",
    stepsTitle: "De la solicitare la raport.",
    startRequest: "Începe solicitarea →",
    faqEyebrow: "Întrebări frecvente",
    faqTitle: "Despre evaluarea bunurilor mobile.",
    ctaTitle: "Ai utilaje sau echipamente de evaluat?",
    ctaText: "Spune-ne ce bunuri sunt și unde se află. Îți trimitem oferta cu cost, termen și documentele necesare.",
  },
  en: {
    title: "Movable asset valuation: machinery, equipment, vehicles | VALUEFY",
    description:
      "Valuation of construction and agricultural machinery, production lines, vehicles and equipment by an ANEVAR-authorised valuer. For loans, financial reporting, sales or insolvency.",
    categories: [
      {
        img: "excavator",
        t: "Construction machinery",
        items: ["Excavators", "Backhoe loaders", "Wheel loaders", "Cranes", "Asphalt pavers", "Concrete mixers"],
      },
      {
        img: "tractor",
        t: "Agricultural machinery",
        items: ["Tractors", "Combine harvesters", "Seed drills", "Ploughs and harrows", "Balers", "Irrigation systems"],
      },
      {
        img: "production-line",
        t: "Production lines",
        items: ["Complete production lines", "Presses", "Industrial robots", "Conveyor belts", "Packaging equipment"],
      },
      {
        img: "truck",
        t: "Vehicles and fleets",
        items: ["Cars", "Vans", "Lorries and tractor units", "Trailers and semi-trailers", "Entire fleets"],
      },
      {
        img: "forklift",
        t: "Warehousing and logistics",
        items: ["Forklifts", "Electric pallet trucks", "Racking systems", "Handling equipment"],
      },
      {
        img: "equipment",
        t: "Equipment and fittings",
        items: ["CNC machines", "Medical equipment", "IT equipment", "Professional catering kitchens", "Furniture and fittings"],
      },
    ],
    purposes: [
      ["Loans and leasing", "Assets pledged as collateral to a bank or leasing company."],
      ["Financial reporting", "Revaluation of fixed assets for the financial statements."],
      ["Sale or capital contribution", "Market value ahead of a transaction or a contribution in kind."],
      ["Insolvency and enforcement", "Valuations for liquidators, insolvency practitioners and bailiffs."],
      ["Insurance", "The value of the assets, to set the sum insured."],
      ["Division, inheritance, litigation", "Reports for dividing assets or for court."],
    ],
    docs: [
      "List of assets (inventory or fixed asset register)",
      "Purchase invoices, if available",
      "Technical data sheets: make, model, year of manufacture, serial number",
      "For vehicles: the registration certificate and the vehicle identity document",
      "Operating hours or mileage, repair and service history",
      "Recent photos, if the inspection can't take place straight away",
    ],
    steps: [
      ["Send your request", "Tell us what the assets are, how many and where they are. You can upload the list through the assistant."],
      ["Receive the quote", "We tell you the cost, the timeframe and the documents needed for your assets."],
      ["Asset inspection", "The valuer identifies the assets on site and checks their technical condition."],
      ["Valuation report", "You receive the report signed by an authorised valuer, for your bank, auditor or the court."],
    ],
    faq: [
      [
        "Which movable assets do you value?",
        "Construction and agricultural machinery, production lines and equipment, vehicles and fleets, warehouse equipment, medical, IT and catering equipment, furniture and other fittings. If your asset isn't on the list, describe it in your request and we'll confirm.",
      ],
      [
        "Do you value a single machine or a whole inventory?",
        "Both. We can value a single asset, such as a machine pledged as collateral, or all of a company's fixed assets, grouped in one report.",
      ],
      [
        "Is an inspection required?",
        "Usually, yes: the valuer identifies the assets and checks their technical condition, as both affect the value. We agree the exact form of the inspection in the quote, depending on the number of assets and where they are.",
      ],
      [
        "Do banks and leasing companies accept the report?",
        "Reports are prepared by ANEVAR-authorised valuers in line with the Valuation Standards. If your bank or leasing company has its own requirements, such as approved valuers, we'll tell you before sending the quote.",
      ],
      [
        "How much does it cost and how soon will I receive the report?",
        "It depends on the number and type of assets, where they are and the documents available. Send us a few details and we'll give you a quote, with cost and timeframe, before any work begins.",
      ],
    ],
    serviceName: "Movable asset valuation",
    serviceType: "Valuation of machinery, equipment and vehicles",
    home: "Home",
    services: "Services",
    crumb: "Movable assets",
    h1: "Movable asset valuation.",
    h1Span: "Machinery, equipment, vehicles.",
    lead: "From a single excavator to every fixed asset in a factory: valuation reports prepared by an ANEVAR-authorised valuer, for your bank, auditor, liquidator or the court.",
    requestQuote: "Request a quote →",
    whatWeValue: "What we value",
    badgeStrong: "ANEVAR-authorised firm",
    badgeText: "Reports in line with the Valuation Standards",
    heroAlt: "Industrial hall with equipment",
    getTitle: "What you get",
    get: [
      "Valuation report in line with the Valuation Standards",
      "Identification of the assets and their technical condition",
      "A single report for the whole inventory",
      "Also available in the client portal",
    ],
    catTitle: "Examples of movable assets we value.",
    catIntro:
      "We value individual assets or complete inventories, for companies and individuals. The list below is just examples — if your asset isn't there, describe it in your request.",
    examples: "Examples",
    requestValuation: "Request a valuation →",
    purposeEyebrow: "Purpose of the valuation",
    purposeTitle: "When you need a movable asset valuation.",
    docsEyebrow: "Documents",
    docsTitle: "Useful documents.",
    docsSmall: "The exact list depends on the assets and the purpose. You'll receive it with the quote, and you can send the documents online.",
    stepsEyebrow: "How it works",
    stepsTitle: "From request to report.",
    startRequest: "Start your request →",
    faqEyebrow: "Frequently asked questions",
    faqTitle: "About movable asset valuation.",
    ctaTitle: "Have machinery or equipment to value?",
    ctaText: "Tell us what the assets are and where they are. We'll send you a quote with the cost, timeframe and documents needed.",
  },
};

export function movableMetadata(lang: Lang): Metadata {
  const t = T[lang];
  const url = localize(lang, PATH);
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: url, languages: { ro: PATH, en: localize("en", PATH) } },
    openGraph: {
      title: t.title,
      description: t.description,
      url,
      siteName: "VALUEFY",
      locale: lang === "en" ? "en_GB" : "ro_RO",
      type: "website",
      images: ["/opengraph-image.png"],
    },
  };
}

function jsonLd(lang: Lang) {
  const t = T[lang];
  const url = `${site.url}${localize(lang, PATH)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: t.serviceName,
        serviceType: t.serviceType,
        description: t.description,
        url,
        inLanguage: lang,
        areaServed: ["Timișoara", "Cluj-Napoca", "România"],
        provider: { "@type": "ProfessionalService", name: site.name, url: site.url, telephone: site.phone, email: site.email },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.home, item: `${site.url}${localize(lang, "/")}` },
          { "@type": "ListItem", position: 2, name: t.serviceName, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: t.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
  };
}

export function MovableAssetsView({ lang }: { lang: Lang }) {
  setLang(lang);
  const t = T[lang];
  return (
    <AssistantProvider>
      <Header />
      <main id="top">
        {/* Hero */}
        <section aria-labelledby="page-title" className={s.hero}>
          <div aria-hidden="true" className={s.heroGlow} />
          <div className={`container ${s.heroInner}`}>
            <div className={s.heroCopy}>
              <nav aria-label="Breadcrumb" className={s.crumbs}>
                <a href={localize(lang, "/")}>{t.home}</a><span aria-hidden="true">/</span><a href={localize(lang, "/#servicii")}>{t.services}</a><span aria-hidden="true">/</span>
                <span aria-current="page">{t.crumb}</span>
              </nav>
              <h1 id="page-title" className={s.title}>
                {t.h1} <span>{t.h1Span}</span>
              </h1>
              <p className={s.lead}>{t.lead}</p>
              <div className={s.heroActions}>
                <AssistantButton type_={MOBILE} className={s.cta}>{t.requestQuote}</AssistantButton>
                <a href="#ce-evaluam" className={s.ghost}>{t.whatWeValue}</a>
              </div>
              <div className={s.badge}>
                <span className={s.seal} aria-hidden="true"><b>✓</b><small>ANEVAR</small></span>
                <span className={s.badgeText}><strong>{t.badgeStrong}</strong><span>{t.badgeText}</span></span>
              </div>
            </div>
            <div className={s.heroVisual}>
              <div className={s.photo}>
                <Image src={unsplash("photo-1586528116311-ad8dd3c8310d", 1200)} alt={t.heroAlt} fill priority sizes="(max-width: 900px) 100vw, 520px" />
              </div>
              <div className={s.getCard}>
                <div className={s.getTitle}>{t.getTitle}</div>
                <ul>
                  {t.get.map((g) => <li key={g}><span>✓</span>{g}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="ce-evaluam" aria-labelledby="cat-title" className={`container anchor ${s.section}`}>
          <div className="eyebrow">{t.whatWeValue}</div>
          <h2 id="cat-title" className="h2">{t.catTitle}</h2>
          <p className={m.intro}>{t.catIntro}</p>
          <ul data-rv className={m.grid}>
            {t.categories.map((c) => (
              <li key={c.t} className={m.card}>
                <div className={m.media}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/illustrations/${c.img}.svg`} alt="" width={400} height={260} loading="lazy" />
                </div>
                <div className={m.body}>
                  <h3>{c.t}</h3>
                  <ul className={m.chips} aria-label={`${t.examples}: ${c.t}`}>
                    {c.items.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                  <AssistantButton type_={MOBILE} className={m.cardCta}>{t.requestValuation}</AssistantButton>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Purposes */}
        <section aria-labelledby="why-title" className={s.band}>
          <div className={`container ${s.section}`}>
            <div className="eyebrow">{t.purposeEyebrow}</div>
            <h2 id="why-title" className="h2">{t.purposeTitle}</h2>
            <ul data-rv className={s.cards}>
              {t.purposes.map(([title, d], i) => (
                <li key={title}>
                  <span className={s.cardN}>{String(i + 1).padStart(2, "0")}</span>
                  <b>{title}</b>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Documents + steps */}
        <section id="documente" aria-labelledby="docs-title" className={`container anchor ${s.section}`}>
          <div className={s.twoCol}>
            <div data-rv className={s.docs}>
              <div className="eyebrow">{t.docsEyebrow}</div>
              <h2 id="docs-title" className="h2">{t.docsTitle}</h2>
              <ul>
                {t.docs.map((d) => (
                  <li key={d}><span aria-hidden="true">✓</span>{d}</li>
                ))}
              </ul>
              <p className={s.small}>{t.docsSmall}</p>
            </div>
            <div data-rv className={s.stepsBox}>
              <div className={s.stepsEyebrow}>{t.stepsEyebrow}</div>
              <h2 className={s.stepsTitle}>{t.stepsTitle}</h2>
              <ol>
                {t.steps.map(([title, d], i) => (
                  <li key={title}>
                    <span className={s.stepN}>{String(i + 1).padStart(2, "0")}</span>
                    <span><b>{title}</b><span>{d}</span></span>
                  </li>
                ))}
              </ol>
              <AssistantButton type_={MOBILE} className={s.ctaLight}>{t.startRequest}</AssistantButton>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className={s.band}>
          <div className={`container ${s.section} ${s.faqWrap}`}>
            <div>
              <div className="eyebrow">{t.faqEyebrow}</div>
              <h2 id="faq-title" className="h2">{t.faqTitle}</h2>
            </div>
            <div data-rv className={s.faq}>
              {t.faq.map(([q, a], i) => (
                <details key={q} open={i === 0}>
                  <summary>
                    <span className={s.faqN}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={s.faqQ}>{q}</span>
                    <span aria-hidden="true" className={s.plus}>+</span>
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section aria-labelledby="cta-title" className={s.ctaSection}>
          <div className={s.ctaCard}>
            <div aria-hidden="true" className={s.ctaGlow} />
            <h2 id="cta-title">{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
            <AssistantButton type_={MOBILE} className={s.ctaWhite}>{t.requestQuote}</AssistantButton>
          </div>
        </section>
      </main>
      <Footer />
      <RevealOnScroll />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }} />
    </AssistantProvider>
  );
}
