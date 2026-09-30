"use client";

import { useMemo, useState } from "react";
import { LISTING_TYPES, formatEur, pricePerSqm, type Listing, commissionNote } from "@/lib/listing-format";
import { useLang } from "@/i18n/client";
import { localize, numberLocale } from "@/i18n/lang";
import { label } from "@/i18n/labels";
import s from "./imobiliare.module.css";

const TYPES = LISTING_TYPES;
const MAX_PRICES = [100000, 150000, 250000, 500000];
type Sort = "recent" | "asc" | "desc";

const T = {
  ro: {
    filters: "Filtrează proprietățile", type: "Tip proprietate", all: "Toate", city: "Localitate", maxPrice: "Preț maxim", any: "Oricât",
    upTo: (p: string) => `până la ${p}`, rooms: "Camere", anyRooms: "Oricâte", roomsPlus: (n: number) => `${n}+ camere`,
    withReport: "Doar cu raport de evaluare", withReportHint: "Proprietăți cu raport întocmit de evaluator autorizat ANEVAR",
    count: (n: number) => (n === 1 ? "proprietate" : "proprietăți"), reset: "Șterge filtrele", sort: "Sortează",
    sorts: { recent: "Cele mai noi", asc: "Preț crescător", desc: "Preț descrescător" } as Record<Sort, string>,
    noPhoto: "Fără fotografii", photos: (n: number) => `${n} foto`, report: "Raport de evaluare",
    usable: (n: number) => `${n} m² utili`, roomsN: (n: number) => `${n} camere`, land: (n: string) => `${n} m² teren`, year: (y: number) => `an ${y}`,
    empty: "Nicio proprietate nu corespunde filtrelor.",
  },
  en: {
    filters: "Filter properties", type: "Property type", all: "All", city: "Location", maxPrice: "Max. price", any: "Any",
    upTo: (p: string) => `up to ${p}`, rooms: "Rooms", anyRooms: "Any", roomsPlus: (n: number) => `${n}+ rooms`,
    withReport: "Only with a valuation report", withReportHint: "Properties with a report prepared by an ANEVAR-authorised valuer",
    count: (n: number) => (n === 1 ? "property" : "properties"), reset: "Clear filters", sort: "Sort by",
    sorts: { recent: "Newest", asc: "Price: low to high", desc: "Price: high to low" } as Record<Sort, string>,
    noPhoto: "No photos", photos: (n: number) => `${n} photos`, report: "Valuation report",
    usable: (n: number) => `${n} m² usable`, roomsN: (n: number) => `${n} ${n === 1 ? "room" : "rooms"}`, land: (n: string) => `${n} m² land`, year: (y: number) => `built ${y}`,
    empty: "No properties match your filters.",
  },
};

/** `listings` should already be in the visitor's language (inLang); filters compare the stored Romanian type values. */
export function ListingsBrowser({ listings, cities }: { listings: Listing[]; cities: string[] }) {
  const lang = useLang();
  const t = T[lang];
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [minRooms, setMinRooms] = useState(0);
  const [withReport, setWithReport] = useState(false);
  const [sort, setSort] = useState<Sort>("recent");

  const shown = useMemo(() => {
    const r = listings.filter(
      (l) => (!type || l.type === type) && (!city || l.city === city) && (!maxPrice || l.price <= maxPrice) && (!minRooms || (l.rooms ?? 0) >= minRooms) && (!withReport || !!l.report),
    );
    if (sort === "asc") r.sort((a, b) => a.price - b.price);
    if (sort === "desc") r.sort((a, b) => b.price - a.price);
    return r;
  }, [listings, type, city, maxPrice, minRooms, withReport, sort]);

  const reset = () => { setType(""); setCity(""); setMaxPrice(0); setMinRooms(0); setWithReport(false); };
  const filtered = type || city || maxPrice || minRooms || withReport;

  return (
    <>
      <form className={s.filters} onSubmit={(e) => e.preventDefault()} aria-label={t.filters}>
        <label>{t.type}
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">{t.all}</option>
            {TYPES.map((v) => <option key={v} value={v}>{label(v, lang)}</option>)}
          </select>
        </label>
        <label>{t.city}
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">{t.all}</option>
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>{t.maxPrice}
          <select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}>
            <option value={0}>{t.any}</option>
            {MAX_PRICES.map((p) => <option key={p} value={p}>{t.upTo(formatEur(p, lang))}</option>)}
          </select>
        </label>
        <label>{t.rooms}
          <select value={minRooms} onChange={(e) => setMinRooms(Number(e.target.value))}>
            <option value={0}>{t.anyRooms}</option>
            {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{t.roomsPlus(n)}</option>)}
          </select>
        </label>
        <label className={s.reportFilter}>
          <input type="checkbox" checked={withReport} onChange={(e) => setWithReport(e.target.checked)} />
          <span><b>{t.withReport}</b><small>{t.withReportHint}</small></span>
        </label>
      </form>

      <div className={s.listHead}>
        <p aria-live="polite"><b>{shown.length}</b> {t.count(shown.length)}{filtered ? <> · <button type="button" onClick={reset} className={s.resetBtn}>{t.reset}</button></> : null}</p>
        <label className={s.sort}>{t.sort}
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            {Object.entries(t.sorts).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>

      {shown.length ? (
        <ul className={s.grid}>
          {shown.map((l) => (
            <li key={l.slug} className={s.card}>
              <a href={localize(lang, `/imobiliare/${l.slug}`)} className={s.cardLink}>
                <div className={s.cardImg}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {l.photos[0] ? <img src={l.photos[0]} alt={l.title} loading="lazy" decoding="async" /> : <span className={s.noPhoto}>{t.noPhoto}</span>}
                  <span className={s.typeTag}>{label(l.type, lang)}</span>
                  {l.status && <span className={`${s.statusTag} ${l.status === "Rezervat" ? s.reserved : ""}`}>{label(l.status, lang)}</span>}
                  {l.photos.length > 1 && <span className={s.photoCount}>{t.photos(l.photos.length)}</span>}
                  {l.report && <span className={s.reportTag}><i aria-hidden="true">✓</i>{t.report}</span>}
                </div>
                <div className={s.cardBody}>
                  <div className={s.priceRow}>
                    <b>{formatEur(l.price, lang)}</b>
                    {pricePerSqm(l) && <span>{formatEur(pricePerSqm(l)!, lang)}/m²</span>}
                  </div>
                  <span className={s.zeroFee}>{commissionNote(lang)}</span>
                  <h3>{l.title}</h3>
                  <p className={s.loc}>{l.zone}, {l.city}</p>
                  <ul className={s.facts}>
                    {l.surface && <li>{t.usable(l.surface)}</li>}
                    {l.rooms && <li>{t.roomsN(l.rooms)}</li>}
                    {l.land && <li>{t.land(l.land.toLocaleString(numberLocale(lang)))}</li>}
                    {l.year && <li>{t.year(l.year)}</li>}
                  </ul>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className={s.empty}>
          <b>{t.empty}</b>
          <button type="button" onClick={reset} className={s.resetBtn}>{t.reset}</button>
        </div>
      )}
    </>
  );
}
