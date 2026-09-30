import type { Metadata } from "next";
import Image from "next/image";
import { setLang } from "@/i18n/server";
import { localize, type Lang } from "@/i18n/lang";
import { label } from "@/i18n/labels";
import { LoginForm } from "./LoginForm";
import s from "./client.module.css";

// Shared by /client and /en/client — see page.tsx in both route trees.

const T = {
  ro: {
    title: "Autentificare portal client | VALUEFY",
    description: "Intră în portalul client VALUEFY: statusul evaluării, rapoartele și legătura cu evaluatorul.",
    feats: [
      ["Status pe fiecare etapă", "Documente, inspecție, analiză și raport — știi mereu unde e dosarul."],
      ["Rapoarte și documente", "Raportul semnat, anexele și facturile, disponibile oricând."],
      ["Legătură cu evaluatorul", "Mesaje și documente noi, în același loc."],
    ],
    steps: ["Documente primite", "Inspecție realizată", "Analiză în desfășurare", "Raport semnat"],
    sideLabel: "Despre portalul client",
    eyebrow: "Portal client",
    sideTitle: "Evaluarea ta, pas cu pas, într-un singur loc.",
    inProgress: "În lucru",
    sideFoot: "Firmă autorizată ANEVAR",
    homeLabel: "VALUEFY — acasă",
    back: "← Înapoi la site",
    h1: "Intră în cont",
    subtitle: "Urmărește evaluarea, descarcă rapoartele și vorbește cu evaluatorul.",
  },
  en: {
    title: "Client portal sign-in | VALUEFY",
    description: "Sign in to the VALUEFY client portal: your valuation status, your reports and a direct line to your valuer.",
    feats: [
      ["Status at every stage", "Documents, inspection, analysis and report — you always know where your file is."],
      ["Reports and documents", "The signed report, appendices and invoices, available at any time."],
      ["A direct line to your valuer", "Messages and new documents, all in one place."],
    ],
    steps: ["Documents received", "Inspection completed", "Analysis in progress", "Report signed"],
    sideLabel: "About the client portal",
    eyebrow: "Client portal",
    sideTitle: "Your valuation, step by step, in one place.",
    inProgress: "In progress",
    sideFoot: "ANEVAR-authorised firm",
    homeLabel: "VALUEFY — home",
    back: "← Back to the website",
    h1: "Sign in",
    subtitle: "Track your valuation, download your reports and talk to your valuer.",
  },
};

const STATES: ("done" | "active" | "todo")[] = ["done", "done", "active", "todo"];

export function clientMetadata(lang: Lang): Metadata {
  const t = T[lang];
  return {
    title: t.title,
    description: t.description,
    robots: { index: false },
    alternates: { canonical: localize(lang, "/client"), languages: { ro: "/client", en: localize("en", "/client") } },
  };
}

export function ClientLoginView({ lang }: { lang: Lang }) {
  setLang(lang);
  const t = T[lang];
  return (
    <div className={s.page}>
      <aside className={s.side} aria-label={t.sideLabel}>
        <div aria-hidden="true" className={s.glow} />
        <div className={s.sideBody}>
          <div className={s.eyebrow}>{t.eyebrow}</div>
          <h2 className={s.sideTitle}>{t.sideTitle}</h2>
          <ul className={s.feats}>
            {t.feats.map(([title, d], i) => (
              <li key={title}>
                <span className={s.featN}>{String(i + 1).padStart(2, "0")}</span>
                <span><b>{title}</b><span>{d}</span></span>
              </li>
            ))}
          </ul>
          <div className={s.mini} aria-hidden="true">
            <div className={s.miniHead}>
              <span>
                <small>VF-2417</small>
                <b>{label("Apartament", lang)} · Timișoara</b>
              </span>
              <em>{t.inProgress}</em>
            </div>
            {t.steps.map((step, i) => {
              const k = STATES[i];
              return (
                <div key={step} className={`${s.miniRow} ${k === "active" ? s.miniActive : ""}`}>
                  <span className={`${s.miniDot} ${s["dot_" + k]}`}>{k === "done" ? "✓" : ""}</span>
                  <span className={k === "todo" ? s.miniTodo : undefined}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
        <p className={s.sideFoot}>{t.sideFoot}</p>
      </aside>

      <main className={s.main}>
        <div className={s.topbar}>
          <a href={localize(lang, "/")} className={s.mobileLogo} aria-label={t.homeLabel}>
            <Image src="/valuefy-logo.png" alt="VALUEFY" width={137} height={28} priority />
          </a>
          <a href={localize(lang, "/")} className={s.back}>{t.back}</a>
        </div>
        <div className={s.formWrap}>
          <h1 className={s.title}>{t.h1}</h1>
          <p className={s.subtitle}>{t.subtitle}</p>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
