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

// Shared by /evaluare-pentru-impozitare and /en/tax-valuation — see page.tsx in both route trees.

const PATH = "/evaluare-pentru-impozitare";
// Stored purpose value passed to the assistant — stays Romanian in both languages.
const PURPOSE = "Impozitare";

const T = {
  ro: {
    title: "Evaluare clădiri pentru impozitare | VALUEFY",
    description:
      "Raport de evaluare pentru stabilirea valorii impozabile a clădirilor, întocmit de evaluator autorizat ANEVAR. Pentru companii și persoane fizice, în Timișoara și în toată țara.",
    who: [
      ["Companii cu clădiri în proprietate", "Sedii, birouri, hale, depozite sau spații comerciale deținute de persoane juridice."],
      ["Clădiri noi sau modernizate", "Construcții finalizate, extinderi sau renovări care schimbă valoarea clădirii."],
      ["Actualizarea valorii impozabile", "Când valoarea din evidența fiscală trebuie actualizată printr-un raport nou."],
      ["Persoane fizice cu spații nerezidențiale", "Spații folosite pentru activități economice sau clădiri cu destinație mixtă."],
    ],
    docs: [
      "Extras de carte funciară, recent",
      "Actul de proprietate (contract, certificat de moștenitor, autorizație și proces-verbal de recepție)",
      "Documentația cadastrală și releveul clădirii",
      "Autorizația de construire, pentru clădirile noi sau extinse",
      "Situația lucrărilor de modernizare, dacă au existat",
      "Pentru companii: fișa mijlocului fix sau datele din evidența contabilă",
    ],
    steps: [
      ["Trimiți solicitarea", "Ne spui ce clădire este și unde se află. Durează câteva minute, din asistentul de pe site."],
      ["Primești oferta", "Îți comunicăm costul, termenul și lista exactă de documente pentru clădirea ta."],
      ["Inspecția clădirii", "Evaluatorul vizitează proprietatea și verifică documentele primite."],
      ["Raportul de evaluare", "Primești raportul semnat de evaluator autorizat, gata de depus la direcția de taxe locale."],
    ],
    faq: [
      [
        "Cine are nevoie de o evaluare pentru impozitare?",
        "În principal companiile care dețin clădiri, pentru că, potrivit Codului fiscal, impozitul pe clădirile lor se calculează pe baza valorii impozabile, care se stabilește și se actualizează printr-un raport de evaluare. În anumite situații, raportul poate fi necesar și persoanelor fizice, de exemplu pentru spațiile folosite în activități economice.",
      ],
      [
        "Cât de des trebuie refăcută evaluarea?",
        "Legea prevede actualizarea periodică a valorii impozabile, iar dacă aceasta nu este actualizată la timp, impozitul se poate calcula cu o cotă majorată. Periodicitatea și cotele exacte sunt stabilite de Codul fiscal și de hotărârile consiliului local, așa că le confirmăm pentru situația ta, împreună cu contabilul tău.",
      ],
      [
        "Unde se depune raportul?",
        "La direcția de taxe și impozite locale a localității în care se află clădirea, împreună cu declarația fiscală, în termenul prevăzut de lege.",
      ],
      [
        "Cât costă și în cât timp primesc raportul?",
        "Depinde de tipul și mărimea clădirii, de localizare și de documentele disponibile. Trimite-ne câteva informații și îți comunicăm oferta, cu cost și termen, înainte de începerea lucrării.",
      ],
      [
        "Evaluați și în afara Timișoarei?",
        "Da, evaluăm oriunde în România. Avem birouri în Timișoara și Cluj-Napoca, iar în restul țării lucrăm cu evaluatori colaboratori autorizați ANEVAR, cu același proces și standard de calitate.",
      ],
    ],
    serviceName: "Evaluare clădiri pentru impozitare",
    serviceType: "Evaluare imobiliară în scop fiscal",
    breadcrumbName: "Evaluare pentru impozitare",
    home: "Acasă",
    services: "Servicii",
    crumb: "Impozitare",
    h1: "Evaluarea clădirilor",
    h1Span: "pentru impozitare.",
    lead: "Raport de evaluare pentru stabilirea valorii impozabile a clădirilor, întocmit de evaluator autorizat ANEVAR și gata de depus la direcția de taxe locale.",
    requestQuote: "Solicită o ofertă →",
    docsLink: "Ce documente sunt necesare",
    badgeStrong: "Firmă autorizată ANEVAR",
    badgeText: "Rapoarte conforme Standardelor de Evaluare",
    heroAlt: "Clădire de birouri",
    getTitle: "Ce primești",
    get: [
      "Raport de evaluare conform Standardelor de Evaluare",
      "Semnat de evaluator autorizat ANEVAR",
      "Valoarea necesară pentru declarația fiscală",
      "Disponibil și în portalul client",
    ],
    whyEyebrow: "De ce contează",
    whyTitle: "Valoarea din raport stă la baza impozitului pe clădire.",
    whyP1: (
      <>
        Pentru clădirile deținute de companii, impozitul local se calculează pe baza <strong>valorii impozabile</strong> a clădirii. Codul fiscal prevede ca această valoare să fie stabilită și actualizată periodic printr-un <strong>raport de evaluare întocmit de un evaluator autorizat</strong>.
      </>
    ),
    whyP2:
      "Un raport corect și la zi înseamnă un impozit calculat pe valoarea reală a clădirii. Dacă valoarea nu este actualizată în termenul legal, impozitul se poate calcula cu o cotă majorată.",
    whyNote:
      "Regulile exacte (cote, termene, excepții) depind de tipul clădirii, de proprietar și de hotărârile consiliului local. Le verificăm pentru situația ta, iar pentru obligațiile fiscale recomandăm să te consulți și cu contabilul.",
    whoEyebrow: "Pentru cine",
    whoTitle: "Când ai nevoie de o evaluare în scop fiscal.",
    docsEyebrow: "Documente",
    docsTitle: "Ce documente sunt necesare.",
    docsSmall: "Lista exactă depinde de clădire. O primești în ofertă, iar documentele le poți trimite online.",
    stepsEyebrow: "Cum decurge",
    stepsTitle: "De la solicitare la raport.",
    startRequest: "Începe solicitarea →",
    faqEyebrow: "Întrebări frecvente",
    faqTitle: "Despre evaluarea pentru impozitare.",
    ctaTitle: "Ai nevoie de raportul pentru impozitare?",
    ctaText: "Spune-ne ce clădire este și unde se află. Îți trimitem oferta cu cost, termen și documentele necesare.",
  },
  en: {
    title: "Building valuation for tax purposes | VALUEFY",
    description:
      "Valuation report to establish the taxable value of buildings for local building tax, prepared by an ANEVAR-authorised valuer. For companies and individuals, in Timișoara and across Romania.",
    who: [
      ["Companies that own buildings", "Headquarters, offices, warehouses, industrial halls or commercial premises owned by legal entities."],
      ["New or modernised buildings", "Completed constructions, extensions or renovations that change the building's value."],
      ["Updating the taxable value", "When the value held in the tax records has to be updated with a new report."],
      ["Individuals with non-residential premises", "Premises used for business activities or mixed-use buildings."],
    ],
    docs: [
      "Recent land registry extract",
      "Title deed (contract, certificate of inheritance, building permit and handover certificate)",
      "Cadastral documentation and the building's measured survey",
      "Building permit, for new or extended buildings",
      "Details of any modernisation works carried out",
      "For companies: the fixed asset record or the data from the accounting records",
    ],
    steps: [
      ["Send your request", "Tell us which building it is and where it is. It takes a few minutes, through the assistant on our site."],
      ["Receive the quote", "We tell you the cost, the timeframe and the exact list of documents for your building."],
      ["Building inspection", "The valuer visits the property and checks the documents received."],
      ["Valuation report", "You receive the report signed by an authorised valuer, ready to submit to the local tax office."],
    ],
    faq: [
      [
        "Who needs a valuation for tax purposes?",
        "Mainly companies that own buildings: under the Romanian Tax Code, the local building tax on their buildings is calculated on the taxable value, which is established and updated through a valuation report. In some cases individuals may also need the report, for example for premises used for business activities.",
      ],
      [
        "How often does the valuation have to be redone?",
        "The law requires the taxable value to be updated periodically, and if it isn't updated on time, the tax may be calculated at a higher rate. The exact intervals and rates are set by the Tax Code and by local council decisions, so we confirm them for your situation, together with your accountant.",
      ],
      [
        "Where is the report submitted?",
        "To the local tax office (direcția de taxe și impozite locale) of the town or city where the building is located, together with the tax return, within the deadline set by law.",
      ],
      [
        "How much does it cost and how soon will I receive the report?",
        "It depends on the type and size of the building, its location and the documents available. Send us a few details and we'll give you a quote, with cost and timeframe, before any work begins.",
      ],
      [
        "Do you carry out valuations outside Timișoara?",
        "Yes, we carry out valuations anywhere in Romania. We have offices in Timișoara and Cluj-Napoca, and elsewhere in the country we work with partner ANEVAR-authorised valuers, with the same process and quality standard.",
      ],
    ],
    serviceName: "Building valuation for tax purposes",
    serviceType: "Real estate valuation for tax purposes",
    breadcrumbName: "Tax valuation",
    home: "Home",
    services: "Services",
    crumb: "Taxation",
    h1: "Building valuation",
    h1Span: "for tax purposes.",
    lead: "A valuation report to establish the taxable value of buildings, prepared by an ANEVAR-authorised valuer and ready to submit to the local tax office.",
    requestQuote: "Request a quote →",
    docsLink: "Which documents are needed",
    badgeStrong: "ANEVAR-authorised firm",
    badgeText: "Reports in line with the Valuation Standards",
    heroAlt: "Office building",
    getTitle: "What you get",
    get: [
      "Valuation report in line with the Valuation Standards",
      "Signed by an ANEVAR-authorised valuer",
      "The value needed for your tax return",
      "Also available in the client portal",
    ],
    whyEyebrow: "Why it matters",
    whyTitle: "The value in the report is the basis of the building tax.",
    whyP1: (
      <>
        For buildings owned by companies, the local building tax is calculated on the building&apos;s <strong>taxable value</strong>. The Romanian Tax Code requires this value to be established and updated periodically through a <strong>valuation report prepared by an authorised valuer</strong>.
      </>
    ),
    whyP2:
      "An accurate, up-to-date report means tax calculated on the building's real value. If the value isn't updated within the legal deadline, the tax may be calculated at a higher rate.",
    whyNote:
      "The exact rules (rates, deadlines, exemptions) depend on the type of building, the owner and local council decisions. We check them for your situation, and for your tax obligations we recommend you also consult your accountant.",
    whoEyebrow: "Who it's for",
    whoTitle: "When you need a valuation for tax purposes.",
    docsEyebrow: "Documents",
    docsTitle: "Documents needed.",
    docsSmall: "The exact list depends on the building. You'll receive it with the quote, and you can send the documents online.",
    stepsEyebrow: "How it works",
    stepsTitle: "From request to report.",
    startRequest: "Start your request →",
    faqEyebrow: "Frequently asked questions",
    faqTitle: "About valuation for tax purposes.",
    ctaTitle: "Need a valuation report for tax purposes?",
    ctaText: "Tell us which building it is and where it is. We'll send you a quote with the cost, timeframe and documents needed.",
  },
};

export function taxMetadata(lang: Lang): Metadata {
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

export function TaxValuationView({ lang }: { lang: Lang }) {
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
                <Image src={unsplash("photo-1486406146926-c627a92ad1ab", 1200)} alt={t.heroAlt} fill priority sizes="(max-width: 900px) 100vw, 520px" />
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
