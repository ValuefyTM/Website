"use client";

import { useState } from "react";
import { useLang } from "@/i18n/client";
import { localize } from "@/i18n/lang";
import s from "./listing.module.css";

const T = {
  ro: {
    message: (title: string) => `Bună ziua, aș dori să programez o vizionare pentru „${title}”.`,
    noName: "Te rog completează numele.", noPhone: "Numărul de telefon pare incomplet.", noConsent: "Este necesar acordul pentru a te putea contacta.",
    failed: "Nu am putut trimite cererea.",
    thanks: "Mulțumim! Am primit cererea și te contactăm în cel mai scurt timp pentru programare.",
    title: "Programează o vizionare", name: "Nume și prenume", phone: "Telefon", msg: "Mesaj",
    consentA: "Sunt de acord să fiu contactat pentru această proprietate, conform ", consentLink: "Politicii de confidențialitate", consentB: ".",
    sending: "Se trimite…", sent: "Cerere trimisă ✓", submit: "Trimite cererea",
  },
  en: {
    message: (title: string) => `Hello, I would like to arrange a viewing of “${title}”.`,
    noName: "Please enter your name.", noPhone: "The phone number looks incomplete.", noConsent: "We need your consent to be able to contact you.",
    failed: "We could not send your request.",
    thanks: "Thank you! We have received your request and will contact you shortly to arrange the viewing.",
    title: "Arrange a viewing", name: "Full name", phone: "Phone", msg: "Message",
    consentA: "I agree to be contacted about this property, in accordance with the ", consentLink: "Privacy Policy", consentB: ".",
    sending: "Sending…", sent: "Request sent ✓", submit: "Send request",
  },
};

/** Viewing request form — sends to /api/inquiries (saved in the database and emailed to the office). */
export function ViewingForm({ listingTitle, slug }: { listingTitle: string; slug: string }) {
  const lang = useLang();
  const t = T[lang];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(t.message(listingTitle));
  const [consent, setConsent] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setNotice({ ok: false, text: t.noName });
    if (phone.replace(/\D/g, "").length < 9) return setNotice({ ok: false, text: t.noPhone });
    if (!consent) return setNotice({ ok: false, text: t.noConsent });
    setBusy(true);
    setNotice(null);
    fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "viewing", slug, name, phone, message, consent, lang }),
    })
      .then(async (r) => {
        const d = (await r.json().catch(() => ({}))) as { error?: string };
        if (!r.ok) throw new Error(d.error || t.failed);
        setSent(true);
        setNotice({ ok: true, text: t.thanks });
      })
      .catch((err: Error) => setNotice({ ok: false, text: err.message }))
      .finally(() => setBusy(false));
  };

  return (
    <form className={s.form} onSubmit={submit} noValidate>
      <div className={s.formTitle}>{t.title}</div>
      <label>{t.name}
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      </label>
      <label>{t.phone}
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="07xx xxx xxx" />
      </label>
      <label>{t.msg}
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
      </label>
      <label className={s.consent}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{t.consentA}<a href={localize(lang, "/politica-de-confidentialitate")}>{t.consentLink}</a>{t.consentB}</span>
      </label>
      {notice && <div role={notice.ok ? "status" : "alert"} className={notice.ok ? s.ok : s.err}>{notice.text}</div>}
      <button type="submit" className={s.submit} disabled={busy || sent}>{busy ? t.sending : sent ? t.sent : t.submit}</button>
    </form>
  );
}
