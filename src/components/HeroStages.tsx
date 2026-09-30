"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/i18n/client";
import s from "./Hero.module.css";

const T = {
  ro: {
    stages: [
      ["Documente primite", "Extras CF, act de proprietate, releveu"],
      ["Inspecție la fața locului", "Evaluatorul vizitează proprietatea"],
      ["Analiză și evaluare", "Piața din zonă și metodele de evaluare"],
    ],
    done: "Finalizat", active: "În curs…", todo: "În așteptare",
    signed: "Raport semnat de evaluator", preparing: "Raport în pregătire", available: "Disponibil în portalul client.",
  },
  en: {
    stages: [
      ["Documents received", "Land registry extract, title deed, floor plan"],
      ["On-site inspection", "The valuer visits the property"],
      ["Analysis and valuation", "The local market and valuation methods"],
    ],
    done: "Completed", active: "In progress…", todo: "Pending",
    signed: "Report signed by the valuer", preparing: "Report in preparation", available: "Available in the client portal.",
  },
};

export function HeroStages() {
  const lang = useLang();
  const t = T[lang];
  const [hs, setHs] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHs(3);
      return;
    }
    let tick = 0;
    const id = setInterval(() => {
      tick = (tick + 1) % 6;
      setHs(Math.min(tick, 3));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const done = hs >= 3;
  return (
    <>
      <div className={s.stages}>
        {t.stages.map(([label, sub], i) => {
          const d = i < hs, a = i === hs;
          return (
            <div key={label} className={s.stage}>
              <div
                className={s.stageDot}
                style={{ background: d ? "var(--acc)" : "#fff", borderColor: d || a ? "var(--acc)" : "#D5D8DE" }}
              >
                {d ? "✓" : ""}
              </div>
              <div className={s.stageBody}>
                <div className={s.stageHead}>
                  <span style={{ color: d || a ? "#17173A" : "#9A9FA8" }}>{label}</span>
                  <span className={s.stageState}>{d ? t.done : a ? t.active : t.todo}</span>
                </div>
                <div className={s.stageSub}>{sub}</div>
                <div className={s.stageTrack}>
                  <div style={{ width: d || a ? "100%" : "0%", transition: a ? "width 1.6s cubic-bezier(.4,0,.2,1)" : "none" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={s.doneBox} style={{ background: done ? "var(--acc-soft)" : "#F7F8FA" }}>
        <div className={s.doneIcon} style={{ background: done ? "var(--acc)" : "#D5D8DE" }}>✓</div>
        <div className={s.doneText}>
          <div style={{ color: done ? "#17173A" : "#9A9FA8" }}>{done ? t.signed : t.preparing}</div>
          <span>{t.available}</span>
        </div>
      </div>
    </>
  );
}
