"use client";

import { useState } from "react";
import { useLang } from "@/i18n/client";
import { localize } from "@/i18n/lang";
import s from "./raport.module.css";

// Stored / emailed to the office in Romanian; shown in the visitor's language.
const ROLES = ["Sunt interesat să cumpăr", "Cumpăr cu credit bancar", "Reprezint o bancă sau un investitor", "Sunt agent imobiliar", "Alt motiv"];
const ROLES_EN: Record<string, string> = {
  "Sunt interesat să cumpăr": "I'm interested in buying",
  "Cumpăr cu credit bancar": "I'm buying with a mortgage",
  "Reprezint o bancă sau un investitor": "I represent a bank or an investor",
  "Sunt agent imobiliar": "I'm an estate agent",
  "Alt motiv": "Other reason",
};

const T = {
  ro: {
    noName: "Te rog completează numele.",
    noEmail: "Adaugă o adresă de email validă — raportul se trimite pe email.",
    noPhone: "Numărul de telefon pare incomplet.",
    noRole: "Alege motivul pentru care soliciți raportul.",
    noConfidential: "Este necesar acordul privind folosirea raportului.",
    noConsent: "Este necesar acordul privind prelucrarea datelor.",
    failed: "Nu am putut trimite solicitarea. Încearcă din nou.",
    doneTitle: "Solicitarea a fost trimisă.",
    doneA: (title: string) => `Verificăm datele și îți trimitem raportul de evaluare pentru „${title}” la `, doneB: ".",
    back: "← Înapoi la proprietăți",
    formTitle: "Datele tale", name: "Nume și prenume", email: "Email", emailPh: "nume@exemplu.ro", phone: "Telefon",
    role: "De ce soliciți raportul?", choose: "Alege", message: "Mesaj ", optional: "(opțional)", messagePh: "Întrebări despre proprietate sau o vizionare",
    confidential: "Folosesc raportul doar pentru a analiza această proprietate și nu îl distribui mai departe.",
    consentA: "Sunt de acord cu prelucrarea datelor pentru această solicitare, conform ", consentLink: "Politicii de confidențialitate", consentB: ".",
    sending: "Se trimite…", submit: "Trimite solicitarea",
  },
  en: {
    noName: "Please enter your name.",
    noEmail: "Please add a valid email address — the report is sent by email.",
    noPhone: "The phone number looks incomplete.",
    noRole: "Please choose why you are requesting the report.",
    noConfidential: "Your agreement on how the report is used is required.",
    noConsent: "Your consent to the processing of your data is required.",
    failed: "We could not send your request. Please try again.",
    doneTitle: "Your request has been sent.",
    doneA: (title: string) => `We'll check your details and email the valuation report for “${title}” to `, doneB: ".",
    back: "← Back to properties",
    formTitle: "Your details", name: "Full name", email: "Email", emailPh: "name@example.com", phone: "Phone",
    role: "Why are you requesting the report?", choose: "Choose", message: "Message ", optional: "(optional)", messagePh: "Questions about the property or a viewing",
    confidential: "I will use the report only to assess this property and will not share it with others.",
    consentA: "I agree to the processing of my data for this request, in accordance with the ", consentLink: "Privacy Policy", consentB: ".",
    sending: "Sending…", submit: "Send request",
  },
};

/** Report request form — sends to /api/inquiries; the office reviews it and sends the report. */
export function ReportRequestForm({ listingTitle, slug }: { listingTitle: string; slug: string }) {
  const lang = useLang();
  const t = T[lang];
  const [f, setF] = useState({ name: "", email: "", phone: "", role: "", message: "", consent: false, confidential: false });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let m = "";
    if (!f.name.trim()) m = t.noName;
    else if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) m = t.noEmail;
    else if (f.phone.replace(/\D/g, "").length < 9) m = t.noPhone;
    else if (!f.role) m = t.noRole;
    else if (!f.confidential) m = t.noConfidential;
    else if (!f.consent) m = t.noConsent;
    setErr(m);
    if (m) return;
    setBusy(true);
    fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "report", slug, name: f.name, email: f.email, phone: f.phone, reason: f.role, message: f.message, consent: f.consent && f.confidential, lang }),
    })
      .then(async (r) => {
        const d = (await r.json().catch(() => ({}))) as { error?: string };
        if (!r.ok) throw new Error(d.error || t.failed);
        setSent(true);
      })
      .catch((e: Error) => setErr(e.message))
      .finally(() => setBusy(false));
  };

  if (sent) {
    return (
      <div className={s.card} role="status">
        <div className={s.done}>
          <div className={s.doneCheck}>✓</div>
          <h2>{t.doneTitle}</h2>
          <p>{t.doneA(listingTitle)}<b>{f.email}</b>{t.doneB}</p>
          <a href={localize(lang, "/imobiliare")} className={s.back}>{t.back}</a>
        </div>
      </div>
    );
  }

  return (
    <form className={s.card} onSubmit={submit} noValidate>
      <div className={s.formTitle}>{t.formTitle}</div>
      <label>{t.name}<input value={f.name} onChange={set("name")} autoComplete="name" /></label>
      <label>{t.email}<input type="email" value={f.email} onChange={set("email")} autoComplete="email" placeholder={t.emailPh} /></label>
      <label>{t.phone}<input type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="07xx xxx xxx" /></label>
      <label>{t.role}
        <select value={f.role} onChange={set("role")}>
          <option value="">{t.choose}</option>
          {ROLES.map((r) => <option key={r} value={r}>{lang === "en" ? ROLES_EN[r] : r}</option>)}
        </select>
      </label>
      <label>{t.message}<span className={s.opt}>{t.optional}</span><textarea value={f.message} onChange={set("message")} rows={3} placeholder={t.messagePh} /></label>
      <label className={s.check}>
        <input type="checkbox" checked={f.confidential} onChange={set("confidential")} />
        <span>{t.confidential}</span>
      </label>
      <label className={s.check}>
        <input type="checkbox" checked={f.consent} onChange={set("consent")} />
        <span>{t.consentA}<a href={localize(lang, "/politica-de-confidentialitate")}>{t.consentLink}</a>{t.consentB}</span>
      </label>
      {err && <div role="alert" className={s.err}>{err}</div>}
      <button type="submit" className={s.submit} disabled={busy}>{busy ? t.sending : t.submit}</button>
    </form>
  );
}
