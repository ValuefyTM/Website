"use client";

import { useState } from "react";
import { site, phoneHref } from "@/config/site";
import { useAssistant } from "./Assistant";
import { FAQS } from "@/lib/faqs";
import s from "./Faq.module.css";

export function Faq() {
  const { open } = useAssistant();
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className={`anchor ${s.faq}`}>
      <div className={`container ${s.inner}`}>
        <div className={s.side}>
          <div className={s.head}>
            <div className="eyebrow">Întrebări frecvente</div>
            <h2 id="faq-title" className="h2">Ce vor să știe clienții înainte de evaluare.</h2>
          </div>
          <div className={s.help}>
            <div aria-hidden="true" className={s.helpGlow} />
            <span className={s.helpTitle}>Nu găsești răspunsul?</span>
            <span className={s.helpText}>Întreabă asistentul sau sună-ne — îți răspundem pe loc.</span>
            <div className={s.helpActions}>
              <button type="button" className={s.helpAsk} onClick={() => open()}>Întreabă asistentul →</button>
              <a href={phoneHref(site.phone)} className={s.helpPhone}>{site.phone}</a>
            </div>
          </div>
        </div>
        <div data-rv className={s.list}>
          {FAQS.map(([q, a], i) => {
            const o = openIdx === i;
            return (
              <div key={q} className={`${s.item} ${o ? s.itemOpen : ""}`}>
                <h3 className={s.qWrap}>
                  <button
                    type="button"
                    className={s.q}
                    aria-expanded={o}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpenIdx(o ? -1 : i)}
                  >
                    <span className={s.n}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={s.qText}>{q}</span>
                    <span aria-hidden="true" className={s.plus}>+</span>
                  </button>
                </h3>
                {o && <p id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={s.a}>{a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
