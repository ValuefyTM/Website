"use client";

import { useEffect, useState } from "react";
import { LISTING_STATUSES, LISTING_TYPES, photoUrl, type Listing } from "@/lib/listing-format";
import a from "../admin.module.css";

type Form = {
  title: string; type: string; city: string; zone: string; price: string; surface: string; land: string; rooms: string; baths: string;
  floor: string; year: string; status: string; features: string; description: string; hasReport: boolean; report_date: string; published: boolean;
};

const s = (v: unknown) => (v === undefined || v === null ? "" : String(v));

function toForm(l?: Listing): Form {
  return {
    title: s(l?.title), type: l?.type ?? "", city: s(l?.city), zone: s(l?.zone), price: s(l?.price), surface: s(l?.surface), land: s(l?.land),
    rooms: s(l?.rooms), baths: s(l?.baths), floor: s(l?.floor), year: s(l?.year), status: s(l?.status),
    features: (l?.features ?? []).join("\n"), description: (l?.description ?? []).join("\n\n"),
    hasReport: !!l?.report, report_date: l?.report?.date ?? "", published: l?.published ?? false,
  };
}

/** Resize in the browser: max 1600 px, JPEG ~0.82 — keeps photos small for the database. */
async function resize(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("resize failed"))), "image/jpeg", 0.82));
}

export function ListingEditor({ listing }: { listing?: Listing }) {
  const [f, setF] = useState<Form>(toForm(listing));
  const [photos, setPhotos] = useState<string[]>(listing?.photoIds ?? []);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [upload, setUpload] = useState("");
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const body = {
      ...f,
      features: f.features.split(/\n|,/).map((x) => x.trim()).filter(Boolean),
      report_date: f.hasReport ? f.report_date : "",
    };
    const r = await fetch(listing ? `/api/admin/listings/${listing.id}` : "/api/admin/listings", {
      method: listing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = (await r.json().catch(() => ({}))) as { error?: string; id?: string };
    setBusy(false);
    if (!r.ok) return setMsg({ ok: false, text: d.error || "Nu am putut salva." });
    if (!listing && d.id) location.href = `/admin/proprietati/${d.id}?nou=1`;
    else setMsg({ ok: true, text: "Salvat." });
  };

  const addPhotos = async (files: FileList | null) => {
    if (!listing || !files?.length) return;
    const list = Array.from(files).filter((x) => x.type.startsWith("image/"));
    for (let i = 0; i < list.length; i++) {
      setUpload(`Se încarcă ${i + 1} din ${list.length}…`);
      try {
        const blob = await resize(list[i]);
        const fd = new FormData();
        fd.append("photos", new File([blob], list[i].name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }));
        const r = await fetch(`/api/admin/listings/${listing.id}/photos`, { method: "POST", body: fd });
        const d = (await r.json().catch(() => ({}))) as { ids?: string[]; error?: string };
        if (r.ok && d.ids) setPhotos((p) => [...p, ...d.ids!]);
        else setMsg({ ok: false, text: d.error || `Nu am putut încărca ${list[i].name}.` });
      } catch {
        setMsg({ ok: false, text: `Fișierul ${list[i].name} nu a putut fi procesat.` });
      }
    }
    setUpload("");
  };

  const saveOrder = async (next: string[]) => {
    setPhotos(next);
    if (listing) await fetch(`/api/admin/listings/${listing.id}/photos`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: next }) });
  };
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= photos.length) return;
    const next = [...photos];
    [next[i], next[j]] = [next[j], next[i]];
    saveOrder(next);
  };
  const remove = async (id: string) => {
    if (!confirm("Ștergi această fotografie?")) return;
    const r = await fetch(`/api/admin/photos/${id}`, { method: "DELETE" });
    if (r.ok) setPhotos((p) => p.filter((x) => x !== id));
  };
  const deleteListing = async () => {
    if (!listing || !confirm(`Ștergi definitiv anunțul „${listing.title}” și fotografiile lui?`)) return;
    const r = await fetch(`/api/admin/listings/${listing.id}`, { method: "DELETE" });
    if (r.ok) location.href = "/admin";
  };

  // Read ?nou=1 after mount so server and client render the same markup.
  const [isNew, setIsNew] = useState(false);
  useEffect(() => setIsNew(new URLSearchParams(location.search).has("nou")), []);

  return (
    <div className={a.editor}>
      <div className={a.pageHead}>
        <div>
          <a href="/admin" className={a.back}>← Proprietăți</a>
          <h1>{listing ? "Editează proprietatea" : "Proprietate nouă"}</h1>
          {listing && <p>Adresa pe site: <a href={`/imobiliare/${listing.slug}`} target="_blank" rel="noopener">/imobiliare/{listing.slug} ↗</a></p>}
        </div>
      </div>
      {isNew && <div className={a.ok}>Anunțul a fost creat ca ciornă. Adaugă fotografiile mai jos, apoi bifează „Publicat” și salvează.</div>}

      <form onSubmit={save} className={a.panel}>
        <h2>Informații</h2>
        <label className={a.full}>Titlu anunț *<input value={f.title} onChange={set("title")} placeholder="ex. Apartament 3 camere, renovat, zona Complex Studențesc" required /></label>
        <div className={a.grid}>
          <label>Tip *
            <select value={f.type} onChange={set("type")} required>
              <option value="">Alege</option>
              {LISTING_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>Preț (EUR) *<input inputMode="numeric" value={f.price} onChange={set("price")} placeholder="ex. 142000" required /></label>
          <label>Localitate *<input value={f.city} onChange={set("city")} placeholder="ex. Timișoara" required /></label>
          <label>Zonă / cartier<input value={f.zone} onChange={set("zone")} placeholder="ex. Complex Studențesc" /></label>
          <label>Suprafață utilă (m²)<input inputMode="decimal" value={f.surface} onChange={set("surface")} /></label>
          <label>Teren (m²)<input inputMode="decimal" value={f.land} onChange={set("land")} /></label>
          <label>Camere<input inputMode="numeric" value={f.rooms} onChange={set("rooms")} /></label>
          <label>Băi<input inputMode="numeric" value={f.baths} onChange={set("baths")} /></label>
          <label>Etaj<input value={f.floor} onChange={set("floor")} placeholder="ex. 3 din 4" /></label>
          <label>An construcție<input inputMode="numeric" value={f.year} onChange={set("year")} /></label>
          <label>Etichetă
            <select value={f.status} onChange={set("status")}>
              <option value="">Fără</option>
              {LISTING_STATUSES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <label className={a.full}>Descriere<span className={a.hint}>Lasă un rând liber între paragrafe.</span>
          <textarea value={f.description} onChange={set("description")} rows={7} />
        </label>
        <label className={a.full}>Dotări<span className={a.hint}>Câte una pe rând (ex. Centrală proprie, Loc de parcare).</span>
          <textarea value={f.features} onChange={set("features")} rows={5} />
        </label>

        <div className={a.reportBox}>
          <label className={a.check}><input type="checkbox" checked={f.hasReport} onChange={set("hasReport")} />Proprietatea are raport de evaluare</label>
          {f.hasReport && <label>Luna raportului<input type="month" value={f.report_date} onChange={set("report_date")} required /></label>}
          <span className={a.hint}>Pe site apare insigna „Raport de evaluare” și butonul „Solicită raportul”. Cererile ajung la tine pe email și în „Cereri primite”.</span>
        </div>

        <label className={`${a.check} ${a.publish}`}>
          <input type="checkbox" checked={f.published} onChange={set("published")} />
          <span><b>Publicat</b> — anunțul este vizibil pe site</span>
        </label>

        {msg && <div role={msg.ok ? "status" : "alert"} className={msg.ok ? a.ok : a.err}>{msg.text}</div>}
        <div className={a.actions}>
          <button type="submit" className={a.primary} disabled={busy}>{busy ? "Se salvează…" : listing ? "Salvează" : "Creează anunțul"}</button>
          {listing && <button type="button" className={a.danger} onClick={deleteListing}>Șterge anunțul</button>}
        </div>
      </form>

      <section className={a.panel}>
        <h2>Fotografii</h2>
        {!listing ? (
          <p className={a.hint}>Creează întâi anunțul, apoi poți adăuga fotografii.</p>
        ) : (
          <>
            <p className={a.hint}>Prima fotografie este coperta. Fotografiile se micșorează automat înainte de încărcare.</p>
            <label className={a.upload}>
              <input type="file" accept="image/*" multiple onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} disabled={!!upload} />
              {upload || "+ Adaugă fotografii"}
            </label>
            {photos.length > 0 && (
              <ul className={a.photos}>
                {photos.map((id, i) => (
                  <li key={id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoUrl(id)} alt="" />
                    {i === 0 && <span className={a.cover}>Copertă</span>}
                    <div className={a.photoBtns}>
                      <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Mută mai în față">←</button>
                      <button type="button" onClick={() => move(i, 1)} disabled={i === photos.length - 1} aria-label="Mută mai în spate">→</button>
                      <button type="button" onClick={() => remove(id)} aria-label="Șterge fotografia">✕</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  );
}
