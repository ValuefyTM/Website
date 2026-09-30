"use client";

import { useState } from "react";
import { site, phoneHref } from "@/config/site";
import s from "./client.module.css";

type Notice = { kind: "error" | "info"; text: React.ReactNode } | null;

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const contact = (
    <>
      {" "}Pentru un dosar în lucru, sună-ne la <a href={phoneHref(site.phone)}>{site.phone}</a> sau scrie la{" "}
      <a href={`mailto:${site.email}`}>{site.email}</a>.
    </>
  );

  const validEmail = /^\S+@\S+\.\S+$/.test(email.trim());

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validEmail) return setNotice({ kind: "error", text: "Introdu o adresă de email validă." });
    if (!password) return setNotice({ kind: "error", text: "Introdu parola." });
    setBusy(true);
    setNotice(null);
    // No authentication backend yet — the portal is being built.
    setTimeout(() => {
      setBusy(false);
      setNotice({ kind: "info", text: <>Portalul client este în pregătire, iar autentificarea va fi activată în curând.{contact}</> });
    }, 600);
  };

  const onForgot = () => {
    setNotice({
      kind: "info",
      text: validEmail
        ? <>Resetarea parolei va fi disponibilă odată cu lansarea portalului.{contact}</>
        : "Scrie mai întâi adresa de email a contului, apoi apasă din nou „Ai uitat parola?”.",
    });
  };

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <label className={s.label}>
        Email
        <input
          className={s.input}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="nume@exemplu.ro"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <div className={s.label}>
        <span className={s.labelRow}>
          <label htmlFor="password">Parolă</label>
          <button type="button" className={s.link} onClick={onForgot}>Ai uitat parola?</button>
        </span>
        <span className={s.pwWrap}>
          <input
            id="password"
            className={s.input}
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className={s.pwToggle}
            onClick={() => setShowPw(!showPw)}
            aria-label={showPw ? "Ascunde parola" : "Arată parola"}
            aria-pressed={showPw}
          >
            {showPw ? "Ascunde" : "Arată"}
          </button>
        </span>
      </div>

      <label className={s.check}>
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        Ține-mă minte pe acest dispozitiv
      </label>

      {notice && (
        <div role={notice.kind === "error" ? "alert" : "status"} className={notice.kind === "error" ? s.error : s.info}>
          {notice.text}
        </div>
      )}

      <button type="submit" className={s.submit} disabled={busy}>
        {busy ? "Se verifică…" : "Intră în cont"}
      </button>

      <div className={s.divider}><span>Nu ai cont?</span></div>
      <p className={s.help}>
        Accesul în portal îl primești pe email, odată cu confirmarea comenzii de evaluare.
      </p>
      <a href="/" className={s.secondary}>Solicită o evaluare →</a>
    </form>
  );
}
