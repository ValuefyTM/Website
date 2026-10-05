import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/config/site";
import { unsplash } from "@/lib/icons";
import { AssistantProvider } from "@/components/Assistant";
import { AssistantButton } from "@/components/AssistantButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Closing";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { setLang } from "@/i18n/server";
import { localize, type Lang } from "@/i18n/lang";
import s from "@/components/Landing.module.css";

// Shared by /evaluare-esalonare-anaf and /en/anaf-instalment-valuation — see page.tsx in both route trees.

const PATH = "/evaluare-esalonare-anaf";
// Stored purpose value passed to the assistant — stays Romanian in both languages.
const PURPOSE = "Garanție eșalonare ANAF";

const T = {
  ro: {
    title: "Evaluare garanții pentru eșalonare ANAF | VALUEFY",
    description:
      "Raport de evaluare ANEVAR pentru bunurile aduse în garanție la eșalonarea la plată a datoriilor către ANAF: imobile, terenuri, utilaje, echipamente și autovehicule. În toată țara, în termenul cerut de ANAF.",
    who: [
      ["Clădiri și apartamente", "Sedii, birouri, hale, depozite, spații comerciale sau locuințe."],
      ["Terenuri", "Intravilane sau extravilane, libere sau cu construcții."],
      ["Utilaje și echipamente", "Linii de producție, utilaje de construcții sau agricole, echipamente industriale."],
      ["Autovehicule", "Autoturisme, autoutilitare, camioane, remorci sau o flotă întreagă."],
    ],
    docs: [
      "Acordul de principiu emis de ANAF, dacă l-ai primit (ne arată termenul)",
      "Pentru imobile: extras de carte funciară recent și actul de proprietate",
      "Pentru imobile: documentația cadastrală și releveul",
      "Pentru utilaje și echipamente: facturi, fișe tehnice, evidența mijloacelor fixe",
      "Pentru autovehicule: certificatul de înmatriculare și cartea de identitate a vehiculului",
      "Persoana de contact care ne însoțește la inspecție",
    ],
    steps: [
      ["Trimiți solicitarea", "Ne spui ce bunuri aduci în garanție, unde se află și ce termen ai primit de la ANAF."],
      ["Primești oferta", "Îți comunicăm costul, termenul de livrare și lista exactă de documente."],
      ["Inspecția bunurilor", "Evaluatorul vizitează imobilele sau inspectează utilajele și vehiculele."],
      ["Raportul de evaluare", "Primești raportul semnat de evaluator autorizat ANEVAR, gata de depus la ANAF."],
    ],
    faq: [
      [
        "Când am nevoie de un raport de evaluare pentru eșalonare?",
        "Când soliciți eșalonarea clasică și oferi în garanție bunuri: imobile (prin ipotecă) sau bunuri mobile (prin gaj). Dacă garanția este o scrisoare de garanție bancară, o poliță de asigurare sau o consemnare de bani, raportul nu este necesar. Eșalonarea simplificată nu cere garanții.",
      ],
      [
        "Cine poate întocmi raportul?",
        "Un evaluator independent, autorizat ANEVAR, cu specializarea potrivită tipului de bun: proprietăți imobiliare sau bunuri mobile. VALUEFY este firmă autorizată ANEVAR și evaluează ambele categorii.",
      ],
      [
        "Ce valoare reține ANAF pentru bunurile din garanție?",
        "Pentru bunurile mobile, valoarea din raportul de evaluare. Pentru imobile, valoarea din raport, dar cel mult valoarea orientativă din expertizele folosite de camera notarilor publici. Garanțiile trebuie să acopere sumele eșalonate, dobânzile pe perioada eșalonării și un procent suplimentar care depinde de durata eșalonării.",
      ],
      [
        "Ce se întâmplă dacă garanțiile nu acoperă toată suma?",
        "Codul de procedură fiscală prevede că, dacă valoarea garanțiilor este sub 50% din obligațiile eșalonate, eșalonarea se poate acorda pe cel mult 6 luni. Dacă depășește 50%, dar nu acoperă nivelul cerut, eșalonarea se poate acorda până la 5 ani, în condiții suplimentare. Confirmă situația ta cu organul fiscal sau cu consultantul fiscal.",
      ],
      [
        "În cât timp primesc raportul?",
        "Depinde de numărul și tipul bunurilor și de localizare. Ținem cont de termenul de 30 de zile pentru constituirea garanțiilor și îți spunem din ofertă când primești raportul.",
      ],
      [
        "Evaluați și bunuri din alte orașe?",
        "Da, în toată țara: avem birouri în Timișoara și Cluj-Napoca și lucrăm cu o rețea de evaluatori colaboratori autorizați ANEVAR.",
      ],
    ],
    serviceName: "Evaluare garanții pentru eșalonare ANAF",
    serviceType: "Evaluarea bunurilor aduse în garanție la eșalonarea la plată",
    breadcrumbName: "Evaluare pentru eșalonare ANAF",
    home: "Acasă",
    services: "Servicii",
    crumb: "Eșalonare ANAF",
    h1: "Evaluarea garanțiilor",
    h1Span: "pentru eșalonarea la ANAF.",
    lead: "Raportul de evaluare pentru imobilele, terenurile, utilajele sau vehiculele pe care le aduci în garanție, ca să plătești datoriile fiscale în rate, pe până la 5 ani. Întocmit de evaluator autorizat ANEVAR, în termenul cerut de ANAF.",
    requestQuote: "Solicită o ofertă →",
    docsLink: "Ce documente sunt necesare",
    badgeStrong: "Firmă autorizată ANEVAR",
    badgeText: "Rapoarte conforme Standardelor de Evaluare",
    heroAlt: "Clădire de birouri",
    getTitle: "Ce primești",
    get: [
      "Raport de evaluare conform Standardelor de Evaluare ANEVAR",
      "Valoarea de piață pentru fiecare bun adus în garanție",
      "Imobile și bunuri mobile, în același raport sau separat",
      "Livrare rapidă, ca să te încadrezi în termenul ANAF",
    ],
    whyEyebrow: "Cum funcționează",
    whyTitle: "Pentru eșalonarea clasică, ANAF cere garanții evaluate.",
    whyP1: (
      <>
        Eșalonarea clasică îți permite să plătești datoriile fiscale în rate, pe o perioadă de <strong>până la 5 ani</strong>. În schimb, ANAF cere garanții: scrisoare de garanție bancară, poliță de asigurare, ipotecă pe imobile sau gaj pe bunuri mobile. Când aduci în garanție bunuri, trebuie să depui și un <strong>raport de evaluare întocmit de un evaluator autorizat ANEVAR</strong>.
      </>
    ),
    whyP2:
      "După ce primești acordul de principiu, ai 30 de zile să constitui garanțiile; la cerere motivată, termenul poate fi prelungit cu încă 30 de zile. Pentru imobile, ANAF reține valoarea din raport, dar cel mult valoarea orientativă din grila notarilor. De aceea contează un raport corect, făcut la timp.",
    whyNote:
      "Din 2026, eșalonarea simplificată (fără garanții, pe cel mult 12 luni) este limitată la datorii de până la 400.000 lei pentru companiile cu vechime de cel puțin 12 luni și 100.000 lei pentru persoanele fizice. Peste aceste sume se aplică eșalonarea clasică, cu garanții. Regulile se schimbă des, așa că verifică situația ta cu contabilul sau consultantul fiscal.",
    whoEyebrow: "Ce poți aduce în garanție",
    whoTitle: "Evaluăm toate tipurile de bunuri acceptate de ANAF.",
    docsEyebrow: "Documente",
    docsTitle: "Ce documente sunt necesare.",
    docsSmall: "Lista exactă depinde de bunuri. O primești în ofertă, iar documentele le poți trimite online.",
    stepsEyebrow: "Cum decurge",
    stepsTitle: "De la solicitare la raport.",
    startRequest: "Începe solicitarea →",
    faqEyebrow: "Întrebări frecvente",
    faqTitle: "Despre evaluarea pentru eșalonare.",
    ctaTitle: "Ai primit acordul de principiu de la ANAF?",
    ctaText: "Spune-ne ce bunuri aduci în garanție și ce termen ai. Îți trimitem rapid oferta, cu cost, termen și documentele necesare.",
  },
  en: {
    title: "Collateral valuation for ANAF tax instalment plans | VALUEFY",
    description:
      "ANEVAR valuation reports for assets offered as collateral for an instalment plan for tax debts owed to ANAF (the Romanian tax authority): buildings, land, machinery, equipment and vehicles. Anywhere in Romania, within ANAF's deadline.",
    who: [
      ["Buildings and apartments", "Headquarters, offices, warehouses, industrial halls, commercial premises or homes."],
      ["Land", "Inside or outside built-up areas, vacant or with buildings."],
      ["Machinery and equipment", "Production lines, construction or agricultural machinery, industrial equipment."],
      ["Vehicles", "Cars, vans, lorries, trailers or a whole fleet."],
    ],
    docs: [
      "The agreement in principle issued by ANAF, if you have it (it shows the deadline)",
      "For property: a recent land registry extract and the title deed",
      "For property: the cadastral documentation and floor plan",
      "For machinery and equipment: invoices, technical sheets, fixed-asset records",
      "For vehicles: the registration certificate and vehicle identity card",
      "A contact person to accompany us during the inspection",
    ],
    steps: [
      ["Send your request", "Tell us which assets you are offering as collateral, where they are and the deadline ANAF gave you."],
      ["Receive the quote", "We tell you the cost, the delivery time and the exact list of documents."],
      ["Asset inspection", "The valuer visits the property or inspects the machinery and vehicles."],
      ["Valuation report", "You receive the report signed by an ANEVAR-authorised valuer, ready to submit to ANAF."],
    ],
    faq: [
      [
        "When do I need a valuation report for an instalment plan?",
        "When you apply for a standard instalment plan and offer assets as collateral: property (through a mortgage) or movable assets (through a pledge). If the guarantee is a bank guarantee letter, an insurance policy or a cash deposit, no report is needed. The simplified instalment plan requires no collateral.",
      ],
      [
        "Who can prepare the report?",
        "An independent, ANEVAR-authorised valuer qualified for the type of asset: real estate or movable assets. VALUEFY is an ANEVAR-authorised firm and values both.",
      ],
      [
        "What value does ANAF accept for the collateral?",
        "For movable assets, the value in the valuation report. For property, the value in the report, but at most the indicative value from the assessments used by the chamber of notaries. The collateral must cover the amounts in the plan, the interest over its duration and an extra percentage that depends on the length of the plan.",
      ],
      [
        "What if the collateral doesn't cover the whole amount?",
        "Under the Fiscal Procedure Code, if the collateral is worth less than 50% of the tax debts in the plan, the instalment plan can be granted for at most 6 months. If it is worth more than 50% but below the required level, it can be granted for up to 5 years, under additional conditions. Check your situation with the tax office or your tax adviser.",
      ],
      [
        "How quickly will I receive the report?",
        "It depends on the number and type of assets and on their location. We take the 30-day deadline for providing collateral into account and tell you in the quote when you will receive the report.",
      ],
      [
        "Do you value assets in other cities?",
        "Yes, anywhere in Romania: we have offices in Timișoara and Cluj-Napoca and work with a network of ANEVAR-authorised partner valuers.",
      ],
    ],
    serviceName: "Collateral valuation for ANAF instalment plans",
    serviceType: "Valuation of assets offered as collateral for a tax instalment plan",
    breadcrumbName: "ANAF instalment plan valuation",
    home: "Home",
    services: "Services",
    crumb: "ANAF instalment plan",
    h1: "Collateral valuation",
    h1Span: "for ANAF instalment plans.",
    lead: "The valuation report for the buildings, land, machinery or vehicles you offer as collateral, so you can pay your tax debts in instalments over up to 5 years. Prepared by an ANEVAR-authorised valuer, within ANAF's deadline.",
    requestQuote: "Request a quote →",
    docsLink: "Which documents are needed",
    badgeStrong: "ANEVAR-authorised firm",
    badgeText: "Reports in line with the Valuation Standards",
    heroAlt: "Office building",
    getTitle: "What you get",
    get: [
      "A valuation report in line with the ANEVAR Valuation Standards",
      "The market value of each asset offered as collateral",
      "Property and movable assets, in one report or separately",
      "Fast delivery, so you meet ANAF's deadline",
    ],
    whyEyebrow: "How it works",
    whyTitle: "For a standard instalment plan, ANAF requires valued collateral.",
    whyP1: (
      <>
        A standard instalment plan lets you pay your tax debts in instalments over <strong>up to 5 years</strong>. In return, ANAF asks for collateral: a bank guarantee letter, an insurance policy, a mortgage on property or a pledge on movable assets. When you offer assets as collateral, you must also submit a <strong>valuation report prepared by an ANEVAR-authorised valuer</strong>.
      </>
    ),
    whyP2:
      "Once you receive the agreement in principle, you have 30 days to provide the collateral; on a justified request, the deadline can be extended by another 30 days. For property, ANAF takes the value in the report, but at most the indicative value from the notaries' price grid. That is why an accurate report, delivered on time, matters.",
    whyNote:
      "From 2026, the simplified instalment plan (no collateral, up to 12 months) is limited to debts of up to 400,000 lei for companies registered for at least 12 months and 100,000 lei for individuals. Above these amounts the standard plan, with collateral, applies. The rules change often, so check your situation with your accountant or tax adviser.",
    whoEyebrow: "What you can offer as collateral",
    whoTitle: "We value every type of asset ANAF accepts.",
    docsEyebrow: "Documents",
    docsTitle: "Documents needed.",
    docsSmall: "The exact list depends on the assets. You'll receive it with the quote, and you can send the documents online.",
    stepsEyebrow: "How it works",
    stepsTitle: "From request to report.",
    startRequest: "Start your request →",
    faqEyebrow: "Frequently asked questions",
    faqTitle: "About valuation for instalment plans.",
    ctaTitle: "Received your agreement in principle from ANAF?",
    ctaText: "Tell us which assets you are offering as collateral and your deadline. We'll quickly send you a quote with the cost, timeframe and documents needed.",
  },
};

export function anafMetadata(lang: Lang): Metadata {
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
          { "@type": "ListItem", position: 2, name: t.breadcrumbName, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: t.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
  };
}

export function AnafValuationView({ lang }: { lang: Lang }) {
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
                <AssistantButton purpose={PURPOSE} className={s.cta}>{t.requestQuote}</AssistantButton>
                <a href="#documente" className={s.ghost}>{t.docsLink}</a>
              </div>
              <div className={s.badge}>
                <span className={s.seal} aria-hidden="true"><b>✓</b><small>ANEVAR</small></span>
                <span className={s.badgeText}><strong>{t.badgeStrong}</strong><span>{t.badgeText}</span></span>
              </div>
            </div>
            <div className={s.heroVisual}>
              <div className={s.photo}>
                <Image src={unsplash("photo-1497366216548-37526070297c", 1200)} alt={t.heroAlt} fill priority sizes="(max-width: 900px) 100vw, 520px" />
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

        {/* Why it matters */}
        <section aria-labelledby="why-title" className={`container ${s.section}`}>
          <div className={s.split}>
            <div className={s.splitHead}>
              <div className="eyebrow">{t.whyEyebrow}</div>
              <h2 id="why-title" className="h2">{t.whyTitle}</h2>
            </div>
            <div data-rv className={s.prose}>
              <p>{t.whyP1}</p>
              <p>{t.whyP2}</p>
              <div className={s.note}>{t.whyNote}</div>
            </div>
          </div>
        </section>

        {/* Who needs it */}
        <section aria-labelledby="who-title" className={s.band}>
          <div className={`container ${s.section}`}>
            <div className="eyebrow">{t.whoEyebrow}</div>
            <h2 id="who-title" className="h2">{t.whoTitle}</h2>
            <ul data-rv className={s.cards}>
              {t.who.map(([title, d], i) => (
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
              <AssistantButton purpose={PURPOSE} className={s.ctaLight}>{t.startRequest}</AssistantButton>
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
            <AssistantButton purpose={PURPOSE} className={s.ctaWhite}>{t.requestQuote}</AssistantButton>
          </div>
        </section>
      </main>
      <Footer />
      <RevealOnScroll />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }} />
    </AssistantProvider>
  );
}
