"use client";

import { useState } from "react";
import { site, phoneHref } from "@/config/site";
import { useLang } from "@/i18n/client";
import { useAssistant } from "./Assistant";
import { FAQS } from "@/lib/faqs";
import s from "./Faq.module.css";

const T = {
  ro: {
    eyebrow: "Întrebări frecvente",
    title: "Ce vor să știe clienții înainte de evaluare.",
    helpTitle: "Nu găsești răspunsul?",
    helpText: "Întreabă asistentul sau sună-ne — îți răspundem pe loc.",
    ask: "Întreabă asistentul →",
  },
  en: {
    eyebrow: "FAQ",
    title: "What clients want to know before a valuation.",
    helpTitle: "Can't find the answer?",
    helpText: "Ask the assistant or give us a call — we'll answer right away.",
    ask: "Ask the assistant →",
  },
};

export function Faq() {
  const { open } = useAssistant();
  const lang = useLang();
  const t = T[lang];
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className={`anchor ${s.faq}`}>
      <div className={`container ${s.inner}`}>
        <div className={s.side}>
          <div className={s.head}>
            <div className="eyebrow">{t.eyebrow}</div>
            <h2 id="faq-title" className="h2">{t.title}</h2>
          </div>
          <div className={s.help}>
            <div aria-hidden="true" className={s.helpGlow} />
            <span className={s.helpTitle}>{t.helpTitle}</span>
            <span className={s.helpText}>{t.helpText}</span>
            <div className={s.helpActions}>
              <button type="button" className={s.helpAsk} onClick={() => open()}>{t.ask}</button>
              <a href={phoneHref(site.phone)} className={s.helpPhone}>{site.phone}</a>
            </div>
          </div>
        </div>
        <div data-rv className={s.list}>
          {FAQS[lang].map(([q, a], i) => {
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
