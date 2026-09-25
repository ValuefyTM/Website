"use client";

import { useEffect, useState } from "react";
import s from "./Hero.module.css";

const STAGES = [
  ["Documente primite", "Extras CF, act de proprietate, releveu"],
  ["Inspecție la fața locului", "Evaluatorul vizitează proprietatea"],
  ["Analiză și evaluare", "Piața din zonă și metodele de evaluare"],
];

export function HeroStages() {
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
        {STAGES.map(([label, sub], i) => {
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
                  <span className={s.stageState}>{d ? "Finalizat" : a ? "În curs…" : "În așteptare"}</span>
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
          <div style={{ color: done ? "#17173A" : "#9A9FA8" }}>{done ? "Raport semnat de evaluator" : "Raport în pregătire"}</div>
          <span>Disponibil în portalul client.</span>
        </div>
      </div>
    </>
  );
}
