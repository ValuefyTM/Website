import Image from "next/image";
import { ICONS, unsplash } from "@/lib/icons";
import { getLang } from "@/i18n/server";
import { AssistantButton } from "./AssistantButton";
import { HeroStages } from "./HeroStages";
import s from "./Hero.module.css";

const T = {
  ro: {
    pill: "Timișoara, vestul României și la nivel național",
    title1: "Evaluări imobiliare.",
    title2: "Simplu, rapid și profesionist.",
    lead: "Rapoarte de evaluare pentru proprietăți rezidențiale, comerciale și industriale, dar și pentru bunuri mobile, printr-un proces simplu și digital.",
    cta: "Solicită o evaluare →",
    badge: "Firmă autorizată ANEVAR",
    badgeSub: "Rapoarte conforme Standardelor de Evaluare",
    check1: "✓ Proces digital, portal client",
    check2: "✓ Persoane fizice & companii",
    visual: "Ilustrație: proprietate, date, analiză, valoare",
    chipA: "Extras CF încărcat", chipASub: "acum câteva secunde",
    month: "OCT",
    chipB: "Inspecție programată", chipBSub: "Joi · 10:00",
    photoAlt: "Bloc de apartamente",
    eyebrow: "Proprietate",
    propName: "Apartament",
    propMeta: "Timișoara · 72 m² · 3 camere",
  },
  en: {
    pill: "Timișoara, western Romania and nationwide",
    title1: "Property valuations.",
    title2: "Simple, fast and professional.",
    lead: "Valuation reports for residential, commercial and industrial properties, as well as movable assets, through a simple, digital process.",
    cta: "Request a valuation →",
    badge: "ANEVAR-authorised firm",
    badgeSub: "Reports compliant with the Valuation Standards",
    check1: "✓ Digital process, client portal",
    check2: "✓ Individuals & companies",
    visual: "Illustration: property, data, analysis, value",
    chipA: "Land registry extract uploaded", chipASub: "a few seconds ago",
    month: "OCT",
    chipB: "Inspection scheduled", chipBSub: "Thu · 10:00",
    photoAlt: "Apartment building",
    eyebrow: "Property",
    propName: "Apartment",
    propMeta: "Timișoara · 72 m² · 3 rooms",
  },
};

export function Hero() {
  const t = T[getLang()];
  return (
    <section aria-labelledby="hero-title" className={s.hero}>
      <div aria-hidden="true" className={s.grad} />
      <div aria-hidden="true" className={`${s.blob} ${s.blob1}`} />
      <div aria-hidden="true" className={`${s.blob} ${s.blob2}`} />
      <div aria-hidden="true" className={`${s.blob} ${s.blob3}`} />
      <div aria-hidden="true" className={s.dots} />

      <div className={s.inner}>
        <div className={s.copy}>
          <div className={s.pill}>
            <span className={s.pillDot}><span /></span>
            {t.pill}
          </div>
          <h1 id="hero-title" className={s.title}>
            <span>{t.title1}</span>
            <span className={s.line2}>{t.title2}</span>
          </h1>
          <p className={s.lead}>{t.lead}</p>
          <div>
            <AssistantButton className={s.cta}>{t.cta}</AssistantButton>
          </div>
          <div className={s.trust}>
            <div className={s.badge}>
              <span className={s.seal} aria-hidden="true"><b>✓</b><small>ANEVAR</small></span>
              <span className={s.badgeText}>
                <strong>{t.badge}</strong>
                <span>{t.badgeSub}</span>
              </span>
            </div>
            <div className={s.checks}>
              <span>{t.check1}</span>
              <span>{t.check2}</span>
            </div>
          </div>
        </div>

        <div role="img" aria-label={t.visual} className={s.visual}>
          <div aria-hidden="true" className={`${s.chip} ${s.chipA}`}>
            <span className={s.chipOk}>✓</span>
            <span className={s.chipText}><b>{t.chipA}</b><small>{t.chipASub}</small></span>
          </div>
          <div aria-hidden="true" className={`${s.chip} ${s.chipB}`}>
            <span className={s.chipCal}><small>{t.month}</small><b>09</b></span>
            <span className={s.chipText}><b>{t.chipB}</b><small>{t.chipBSub}</small></span>
          </div>

          <div className={s.card}>
            <div className={s.photo}>
              <Image src={unsplash("photo-1545324418-cc1a3fa10c00", 1200)} alt={t.photoAlt} fill priority sizes="(max-width: 1080px) 100vw, 560px" />
              <div className={s.photoShade} />
            </div>
            <div className={s.prop}>
              <div className={s.propIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ICONS.apt} alt="" width={24} height={24} />
              </div>
              <div className={s.propText}>
                <div className={s.propEyebrow}>{t.eyebrow}</div>
                <div className={s.propName}>{t.propName}</div>
                <div className={s.propMeta}>{t.propMeta}</div>
              </div>
              <div className={s.propId}>VF-2417</div>
            </div>
            <HeroStages />
          </div>
        </div>
      </div>
    </section>
  );
}
