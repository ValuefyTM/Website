import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssistantProvider } from "@/components/Assistant";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Closing";
import { LISTINGS, findListing, formatEur, reportDate } from "@/lib/listings";
import { ReportRequestForm } from "./ReportRequestForm";
import s from "./raport.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return LISTINGS.filter((l) => l.report).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = findListing((await params).slug);
  return l ? { title: `Solicită raportul de evaluare — ${l.title} | VALUEFY`, robots: { index: false, follow: false } } : {};
}

export default async function ReportRequestPage({ params }: Props) {
  const l = findListing((await params).slug);
  if (!l || !l.report) notFound();

  return (
    <AssistantProvider>
      <Header />
      <main id="top" className={s.page}>
        <div className={`container ${s.inner}`}>
          <nav aria-label="Breadcrumb" className={s.crumbs}>
            <a href="/">Acasă</a><span aria-hidden="true">/</span>
            <a href="/imobiliare">Proprietăți de vânzare</a><span aria-hidden="true">/</span>
            <a href={`/imobiliare/${l.slug}`}>{l.city}</a><span aria-hidden="true">/</span>
            <span aria-current="page">Raport de evaluare</span>
          </nav>

          <div className={s.layout}>
            <div className={s.intro}>
              <div className="eyebrow">Raport de evaluare</div>
              <h1 className={s.title}>Solicită raportul de evaluare al proprietății.</h1>
              <p className={s.lead}>
                Completează câteva date și îți trimitem raportul pe email. Le folosim ca să știm cine consultă raportul și ca să te putem contacta pentru detalii sau o vizionare.
              </p>

              <a href={`/imobiliare/${l.slug}`} className={s.property}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.photos[0]} alt="" />
                <span>
                  <b>{l.title}</b>
                  <small>{l.zone}, {l.city} · {formatEur(l.price)}</small>
                  <em>✓ Raport ANEVAR · {reportDate(l.report.date)}</em>
                </span>
              </a>

              <ol className={s.steps}>
                <li><b>Completezi formularul</b><span>Durează sub un minut.</span></li>
                <li><b>Verificăm solicitarea</b><span>Confirmăm datele, de regulă în aceeași zi lucrătoare.</span></li>
                <li><b>Primești raportul pe email</b><span>Împreună cu datele de contact ale consultantului.</span></li>
              </ol>
            </div>

            <ReportRequestForm listingTitle={l.title} />
          </div>
        </div>
      </main>
      <Footer />
    </AssistantProvider>
  );
}
