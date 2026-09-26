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
import s from "@/components/Landing.module.css";
import m from "./page.module.css";

const PATH = "/evaluare-bunuri-mobile";
const TITLE = "Evaluare bunuri mobile: utilaje, echipamente, vehicule | VALUEFY";
const DESCRIPTION =
  "Evaluarea utilajelor de construcții și agricole, a liniilor de producție, vehiculelor și echipamentelor, de evaluator autorizat ANEVAR. Pentru credit, raportare financiară, vânzare sau insolvență.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, siteName: "VALUEFY", locale: "ro_RO", type: "website", images: ["/opengraph-image.png"] },
};

const CATEGORIES = [
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
];

const PURPOSES = [
  ["Credit și leasing", "Bunurile aduse în garanție la bancă sau la societatea de leasing."],
  ["Raportare financiară", "Reevaluarea mijloacelor fixe pentru situațiile financiare."],
  ["Vânzare sau aport la capital", "Valoarea de piață înainte de o tranzacție sau de aportul în natură."],
  ["Insolvență și executare", "Evaluări pentru lichidatori, administratori judiciari și executori."],
  ["Asigurare", "Valoarea bunurilor pentru stabilirea sumei asigurate."],
  ["Partaj, succesiune, litigii", "Rapoarte pentru împărțirea bunurilor sau pentru instanță."],
];

const DOCS = [
  "Lista bunurilor (inventar sau registrul mijloacelor fixe)",
  "Facturile de achiziție, dacă sunt disponibile",
  "Fișe tehnice: marcă, model, an de fabricație, serie",
  "Pentru vehicule: certificatul de înmatriculare și cartea de identitate a vehiculului",
  "Ore de funcționare sau kilometraj, istoricul reparațiilor și reviziilor",
  "Fotografii recente, dacă inspecția nu se face imediat",
];

const STEPS = [
  ["Trimiți solicitarea", "Ne spui ce bunuri sunt, câte și unde se află. Poți încărca lista din asistent."],
  ["Primești oferta", "Îți comunicăm costul, termenul și documentele necesare pentru bunurile tale."],
  ["Inspecția bunurilor", "Evaluatorul identifică bunurile la fața locului și verifică starea tehnică."],
  ["Raportul de evaluare", "Primești raportul semnat de evaluator autorizat, pentru bancă, auditor sau instanță."],
];

const FAQ = [
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
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Evaluare bunuri mobile",
      serviceType: "Evaluarea utilajelor, echipamentelor și vehiculelor",
      description: DESCRIPTION,
      url: `${site.url}${PATH}`,
      areaServed: ["Timișoara", "Cluj-Napoca", "România"],
      provider: { "@type": "ProfessionalService", name: site.name, url: site.url, telephone: site.phone, email: site.email },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Acasă", item: site.url },
        { "@type": "ListItem", position: 2, name: "Evaluare bunuri mobile", item: `${site.url}${PATH}` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ],
};

export default function MovableAssetsPage() {
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
                <span aria-current="page">Bunuri mobile</span>
              </nav>
              <h1 id="page-title" className={s.title}>
                Evaluarea bunurilor mobile. <span>Utilaje, echipamente, vehicule.</span>
              </h1>
              <p className={s.lead}>
                De la un singur excavator la toate mijloacele fixe ale unei fabrici: rapoarte de evaluare întocmite de evaluator autorizat ANEVAR, pentru bancă, auditor, lichidator sau instanță.
              </p>
              <div className={s.heroActions}>
                <AssistantButton type_={MOBILE} className={s.cta}>Solicită o ofertă →</AssistantButton>
                <a href="#ce-evaluam" className={s.ghost}>Ce evaluăm</a>
              </div>
              <div className={s.badge}>
                <span className={s.seal} aria-hidden="true"><b>✓</b><small>ANEVAR</small></span>
                <span className={s.badgeText}><strong>Firmă autorizată ANEVAR</strong><span>Rapoarte conforme Standardelor de Evaluare</span></span>
              </div>
            </div>
            <div className={s.heroVisual}>
              <div className={s.photo}>
                <Image src={unsplash("photo-1586528116311-ad8dd3c8310d", 1200)} alt="Hală industrială cu echipamente" fill priority sizes="(max-width: 900px) 100vw, 520px" />
              </div>
              <div className={s.getCard}>
                <div className={s.getTitle}>Ce primești</div>
                <ul>
                  <li><span>✓</span>Raport de evaluare conform Standardelor de Evaluare</li>
                  <li><span>✓</span>Identificarea bunurilor și a stării tehnice</li>
                  <li><span>✓</span>Un singur raport pentru tot inventarul</li>
                  <li><span>✓</span>Disponibil și în portalul client</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="ce-evaluam" aria-labelledby="cat-title" className={`container anchor ${s.section}`}>
          <div className="eyebrow">Ce evaluăm</div>
          <h2 id="cat-title" className="h2">Exemple de bunuri mobile pe care le evaluăm.</h2>
          <p className={m.intro}>
            Evaluăm bunuri individuale sau inventare complete, pentru companii și persoane fizice. Lista de mai jos conține doar exemple — dacă bunul tău nu apare, descrie-l în solicitare.
          </p>
          <ul data-rv className={m.grid}>
            {CATEGORIES.map((c) => (
              <li key={c.t} className={m.card}>
                <div className={m.media}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/illustrations/${c.img}.svg`} alt="" width={400} height={260} loading="lazy" />
                </div>
                <div className={m.body}>
                  <h3>{c.t}</h3>
                  <ul className={m.chips} aria-label={`Exemple: ${c.t}`}>
                    {c.items.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                  <AssistantButton type_={MOBILE} className={m.cardCta}>Solicită evaluare →</AssistantButton>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Purposes */}
        <section aria-labelledby="why-title" className={s.band}>
          <div className={`container ${s.section}`}>
            <div className="eyebrow">Scopul evaluării</div>
            <h2 id="why-title" className="h2">Când ai nevoie de evaluarea bunurilor mobile.</h2>
            <ul data-rv className={s.cards}>
              {PURPOSES.map(([t, d], i) => (
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
              <h2 id="docs-title" className="h2">Ce documente sunt utile.</h2>
              <ul>
                {DOCS.map((d) => (
                  <li key={d}><span aria-hidden="true">✓</span>{d}</li>
                ))}
              </ul>
              <p className={s.small}>Lista exactă depinde de bunuri și de scop. O primești în ofertă, iar documentele le poți trimite online.</p>
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
              <AssistantButton type_={MOBILE} className={s.ctaLight}>Începe solicitarea →</AssistantButton>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className={s.band}>
          <div className={`container ${s.section} ${s.faqWrap}`}>
            <div>
              <div className="eyebrow">Întrebări frecvente</div>
              <h2 id="faq-title" className="h2">Despre evaluarea bunurilor mobile.</h2>
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
            <h2 id="cta-title">Ai utilaje sau echipamente de evaluat?</h2>
            <p>Spune-ne ce bunuri sunt și unde se află. Îți trimitem oferta cu cost, termen și documentele necesare.</p>
            <AssistantButton type_={MOBILE} className={s.ctaWhite}>Solicită o ofertă →</AssistantButton>
          </div>
        </section>
      </main>
      <Footer />
      <RevealOnScroll />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </AssistantProvider>
  );
}
