import type { Metadata } from "next";
import { AssistantProvider } from "@/components/Assistant";
import { AssistantButton } from "@/components/AssistantButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Closing";
import { getDb } from "@/lib/db";
import { listPublished } from "@/lib/listings-db";
import type { Listing } from "@/lib/listing-format";
import { ListingsBrowser } from "./ListingsBrowser";
import s from "./imobiliare.module.css";

export const metadata: Metadata = {
  title: "Proprietăți de vânzare | VALUEFY",
  description: "Apartamente, case, terenuri și spații comerciale de vânzare, cu comision 0% la cumpărare, prezentate transparent de echipa VALUEFY.",
  alternates: { canonical: "/imobiliare" },
};

// Listings come from the database, so render on every request.
export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const db = await getDb();
  let listings: Listing[] = [];
  try {
    if (db) listings = await listPublished(db);
  } catch (error) {
    console.error("[imobiliare] could not load listings", error);
  }
  const cities = [...new Set(listings.map((l) => l.city))].sort((a, b) => a.localeCompare(b, "ro"));
  return (
    <AssistantProvider>
      <Header />
      <main id="top">
        <section aria-labelledby="page-title" className={s.hero}>
          <div aria-hidden="true" className={s.heroGlow} />
          <div className={`container ${s.heroInner}`}>
            <nav aria-label="Breadcrumb" className={s.crumbs}>
              <a href="/">Acasă</a><span aria-hidden="true">/</span><span aria-current="page">Proprietăți de vânzare</span>
            </nav>
            <h1 id="page-title" className={s.title}>
              Proprietăți de vânzare, <span>prezentate transparent.</span>
            </h1>
            <p className={s.lead}>
              Vindem proprietăți pentru clienții noștri, cu documentele verificate și informații clare despre fiecare imobil — fără surprize la vizionare și fără comision la cumpărare.
            </p>
            <ul className={s.trustRow}>
              <li className={s.zeroFeeHero}><span>0</span>Comision 0% la toate proprietățile</li>
              <li><span>✓</span>Documente verificate înainte de publicare</li>
              <li><span>✓</span>Informații complete și fotografii reale</li>
              <li><span>✓</span>Vizionări programate rapid</li>
            </ul>
          </div>
        </section>

        <section aria-label="Lista proprietăților" className={`container ${s.listSection}`}>
          {listings.length ? (
            <ListingsBrowser listings={listings} cities={cities} />
          ) : (
            <div className={s.none}>
              <b>Momentan nu avem proprietăți listate.</b>
              <span>Revino în curând sau scrie-ne dacă vrei să vinzi o proprietate prin VALUEFY.</span>
            </div>
          )}
        </section>

        <section aria-labelledby="sell-title" className={s.sellBand}>
          <div className={`container ${s.sellInner}`}>
            <div>
              <div className="eyebrow">Vrei să vinzi?</div>
              <h2 id="sell-title" className="h2">Îți vindem proprietatea, pornind de la valoarea ei reală.</h2>
              <p>Stabilim un preț de listare argumentat, pregătim documentele și prezentarea, apoi ne ocupăm de vizionări și de negociere.</p>
            </div>
            <AssistantButton purpose="Vânzare / cumpărare" className={s.sellCta}>Discută cu noi →</AssistantButton>
          </div>
        </section>
      </main>
      <Footer />
    </AssistantProvider>
  );
}
