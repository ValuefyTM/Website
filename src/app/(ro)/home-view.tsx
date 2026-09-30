import type { Metadata } from "next";
import { site } from "@/config/site";
import { AssistantProvider } from "@/components/Assistant";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PropertyTypes, Purposes } from "@/components/Selectors";
import { HowItWorks, PortalShowcase, Services } from "@/components/Process";
import { Clients, Coverage, Trust } from "@/components/Trust";
import { Faq } from "@/components/Faq";
import { FAQS } from "@/lib/faqs";
import { FinalCta, Footer } from "@/components/Closing";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { EstateBand, ListingsCarousel } from "@/components/ListingsCarousel";
import { getDb } from "@/lib/db";
import { listPublished } from "@/lib/listings-db";
import type { Listing } from "@/lib/listing-format";

import { setLang } from "@/i18n/server";
import { localize, type Lang } from "@/i18n/lang";

// Shared by / and /en — see page.tsx in both route trees.

export function homeMetadata(lang: Lang): Metadata {
  return {
    alternates: { canonical: localize(lang, "/"), languages: { ro: "/", en: "/en" } },
  };
}

const LD = {
  ro: { description: "Evaluări imobiliare și de bunuri mobile. Firmă autorizată ANEVAR.", country: "România" },
  en: { description: "Property and movable asset valuations. ANEVAR-authorised firm.", country: "Romania" },
};

const jsonLd = (lang: Lang) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      name: site.name,
      url: `${site.url}${lang === "en" ? "/en" : ""}`,
      logo: `${site.url}/valuefy-logo.png`,
      telephone: site.phone,
      email: site.email,
      description: LD[lang].description,
      areaServed: ["Timișoara", "Cluj-Napoca", LD[lang].country],
    },
    {
      "@type": "FAQPage",
      inLanguage: lang,
      mainEntity: FAQS[lang].map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ],
});

async function featured(): Promise<Listing[]> {
  try {
    const db = await getDb();
    return db ? (await listPublished(db)).slice(0, 12) : [];
  } catch (error) {
    console.error("[home] could not load listings", error);
    return [];
  }
}

export async function HomeView({ lang }: { lang: Lang }) {
  setLang(lang);
  const listings = await featured();
  return (
    <AssistantProvider>
      <Header />
      <main id="top">
        <Hero />
        <PropertyTypes />
        <Purposes />
        {listings.length ? <ListingsCarousel listings={listings} /> : <EstateBand />}
        <HowItWorks />
        <Services />
        <PortalShowcase />
        <Trust />
        <Coverage />
        <Clients />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <RevealOnScroll />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang))}} />
    </AssistantProvider>
  );
}
