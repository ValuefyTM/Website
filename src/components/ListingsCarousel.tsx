"use client";

import { useEffect, useRef, useState } from "react";
import { COMMISSION_NOTE, formatEur, specLine, type Listing } from "@/lib/listing-format";
import s from "./ListingsCarousel.module.css";

/** Home page: published properties in a swipeable row, with a link to the real-estate portal. */
export function ListingsCarousel({ listings }: { listings: Listing[] }) {
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
            <div className="eyebrow">Portal Imobiliar</div>
            <h2 id="estate-title" className="h2">Proprietăți de vânzare, prezentate transparent.</h2>
            <p className={s.lead}>
              Documente verificate, informații complete și <b>{COMMISSION_NOTE.toLowerCase()}</b> la cumpărare. Pentru proprietățile cu raport de evaluare ANEVAR, îl poți solicita direct din anunț.
            </p>
          </div>
          <div className={s.headActions}>
            {listings.length > 1 && (
              <div className={s.arrows}>
                <button type="button" onClick={() => move(-1)} disabled={edge.start} aria-label="Proprietățile anterioare">‹</button>
                <button type="button" onClick={() => move(1)} disabled={edge.end} aria-label="Proprietățile următoare">›</button>
              </div>
            )}
            <a href="/imobiliare" className={s.all}>Vezi toate în Portalul Imobiliar →</a>
          </div>
        </div>

        <ul ref={track} className={s.track} aria-label="Proprietăți de vânzare">
          {listings.map((l) => (
            <li key={l.id} className={s.card}>
              <a href={`/imobiliare/${l.slug}`} className={s.link}>
                <div className={s.img}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {l.photos[0] ? <img src={l.photos[0]} alt="" loading="lazy" /> : <span className={s.noPhoto}>Fotografii în curând</span>}
                  <span className={s.type}>{l.type}</span>
                  {l.status && <span className={s.status}>{l.status}</span>}
                  {l.report && <span className={s.report}><i aria-hidden="true">✓</i>Raport de evaluare</span>}
                </div>
                <div className={s.body}>
                  <div className={s.price}>{formatEur(l.price)}</div>
                  <h3>{l.title}</h3>
                  <p className={s.loc}>{[l.zone, l.city].filter(Boolean).join(", ")}</p>
                  <div className={s.foot}>
                    <span className={s.spec}>{specLine(l)}</span>
                    <span className={s.fee}>{COMMISSION_NOTE}</span>
                  </div>
                </div>
              </a>
            </li>
          ))}
          <li className={`${s.card} ${s.moreCard}`}>
            <a href="/imobiliare" className={s.more}>
              <span className={s.moreIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg>
              </span>
              <b>Portal Imobiliar</b>
              <span>Toate proprietățile, cu filtre după tip, localitate și preț.</span>
              <em>Deschide portalul →</em>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

/** Shown instead of the carousel while there are no published properties. */
export function EstateBand() {
  return (
    <section aria-labelledby="estate-band-title" className={s.band}>
      <div className={`container ${s.bandInner}`}>
        <div>
          <div className="eyebrow">Portal Imobiliar</div>
          <h2 id="estate-band-title" className="h2">Cumperi sau vinzi o proprietate?</h2>
          <p>Proprietăți cu documente verificate, prezentate transparent, cu {COMMISSION_NOTE.toLowerCase()} la cumpărare.</p>
        </div>
        <a href="/imobiliare" className={s.bandCta}>Intră în Portalul Imobiliar →</a>
      </div>
    </section>
  );
}
