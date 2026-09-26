import Image from "next/image";
import { ICONS, unsplash } from "@/lib/icons";
import { AssistantButton } from "./AssistantButton";
import { HeroStages } from "./HeroStages";
import s from "./Hero.module.css";

export function Hero() {
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
            Timișoara, vestul României și la nivel național
          </div>
          <h1 id="hero-title" className={s.title}>
            <span>Evaluări imobiliare.</span>
            <span className={s.line2}>Simplu, rapid și profesionist.</span>
          </h1>
          <p className={s.lead}>
            Rapoarte de evaluare pentru proprietăți rezidențiale, comerciale și industriale, dar și pentru bunuri mobile, printr-un proces simplu și digital.
          </p>
          <div>
            <AssistantButton className={s.cta}>Solicită o evaluare →</AssistantButton>
          </div>
          <div className={s.trust}>
            <div className={s.badge}>
              <span className={s.seal} aria-hidden="true"><b>✓</b><small>ANEVAR</small></span>
              <span className={s.badgeText}>
                <strong>Firmă autorizată ANEVAR</strong>
                <span>Rapoarte conforme Standardelor de Evaluare</span>
              </span>
            </div>
            <div className={s.checks}>
              <span>✓ Proces digital, portal client</span>
              <span>✓ Persoane fizice &amp; companii</span>
            </div>
          </div>
        </div>

        <div role="img" aria-label="Ilustrație: proprietate, date, analiză, valoare" className={s.visual}>
          <div aria-hidden="true" className={`${s.chip} ${s.chipA}`}>
            <span className={s.chipOk}>✓</span>
            <span className={s.chipText}><b>Extras CF încărcat</b><small>acum câteva secunde</small></span>
          </div>
          <div aria-hidden="true" className={`${s.chip} ${s.chipB}`}>
            <span className={s.chipCal}><small>OCT</small><b>09</b></span>
            <span className={s.chipText}><b>Inspecție programată</b><small>Joi · 10:00</small></span>
          </div>

          <div className={s.card}>
            <div className={s.photo}>
              <Image src={unsplash("photo-1545324418-cc1a3fa10c00", 1200)} alt="Bloc de apartamente" fill priority sizes="(max-width: 1080px) 100vw, 560px" />
              <div className={s.photoShade} />
            </div>
            <div className={s.prop}>
              <div className={s.propIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ICONS.apt} alt="" width={24} height={24} />
              </div>
              <div className={s.propText}>
                <div className={s.propEyebrow}>Proprietate</div>
                <div className={s.propName}>Apartament</div>
                <div className={s.propMeta}>Timișoara · 72 m² · 3 camere</div>
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
