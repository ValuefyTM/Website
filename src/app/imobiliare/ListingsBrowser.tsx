"use client";

import { useMemo, useState } from "react";
import { formatEur, pricePerSqm, type Listing } from "@/lib/listings";
import s from "./imobiliare.module.css";

const TYPES = ["Apartament", "Casă", "Teren", "Spațiu comercial", "Hală / industrial"];
const MAX_PRICES = [100000, 150000, 250000, 500000];
const SORTS = { recent: "Cele mai noi", asc: "Preț crescător", desc: "Preț descrescător" } as const;

export function ListingsBrowser({ listings, cities }: { listings: Listing[]; cities: string[] }) {
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [minRooms, setMinRooms] = useState(0);
  const [withReport, setWithReport] = useState(false);
  const [sort, setSort] = useState<keyof typeof SORTS>("recent");

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
      <form className={s.filters} onSubmit={(e) => e.preventDefault()} aria-label="Filtrează proprietățile">
        <label>Tip proprietate
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Toate</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label>Localitate
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Toate</option>
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Preț maxim
          <select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}>
            <option value={0}>Oricât</option>
            {MAX_PRICES.map((p) => <option key={p} value={p}>până la {formatEur(p)}</option>)}
          </select>
        </label>
        <label>Camere
          <select value={minRooms} onChange={(e) => setMinRooms(Number(e.target.value))}>
            <option value={0}>Oricâte</option>
            {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+ camere</option>)}
          </select>
        </label>
        <label className={s.reportFilter}>
          <input type="checkbox" checked={withReport} onChange={(e) => setWithReport(e.target.checked)} />
          <span><b>Doar cu raport de evaluare</b><small>Proprietăți cu raport întocmit de evaluator autorizat ANEVAR</small></span>
        </label>
      </form>

      <div className={s.listHead}>
        <p aria-live="polite"><b>{shown.length}</b> {shown.length === 1 ? "proprietate" : "proprietăți"}{filtered ? <> · <button type="button" onClick={reset} className={s.resetBtn}>Șterge filtrele</button></> : null}</p>
        <label className={s.sort}>Sortează
          <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)}>
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
      </div>

      {shown.length ? (
        <ul className={s.grid}>
          {shown.map((l) => (
            <li key={l.slug} className={s.card}>
              <a href={`/imobiliare/${l.slug}`} className={s.cardLink}>
                <div className={s.cardImg}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.photos[0]} alt={l.title} loading="lazy" decoding="async" />
                  <span className={s.typeTag}>{l.type}</span>
                  {l.status && <span className={`${s.statusTag} ${l.status === "Rezervat" ? s.reserved : ""}`}>{l.status}</span>}
                  {l.photos.length > 1 && <span className={s.photoCount}>{l.photos.length} foto</span>}
                  {l.report && <span className={s.reportTag}><i aria-hidden="true">✓</i>Raport de evaluare</span>}
                </div>
                <div className={s.cardBody}>
                  <div className={s.priceRow}>
                    <b>{formatEur(l.price)}</b>
                    {pricePerSqm(l) && <span>{formatEur(pricePerSqm(l)!)}/m²</span>}
                  </div>
                  <h3>{l.title}</h3>
                  <p className={s.loc}>{l.zone}, {l.city}</p>
                  <ul className={s.facts}>
                    {l.surface && <li>{l.surface} m² utili</li>}
                    {l.rooms && <li>{l.rooms} camere</li>}
                    {l.land && <li>{l.land.toLocaleString("ro-RO")} m² teren</li>}
                    {l.year && <li>an {l.year}</li>}
                  </ul>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className={s.empty}>
          <b>Nicio proprietate nu corespunde filtrelor.</b>
          <button type="button" onClick={reset} className={s.resetBtn}>Șterge filtrele</button>
        </div>
      )}
    </>
  );
}
