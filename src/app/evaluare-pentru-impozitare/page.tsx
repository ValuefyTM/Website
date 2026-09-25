import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/config/site";
import { unsplash } from "@/lib/icons";
import { AssistantProvider } from "@/components/Assistant";
import { AssistantButton } from "@/components/AssistantButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Closing";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import s from "./page.module.css";

const PATH = "/evaluare-pentru-impozitare";
const TITLE = "Evaluare clădiri pentru impozitare | VALUEFY";
const DESCRIPTION =
  "Raport de evaluare pentru stabilirea valorii impozabile a clădirilor, întocmit de evaluator autorizat ANEVAR. Pentru companii și persoane fizice, în Timișoara și în toată țara.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, siteName: "VALUEFY", locale: "ro_RO", type: "website", images: ["/opengraph-image.png"] },
};

const WHO = [
  ["Companii cu clădiri în proprietate", "Sedii, birouri, hale, depozite sau spații comerciale deținute de persoane juridice."],
  ["Clădiri noi sau modernizate", "Construcții finalizate, extinderi sau renovări care schimbă valoarea clădirii."],
  ["Actualizarea valorii impozabile", "Când valoarea din evidența fiscală trebuie actualizată printr-un raport nou."],
  ["Persoane fizice cu spații nerezidențiale", "Spații folosite pentru activități economice sau clădiri cu destinație mixtă."],
];

const DOCS = [
  "Extras de carte funciară, recent",
  "Actul de proprietate (contract, certificat de moștenitor, autorizație și proces-verbal de recepție)",
  "Documentația cadastrală și releveul clădirii",
  "Autorizația de construire, pentru clădirile noi sau extinse",
  "Situația lucrărilor de modernizare, dacă au existat",
  "Pentru companii: fișa mijlocului fix sau datele din evidența contabilă",
];

const STEPS = [
  ["Trimiți solicitarea", "Ne spui ce clădire este și unde se află. Durează câteva minute, din asistentul de pe site."],
  ["Primești oferta", "Îți comunicăm costul, termenul și lista exactă de documente pentru clădirea ta."],
  ["Inspecția clădirii", "Evaluatorul vizitează proprietatea și verifică documentele primite."],
  ["Raportul de evaluare", "Primești raportul semnat de evaluator autorizat, gata de depus la direcția de taxe locale."],
];

const FAQ = [
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
    "Da. Lucrăm în principal în Timișoara și vestul României, dar realizăm evaluări și în alte localități. Trimite solicitarea și îți confirmăm disponibilitatea.",
  ],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Evaluare clădiri pentru impozitare",
      serviceType: "Evaluare imobiliară în scop fiscal",
      description: DESCRIPTION,
      url: `${site.url}${PATH}`,
      areaServed: ["Timișoara", "Vestul României", "România"],
      provider: { "@type": "ProfessionalService", name: site.name, url: site.url, telephone: site.phone, email: site.email },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Acasă", item: site.url },
        { "@type": "ListItem", position: 2, name: "Evaluare pentru impozitare", item: `${site.url}${PATH}` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ],
};

export default function TaxValuationPage() {
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
                <a href="/">Acasă</a><span aria-hidden="true">/</span><a href="/#servicii">Servicii</a><span aria-hidden="true">/</span>
                <span aria-current="page">Impozitare</span>
              </nav>
              <h1 id="page-title" className={s.title}>
                Evaluarea clădirilor <span>pentru impozitare.</span>
              </h1>
              <p className={s.lead}>
                Raport de evaluare pentru stabilirea valorii impozabile a clădirilor, întocmit de evaluator autorizat ANEVAR și gata de depus la direcția de taxe locale.
              </p>
              <div className={s.heroActions}>
                <AssistantButton purpose="Impozitare" className={s.cta}>Solicită o ofertă →</AssistantButton>
                <a href="#documente" className={s.ghost}>Ce documente sunt necesare</a>
              </div>
              <div className={s.badge}>
                <span className={s.seal} aria-hidden="true"><b>✓</b><small>ANEVAR</small></span>
                <span className={s.badgeText}><strong>Firmă autorizată ANEVAR</strong><span>Rapoarte conforme Standardelor de Evaluare</span></span>
              </div>
            </div>
            <div className={s.heroVisual}>
              <div className={s.photo}>
                <Image src={unsplash("photo-1486406146926-c627a92ad1ab", 1200)} alt="Clădire de birouri" fill priority sizes="(max-width: 900px) 100vw, 520px" />
              </div>
              <div className={s.getCard}>
                <div className={s.getTitle}>Ce primești</div>
                <ul>
                  <li><span>✓</span>Raport de evaluare conform Standardelor de Evaluare</li>
                  <li><span>✓</span>Semnat de evaluator autorizat ANEVAR</li>
                  <li><span>✓</span>Valoarea necesară pentru declarația fiscală</li>
                  <li><span>✓</span>Disponibil și în portalul client</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why it matters */}
        <section aria-labelledby="why-title" className={`container ${s.section}`}>
          <div className={s.split}>
            <div className={s.splitHead}>
              <div className="eyebrow">De ce contează</div>
              <h2 id="why-title" className="h2">Valoarea din raport stă la baza impozitului pe clădire.</h2>
            </div>
            <div data-rv className={s.prose}>
              <p>
                Pentru clădirile deținute de companii, impozitul local se calculează pe baza <strong>valorii impozabile</strong> a clădirii. Codul fiscal prevede ca această valoare să fie stabilită și actualizată periodic printr-un <strong>raport de evaluare întocmit de un evaluator autorizat</strong>.
              </p>
              <p>
                Un raport corect și la zi înseamnă un impozit calculat pe valoarea reală a clădirii. Dacă valoarea nu este actualizată în termenul legal, impozitul se poate calcula cu o cotă majorată.
              </p>
              <div className={s.note}>
                Regulile exacte (cote, termene, excepții) depind de tipul clădirii, de proprietar și de hotărârile consiliului local. Le verificăm pentru situația ta, iar pentru obligațiile fiscale recomandăm să te consulți și cu contabilul.
              </div>
            </div>
          </div>
        </section>

        {/* Who needs it */}
        <section aria-labelledby="who-title" className={s.band}>
          <div className={`container ${s.section}`}>
            <div className="eyebrow">Pentru cine</div>
            <h2 id="who-title" className="h2">Când ai nevoie de o evaluare în scop fiscal.</h2>
            <ul data-rv className={s.cards}>
              {WHO.map(([t, d], i) => (
                <li key={t}>
                  <span className={s.cardN}>{String(i + 1).padStart(2, "0")}</span>
                  <b>{t}</b>
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
              <div className="eyebrow">Documente</div>
              <h2 id="docs-title" className="h2">Ce documente sunt necesare.</h2>
              <ul>
                {DOCS.map((d) => (
                  <li key={d}><span aria-hidden="true">✓</span>{d}</li>
                ))}
              </ul>
              <p className={s.small}>Lista exactă depinde de clădire. O primești în ofertă, iar documentele le poți trimite online.</p>
            </div>
            <div data-rv className={s.stepsBox}>
              <div className={s.stepsEyebrow}>Cum decurge</div>
              <h2 className={s.stepsTitle}>De la solicitare la raport.</h2>
              <ol>
                {STEPS.map(([t, d], i) => (
                  <li key={t}>
                    <span className={s.stepN}>{String(i + 1).padStart(2, "0")}</span>
                    <span><b>{t}</b><span>{d}</span></span>
                  </li>
                ))}
              </ol>
              <AssistantButton purpose="Impozitare" className={s.ctaLight}>Începe solicitarea →</AssistantButton>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className={s.band}>
          <div className={`container ${s.section} ${s.faqWrap}`}>
            <div>
              <div className="eyebrow">Întrebări frecvente</div>
              <h2 id="faq-title" className="h2">Despre evaluarea pentru impozitare.</h2>
            </div>
            <div data-rv className={s.faq}>
              {FAQ.map(([q, a], i) => (
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
            <h2 id="cta-title">Ai nevoie de raportul pentru impozitare?</h2>
            <p>Spune-ne ce clădire este și unde se află. Îți trimitem oferta cu cost, termen și documentele necesare.</p>
            <AssistantButton purpose="Impozitare" className={s.ctaWhite}>Solicită o ofertă →</AssistantButton>
          </div>
        </section>
      </main>
      <Footer />
      <RevealOnScroll />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </AssistantProvider>
  );
}
