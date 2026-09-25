import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./LoginForm";
import s from "./client.module.css";

export const metadata: Metadata = {
  title: "Autentificare portal client | VALUEFY",
  description: "Intră în portalul client VALUEFY: statusul evaluării, rapoartele și legătura cu evaluatorul.",
  robots: { index: false },
};

const FEATS = [
  ["Status pe fiecare etapă", "Documente, inspecție, analiză și raport — știi mereu unde e dosarul."],
  ["Rapoarte și documente", "Raportul semnat, anexele și facturile, disponibile oricând."],
  ["Legătură cu evaluatorul", "Mesaje și documente noi, în același loc."],
];

const STEPS: [string, "done" | "active" | "todo"][] = [
  ["Documente primite", "done"],
  ["Inspecție realizată", "done"],
  ["Analiză în desfășurare", "active"],
  ["Raport semnat", "todo"],
];

export default function ClientLogin() {
  return (
    <div className={s.page}>
      <aside className={s.side} aria-label="Despre portalul client">
        <div aria-hidden="true" className={s.glow} />
        <div className={s.sideBody}>
          <div className={s.eyebrow}>Portal client</div>
          <h2 className={s.sideTitle}>Evaluarea ta, pas cu pas, într-un singur loc.</h2>
          <ul className={s.feats}>
            {FEATS.map(([t, d], i) => (
              <li key={t}>
                <span className={s.featN}>{String(i + 1).padStart(2, "0")}</span>
                <span><b>{t}</b><span>{d}</span></span>
              </li>
            ))}
          </ul>
          <div className={s.mini} aria-hidden="true">
            <div className={s.miniHead}>
              <span>
                <small>VF-2417</small>
                <b>Apartament · Timișoara</b>
              </span>
              <em>În lucru</em>
            </div>
            {STEPS.map(([label, k]) => (
              <div key={label} className={`${s.miniRow} ${k === "active" ? s.miniActive : ""}`}>
                <span className={`${s.miniDot} ${s["dot_" + k]}`}>{k === "done" ? "✓" : ""}</span>
                <span className={k === "todo" ? s.miniTodo : undefined}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className={s.sideFoot}>Firmă autorizată ANEVAR</p>
      </aside>

      <main className={s.main}>
        <div className={s.topbar}>
          <a href="/" className={s.mobileLogo} aria-label="VALUEFY — acasă">
            <Image src="/valuefy-logo.png" alt="VALUEFY" width={137} height={28} priority />
          </a>
          <a href="/" className={s.back}>← Înapoi la site</a>
        </div>
        <div className={s.formWrap}>
          <h1 className={s.title}>Intră în cont</h1>
          <p className={s.subtitle}>Urmărește evaluarea, descarcă rapoartele și vorbește cu evaluatorul.</p>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
