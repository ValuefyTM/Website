import type { Metadata } from "next";
import Image from "next/image";
import { setLang } from "@/i18n/server";
import { localize, type Lang } from "@/i18n/lang";
import { label } from "@/i18n/labels";
import { LoginForm } from "./LoginForm";
import { RoleOnly, RoleProvider, RoleTabs } from "./role";
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
    partnerEyebrow: "Portal colaboratori",
    partnerTitle: "Comandă evaluări pentru clienții tăi și urmărește-le pe toate.",
    partnerFeats: [
      ["Comenzi în numele clienților", "Trimiți solicitarea cu datele proprietății și ale clientului, în câteva minute."],
      ["Toate dosarele într-un loc", "Vezi statusul fiecărei evaluări comandate, pe client și pe proprietate."],
      ["Raportul ajunge la timp", "Tu și clientul tău primiți raportul și documentele imediat ce sunt gata."],
    ],
    partnerH1: "Intră în contul de colaborator",
    partnerSubtitle: "Pentru agenți imobiliari și brokeri de credite care comandă evaluări în numele clienților lor.",
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
    partnerEyebrow: "Partner portal",
    partnerTitle: "Order valuations for your clients and track them all.",
    partnerFeats: [
      ["Orders on behalf of your clients", "Send a request with the property and client details in a few minutes."],
      ["Every file in one place", "See the status of each valuation you ordered, by client and by property."],
      ["Reports delivered on time", "You and your client receive the report and documents as soon as they are ready."],
    ],
    partnerH1: "Sign in to your partner account",
    partnerSubtitle: "For real-estate agents and mortgage brokers who order valuations on behalf of their clients.",
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
    <RoleProvider>
    <div className={s.page}>
      <aside className={s.side} aria-label={t.sideLabel}>
        <div aria-hidden="true" className={s.glow} />
        <div className={s.sideBody}>
          <RoleOnly role="client">
            <div className={s.eyebrow}>{t.eyebrow}</div>
            <h2 className={s.sideTitle}>{t.sideTitle}</h2>
            <Feats items={t.feats} />
          </RoleOnly>
          <RoleOnly role="partner">
            <div className={s.eyebrow}>{t.partnerEyebrow}</div>
            <h2 className={s.sideTitle}>{t.partnerTitle}</h2>
            <Feats items={t.partnerFeats} />
          </RoleOnly>
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
          <RoleTabs />
          <div id="login-panel" role="tabpanel" aria-labelledby="role-client role-partner" className={s.panel}>
            <RoleOnly role="client">
              <h1 className={s.title}>{t.h1}</h1>
              <p className={s.subtitle}>{t.subtitle}</p>
            </RoleOnly>
            <RoleOnly role="partner">
              <h1 className={s.title}>{t.partnerH1}</h1>
              <p className={s.subtitle}>{t.partnerSubtitle}</p>
            </RoleOnly>
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
    </RoleProvider>
  );
}

function Feats({ items }: { items: string[][] }) {
  return (
    <ul className={s.feats}>
      {items.map(([title, d], i) => (
        <li key={title}>
          <span className={s.featN}>{String(i + 1).padStart(2, "0")}</span>
          <span><b>{title}</b><span>{d}</span></span>
        </li>
      ))}
    </ul>
  );
}
