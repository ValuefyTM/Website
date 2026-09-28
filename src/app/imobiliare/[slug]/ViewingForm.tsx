"use client";

import { useState } from "react";
import s from "./listing.module.css";

/** Viewing request form — sends to /api/inquiries (saved in the database and emailed to the office). */
export function ViewingForm({ listingTitle, slug }: { listingTitle: string; slug: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Bună ziua, aș dori să programez o vizionare pentru „${listingTitle}”.`);
  const [consent, setConsent] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setNotice({ ok: false, text: "Te rog completează numele." });
    if (phone.replace(/\D/g, "").length < 9) return setNotice({ ok: false, text: "Numărul de telefon pare incomplet." });
    if (!consent) return setNotice({ ok: false, text: "Este necesar acordul pentru a te putea contacta." });
    setBusy(true);
    setNotice(null);
    fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "viewing", slug, name, phone, message, consent }),
    })
      .then(async (r) => {
        const d = (await r.json().catch(() => ({}))) as { error?: string };
        if (!r.ok) throw new Error(d.error || "Nu am putut trimite cererea.");
        setSent(true);
        setNotice({ ok: true, text: "Mulțumim! Am primit cererea și te contactăm în cel mai scurt timp pentru programare." });
      })
      .catch((err: Error) => setNotice({ ok: false, text: err.message }))
      .finally(() => setBusy(false));
  };

  return (
    <form className={s.form} onSubmit={submit} noValidate>
      <div className={s.formTitle}>Programează o vizionare</div>
      <label>Nume și prenume
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      </label>
      <label>Telefon
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="07xx xxx xxx" />
      </label>
      <label>Mesaj
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
      </label>
      <label className={s.consent}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>Sunt de acord să fiu contactat pentru această proprietate, conform <a href="/politica-de-confidentialitate">Politicii de confidențialitate</a>.</span>
      </label>
      {notice && <div role={notice.ok ? "status" : "alert"} className={notice.ok ? s.ok : s.err}>{notice.text}</div>}
      <button type="submit" className={s.submit} disabled={busy || sent}>{busy ? "Se trimite…" : sent ? "Cerere trimisă ✓" : "Trimite cererea"}</button>
    </form>
  );
}
