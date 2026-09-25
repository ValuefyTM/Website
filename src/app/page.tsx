import { site } from "@/config/site";
import { AssistantProvider } from "@/components/Assistant";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PropertyTypes, Purposes } from "@/components/Selectors";
import { HowItWorks, PortalShowcase, Services } from "@/components/Process";
import { Clients, Trust } from "@/components/Trust";
import { Faq } from "@/components/Faq";
import { FAQS } from "@/lib/faqs";
import { FinalCta, Footer } from "@/components/Closing";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      name: site.name,
      url: site.url,
      logo: `${site.url}/valuefy-logo.png`,
      telephone: site.phone,
      email: site.email,
      description: "Servicii profesionale de evaluare imobiliară. Firmă autorizată ANEVAR.",
      areaServed: ["Timișoara", "Vestul României", "România"],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ],
};

export default function Home() {
  return (
    <AssistantProvider>
      <Header />
      <main id="top">
        <Hero />
        <PropertyTypes />
        <Purposes />
        <HowItWorks />
        <Services />
        <PortalShowcase />
        <Trust />
        <Clients />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <RevealOnScroll />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </AssistantProvider>
  );
}
