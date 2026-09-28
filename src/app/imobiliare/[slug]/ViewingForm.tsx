"use client";

import { useState } from "react";
import s from "./listing.module.css";

/** Viewing request form. PREVIEW: not connected yet — it only validates and shows a notice. */
export function ViewingForm({ listingTitle }: { listingTitle: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`Bună ziua, aș dori să programez o vizionare pentru „${listingTitle}”.`);
  const [consent, setConsent] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setNotice({ ok: false, text: "Te rog completează numele." });
    if (phone.replace(/\D/g, "").length < 9) return setNotice({ ok: false, text: "Numărul de telefon pare incomplet." });
    if (!consent) return setNotice({ ok: false, text: "Este necesar acordul pentru a te putea contacta." });
    setNotice({ ok: true, text: "Previzualizare: formularul nu este încă legat. În versiunea finală, cererea ajunge la voi pe email și în baza de date." });
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
      <button type="submit" className={s.submit}>Trimite cererea</button>
    </form>
  );
}
