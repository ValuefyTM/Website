"use client";

import { useEffect, useRef, useState } from "react";
import { commissionNote, formatEur, inLang, specLine, type Listing } from "@/lib/listing-format";
import { useLang } from "@/i18n/client";
import { localize } from "@/i18n/lang";
import { label } from "@/i18n/labels";
import s from "./ListingsCarousel.module.css";

const T = {
  ro: {
    eyebrow: "Portal Imobiliar",
    title: "Proprietăți de vânzare, prezentate transparent.",
    leadA: "Documente verificate, informații complete și ",
    leadB: " la cumpărare. Pentru proprietățile cu raport de evaluare ANEVAR, îl poți solicita direct din anunț.",
    prev: "Proprietățile anterioare", next: "Proprietățile următoare",
    all: "Vezi toate în Portalul Imobiliar →", list: "Proprietăți de vânzare",
    noPhoto: "Fotografii în curând", report: "Raport de evaluare",
    moreTitle: "Portal Imobiliar", moreText: "Toate proprietățile, cu filtre după tip, localitate și preț.", moreCta: "Deschide portalul →",
    bandTitle: "Cumperi sau vinzi o proprietate?",
    bandText: (fee: string) => `Proprietăți cu documente verificate, prezentate transparent, cu ${fee} la cumpărare.`,
    bandCta: "Intră în Portalul Imobiliar →",
  },
  en: {
    eyebrow: "Real Estate Portal",
    title: "Properties for sale, presented transparently.",
    leadA: "Verified documents, complete information and ",
    leadB: " for the buyer. For properties with an ANEVAR valuation report, you can request it directly from the listing.",
    prev: "Previous properties", next: "Next properties",
    all: "See all in the Real Estate Portal →", list: "Properties for sale",
    noPhoto: "Photos coming soon", report: "Valuation report",
    moreTitle: "Real Estate Portal", moreText: "All properties, with filters by type, location and price.", moreCta: "Open the portal →",
    bandTitle: "Buying or selling a property?",
    bandText: (fee: string) => `Properties with verified documents, presented transparently, with ${fee} for the buyer.`,
    bandCta: "Visit the Real Estate Portal →",
  },
};

/** Home page: published properties in a swipeable row, with a link to the real-estate portal. */
export function ListingsCarousel({ listings: all }: { listings: Listing[] }) {
  const lang = useLang();
  const t = T[lang];
  const fee = commissionNote(lang);
  const listings = all.map((l) => inLang(l, lang));
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const move = (dir: number) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: "smooth" });
  };

  return (
    <section id="portal-imobiliar" aria-labelledby="estate-title" className={`anchor ${s.section}`}>
      <div className={`container ${s.inner}`}>
        <div className={s.head}>
          <div>
            <div className="eyebrow">{t.eyebrow}</div>
            <h2 id="estate-title" className="h2">{t.title}</h2>
            <p className={s.lead}>
              {t.leadA}<b>{fee.toLowerCase()}</b>{t.leadB}
            </p>
          </div>
          <div className={s.headActions}>
            {listings.length > 1 && (
              <div className={s.arrows}>
                <button type="button" onClick={() => move(-1)} disabled={edge.start} aria-label={t.prev}>‹</button>
                <button type="button" onClick={() => move(1)} disabled={edge.end} aria-label={t.next}>›</button>
              </div>
            )}
            <a href={localize(lang, "/imobiliare")} className={s.all}>{t.all}</a>
          </div>
        </div>

        <ul ref={track} className={s.track} aria-label={t.list}>
          {listings.map((l) => (
            <li key={l.id} className={s.card}>
              <a href={localize(lang, `/imobiliare/${l.slug}`)} className={s.link}>
                <div className={s.img}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {l.photos[0] ? <img src={l.photos[0]} alt="" loading="lazy" /> : <span className={s.noPhoto}>{t.noPhoto}</span>}
                  <span className={s.type}>{label(l.type, lang)}</span>
                  {l.status && <span className={s.status}>{label(l.status, lang)}</span>}
                  {l.report && <span className={s.report}><i aria-hidden="true">✓</i>{t.report}</span>}
                </div>
                <div className={s.body}>
                  <div className={s.price}>{formatEur(l.price, lang)}</div>
                  <h3>{l.title}</h3>
                  <p className={s.loc}>{[l.zone, l.city].filter(Boolean).join(", ")}</p>
                  <div className={s.foot}>
                    <span className={s.spec}>{specLine(l, lang)}</span>
                    <span className={s.fee}>{fee}</span>
                  </div>
                </div>
              </a>
            </li>
          ))}
          <li className={`${s.card} ${s.moreCard}`}>
            <a href={localize(lang, "/imobiliare")} className={s.more}>
              <span className={s.moreIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg>
              </span>
              <b>{t.moreTitle}</b>
              <span>{t.moreText}</span>
              <em>{t.moreCta}</em>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

/** Shown instead of the carousel while there are no published properties. */
export function EstateBand() {
  const lang = useLang();
  const t = T[lang];
  return (
    <section aria-labelledby="estate-band-title" className={s.band}>
      <div className={`container ${s.bandInner}`}>
        <div>
          <div className="eyebrow">{t.eyebrow}</div>
          <h2 id="estate-band-title" className="h2">{t.bandTitle}</h2>
          <p>{t.bandText(commissionNote(lang).toLowerCase())}</p>
        </div>
        <a href={localize(lang, "/imobiliare")} className={s.bandCta}>{t.bandCta}</a>
      </div>
    </section>
  );
}
