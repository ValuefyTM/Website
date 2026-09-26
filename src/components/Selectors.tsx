import { ICONS, unsplash } from "@/lib/icons";
import { ASSET_TYPES, MOBILE, PURPOSES } from "@/lib/lead";
import { AssistantButton } from "./AssistantButton";
import s from "./Selectors.module.css";

const PURPOSE_DESC = [
  "Raport pentru garantarea unui credit ipotecar sau de investiții.",
  "Afli valoarea de piață înainte de negociere.",
  "Evaluarea clădirilor pentru calculul impozitului local.",
  "Active evaluate pentru situațiile financiare și contabilitate.",
  "Valoarea bunurilor pentru moștenire sau partaj.",
  "Rapoarte pentru instanță, executări și proceduri.",
  "Asigurare, aport la capital sau alt scop specific.",
];

// Property types + movable assets (movable assets use a photo hosted on the site).
const CARDS = ASSET_TYPES.map((t) => ({
  k: t.k,
  icon: t.icon,
  photo: t.k === MOBILE ? "/photos/bunuri-mobile.jpg" : unsplash(t.img, 600),
}));

export function PropertyTypes() {
  return (
    <section aria-labelledby="sel-title" className={`container ${s.types}`}>
      <div className={s.typesHead}>
        <h2 id="sel-title" className="h2">Ce dorești să evaluezi?</h2>
        <p>Selectează tipul proprietății sau al bunului și te ghidăm mai departe.</p>
      </div>
      <ul data-rv className={s.typeGrid}>
        {CARDS.map((c) => (
          <li key={c.k} className={`${s.typeCard} ${c.k === MOBILE ? s.typeWide : ""}`}>
            <div className={s.typeImg}>
              {/* Plain <img> in normal flow (not inside the button) so every browser paints it. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={s.typePhoto} src={c.photo} alt="" loading="lazy" decoding="async" style={c.k === MOBILE ? { objectPosition: "50% 78%" } : undefined} />
              <div className={s.typeIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.icon} alt="" width={24} height={24} />
              </div>
            </div>
            <div className={s.typeFoot}>
              <span>{c.k.toUpperCase()}</span>
              <span className={s.typeArrow} aria-hidden="true">→</span>
            </div>
            {/* Transparent button covering the whole card. */}
            <AssistantButton type_={c.k} className={s.typeHit} aria-label={`Evaluare ${c.k}`} />
          </li>
        ))}
      </ul>
      <div data-rv className={s.mobileBanner}>
        <span className={s.mobileIcon} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ICONS.mobileGold} alt="" width={26} height={26} />
        </span>
        <span className={s.mobileText}>
          <b>Evaluăm și bunuri mobile</b>
          <span>Utilaje, echipamente, autovehicule și mijloace fixe — pentru credit, raportare financiară, vânzare sau alte scopuri.</span>
        </span>
        <span className={s.mobileActions}>
          <a href="/evaluare-bunuri-mobile" className={s.mobileMore}>Ce evaluăm</a>
          <AssistantButton type_={MOBILE} className={s.mobileCta}>Solicită evaluare →</AssistantButton>
        </span>
      </div>
    </section>
  );
}

export function Purposes() {
  return (
    <section aria-labelledby="scop-title" className={`container ${s.purposes}`}>
      <div className={s.purposeGrid}>
        <div className={s.purposeIntro}>
          <div className="eyebrow">Scopul evaluării</div>
          <h2 id="scop-title" className="h2">Pentru ce ai nevoie de evaluare?</h2>
          <p>Alege scopul, iar noi pregătim raportul potrivit cerințelor băncii, instanței sau autorităților.</p>
        </div>
        <ul data-rv className={s.purposeList}>
          {PURPOSES.map((p, i) => (
            <li key={p}>
              <AssistantButton purpose={p} className={s.purposeBtn}>
                <span className={s.purposeN}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.purposeText}>
                  <span className={s.purposeLabel}>{p}</span>
                  <span className={s.purposeDesc}>{PURPOSE_DESC[i]}</span>
                </span>
                <span aria-hidden="true" className={s.purposeArrow}>→</span>
              </AssistantButton>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
