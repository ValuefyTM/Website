"use client";

import { useState } from "react";
import s from "./raport.module.css";

const ROLES = ["Sunt interesat să cumpăr", "Cumpăr cu credit bancar", "Reprezint o bancă sau un investitor", "Sunt agent imobiliar", "Alt motiv"];

/** Report request form — sends to /api/inquiries; the office reviews it and sends the report. */
export function ReportRequestForm({ listingTitle, slug }: { listingTitle: string; slug: string }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", role: "", message: "", consent: false, confidential: false });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let m = "";
    if (!f.name.trim()) m = "Te rog completează numele.";
    else if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) m = "Adaugă o adresă de email validă — raportul se trimite pe email.";
    else if (f.phone.replace(/\D/g, "").length < 9) m = "Numărul de telefon pare incomplet.";
    else if (!f.role) m = "Alege motivul pentru care soliciți raportul.";
    else if (!f.confidential) m = "Este necesar acordul privind folosirea raportului.";
    else if (!f.consent) m = "Este necesar acordul privind prelucrarea datelor.";
    setErr(m);
    if (m) return;
    setBusy(true);
    fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "report", slug, name: f.name, email: f.email, phone: f.phone, reason: f.role, message: f.message, consent: f.consent && f.confidential }),
    })
      .then(async (r) => {
        const d = (await r.json().catch(() => ({}))) as { error?: string };
        if (!r.ok) throw new Error(d.error || "Nu am putut trimite solicitarea. Încearcă din nou.");
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
          <h2>Solicitarea a fost trimisă.</h2>
          <p>Verificăm datele și îți trimitem raportul de evaluare pentru „{listingTitle}” la <b>{f.email}</b>.</p>
          <a href="/imobiliare" className={s.back}>← Înapoi la proprietăți</a>
        </div>
      </div>
    );
  }

  return (
    <form className={s.card} onSubmit={submit} noValidate>
      <div className={s.formTitle}>Datele tale</div>
      <label>Nume și prenume<input value={f.name} onChange={set("name")} autoComplete="name" /></label>
      <label>Email<input type="email" value={f.email} onChange={set("email")} autoComplete="email" placeholder="nume@exemplu.ro" /></label>
      <label>Telefon<input type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="07xx xxx xxx" /></label>
      <label>De ce soliciți raportul?
        <select value={f.role} onChange={set("role")}>
          <option value="">Alege</option>
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
      </label>
      <label>Mesaj <span className={s.opt}>(opțional)</span><textarea value={f.message} onChange={set("message")} rows={3} placeholder="Întrebări despre proprietate sau o vizionare" /></label>
      <label className={s.check}>
        <input type="checkbox" checked={f.confidential} onChange={set("confidential")} />
        <span>Folosesc raportul doar pentru a analiza această proprietate și nu îl distribui mai departe.</span>
      </label>
      <label className={s.check}>
        <input type="checkbox" checked={f.consent} onChange={set("consent")} />
        <span>Sunt de acord cu prelucrarea datelor pentru această solicitare, conform <a href="/politica-de-confidentialitate">Politicii de confidențialitate</a>.</span>
      </label>
      {err && <div role="alert" className={s.err}>{err}</div>}
      <button type="submit" className={s.submit} disabled={busy}>{busy ? "Se trimite…" : "Trimite solicitarea"}</button>
    </form>
  );
}
