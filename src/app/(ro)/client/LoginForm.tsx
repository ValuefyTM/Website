"use client";

import { useState } from "react";
import { site, phoneHref } from "@/config/site";
import { useLang } from "@/i18n/client";
import { localize } from "@/i18n/lang";
import { useRole } from "./role";
import s from "./client.module.css";

type Notice = { kind: "error" | "info"; text: React.ReactNode } | null;

const T = {
  ro: {
    contactPre: "Pentru un dosar în lucru, sună-ne la ",
    contactMid: " sau scrie la",
    invalidEmail: "Introdu o adresă de email validă.",
    noPassword: "Introdu parola.",
    notReady: "Portalul client este în pregătire, iar autentificarea va fi activată în curând.",
    resetSoon: "Resetarea parolei va fi disponibilă odată cu lansarea portalului.",
    emailFirst: "Scrie mai întâi adresa de email a contului, apoi apasă din nou „Ai uitat parola?”.",
    email: "Email",
    emailPlaceholder: "nume@exemplu.ro",
    password: "Parolă",
    forgot: "Ai uitat parola?",
    hidePw: "Ascunde parola",
    showPw: "Arată parola",
    hide: "Ascunde",
    show: "Arată",
    remember: "Ține-mă minte pe acest dispozitiv",
    checking: "Se verifică…",
    submit: "Intră în cont",
    noAccount: "Nu ai cont?",
    help: "Accesul în portal îl primești pe email, odată cu confirmarea comenzii de evaluare.",
    request: "Solicită o evaluare →",
    partnerNoAccount: "Nu ai cont de colaborator?",
    partnerHelp: "Lucrezi ca agent imobiliar sau broker de credite? Deschidem conturi de colaborator după un scurt acord de colaborare.",
    partnerRequest: "Solicită cont de colaborator →",
    partnerSubject: "Cont de colaborator VALUEFY",
    partnerNotReady: "Portalul colaboratorilor este în pregătire, iar autentificarea va fi activată în curând. Între timp poți trimite comenzile prin asistentul de pe site.",
  },
  en: {
    contactPre: "For a valuation in progress, call us on ",
    contactMid: " or email",
    invalidEmail: "Enter a valid email address.",
    noPassword: "Enter your password.",
    notReady: "The client portal is being prepared, and sign-in will be enabled soon.",
    resetSoon: "Password reset will be available once the portal launches.",
    emailFirst: "First enter your account email address, then click “Forgot your password?” again.",
    email: "Email",
    emailPlaceholder: "name@example.com",
    password: "Password",
    forgot: "Forgot your password?",
    hidePw: "Hide password",
    showPw: "Show password",
    hide: "Hide",
    show: "Show",
    remember: "Remember me on this device",
    checking: "Checking…",
    submit: "Sign in",
    noAccount: "Don't have an account?",
    help: "You receive portal access by email once your valuation order is confirmed.",
    request: "Request a valuation →",
    partnerNoAccount: "No partner account yet?",
    partnerHelp: "Are you a real-estate agent or mortgage broker? We open partner accounts after a short partnership agreement.",
    partnerRequest: "Apply for a partner account →",
    partnerSubject: "VALUEFY partner account",
    partnerNotReady: "The partner portal is being prepared, and sign-in will be enabled soon. Meanwhile you can send orders through the assistant on the website.",
  },
};

export function LoginForm() {
  const lang = useLang();
  const t = T[lang];
  const partner = useRole() === "partner";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const contact = (
    <>
      {" "}{t.contactPre}<a href={phoneHref(site.phone)}>{site.phone}</a>{t.contactMid}{" "}
      <a href={`mailto:${site.email}`}>{site.email}</a>.
    </>
  );

  const validEmail = /^\S+@\S+\.\S+$/.test(email.trim());

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validEmail) return setNotice({ kind: "error", text: t.invalidEmail });
    if (!password) return setNotice({ kind: "error", text: t.noPassword });
    setBusy(true);
    setNotice(null);
    // No authentication backend yet — the portal is being built.
    setTimeout(() => {
      setBusy(false);
      setNotice({ kind: "info", text: <>{partner ? t.partnerNotReady : t.notReady}{contact}</> });
    }, 600);
  };

  const onForgot = () => {
    setNotice({
      kind: "info",
      text: validEmail
        ? <>{t.resetSoon}{contact}</>
        : t.emailFirst,
    });
  };

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <label className={s.label}>
        {t.email}
        <input
          className={s.input}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <div className={s.label}>
        <span className={s.labelRow}>
          <label htmlFor="password">{t.password}</label>
          <button type="button" className={s.link} onClick={onForgot}>{t.forgot}</button>
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
            aria-label={showPw ? t.hidePw : t.showPw}
            aria-pressed={showPw}
          >
            {showPw ? t.hide : t.show}
          </button>
        </span>
      </div>

      <label className={s.check}>
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        {t.remember}
      </label>

      {notice && (
        <div role={notice.kind === "error" ? "alert" : "status"} className={notice.kind === "error" ? s.error : s.info}>
          {notice.text}
        </div>
      )}

      <button type="submit" className={s.submit} disabled={busy}>
        {busy ? t.checking : t.submit}
      </button>

      {partner ? (
        <>
          <div className={s.divider}><span>{t.partnerNoAccount}</span></div>
          <p className={s.help}>{t.partnerHelp}</p>
          <a href={`mailto:${site.email}?subject=${encodeURIComponent(t.partnerSubject)}`} className={s.secondary}>{t.partnerRequest}</a>
          <p className={s.help}>{site.email} · <a href={phoneHref(site.phone)}>{site.phone}</a></p>
        </>
      ) : (
        <>
          <div className={s.divider}><span>{t.noAccount}</span></div>
          <p className={s.help}>{t.help}</p>
          <a href={localize(lang, "/")} className={s.secondary}>{t.request}</a>
        </>
      )}
    </form>
  );
}
