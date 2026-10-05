import { ICONS, unsplash } from "@/lib/icons";
import { ASSET_TYPES, MOBILE, PURPOSES } from "@/lib/lead";
import { getLang } from "@/i18n/server";
import { localize } from "@/i18n/lang";
import { label } from "@/i18n/labels";
import { AssistantButton } from "./AssistantButton";
import s from "./Selectors.module.css";

const T = {
  ro: {
    typesTitle: "Ce dorești să evaluezi?",
    typesLead: "Selectează tipul proprietății sau al bunului și te ghidăm mai departe.",
    typeAria: (k: string) => `Evaluare ${k}`,
    mobileTitle: "Evaluăm și bunuri mobile",
    mobileText: "Utilaje, echipamente, autovehicule și mijloace fixe — pentru credit, raportare financiară, vânzare sau alte scopuri.",
    mobileMore: "Ce evaluăm",
    mobileCta: "Solicită evaluare →",
    purposeEyebrow: "Scopul evaluării",
    purposeTitle: "Pentru ce ai nevoie de evaluare?",
    purposeLead: "Alege scopul, iar noi pregătim raportul potrivit cerințelor băncii, instanței sau autorităților.",
    purposeDesc: [
      "Raport pentru garantarea unui credit ipotecar sau de investiții.",
      "Afli valoarea de piață înainte de negociere.",
      "Evaluarea clădirilor pentru calculul impozitului local.",
      "Active evaluate pentru situațiile financiare și contabilitate.",
      "Valoarea bunurilor pentru moștenire sau partaj.",
      "Rapoarte pentru instanță, executări și proceduri.",
      "Bunuri aduse în garanție pentru plata în rate a datoriilor la ANAF.",
      "Asigurare, aport la capital sau alt scop specific.",
    ],
  },
  en: {
    typesTitle: "What would you like valued?",
    typesLead: "Select the type of property or asset and we'll guide you from there.",
    typeAria: (k: string) => `${k} valuation`,
    mobileTitle: "We also value movable assets",
    mobileText: "Machinery, equipment, vehicles and fixed assets — for loans, financial reporting, sale or other purposes.",
    mobileMore: "What we value",
    mobileCta: "Request a valuation →",
    purposeEyebrow: "Purpose of the valuation",
    purposeTitle: "What do you need the valuation for?",
    purposeLead: "Choose the purpose and we'll prepare a report that meets the requirements of the bank, the court or the authorities.",
    purposeDesc: [
      "A report to secure a mortgage or investment loan.",
      "Find out the market value before negotiating.",
      "Building valuation for calculating local property tax.",
      "Assets valued for financial statements and accounting.",
      "The value of assets for inheritance or division.",
      "Reports for court, enforcement and legal proceedings.",
      "Assets offered as collateral to pay tax debts to ANAF in instalments.",
      "Insurance, capital contribution or another specific purpose.",
    ],
  },
};

// Property types + movable assets (movable assets use a photo hosted on the site).
const CARDS = ASSET_TYPES.map((t) => ({
  k: t.k,
  icon: t.icon,
  photo: t.k === MOBILE ? "/photos/bunuri-mobile.jpg" : unsplash(t.img, 600),
}));

export function PropertyTypes() {
  const lang = getLang();
  const t = T[lang];
  return (
    <section aria-labelledby="sel-title" className={`container ${s.types}`}>
      <div className={s.typesHead}>
        <h2 id="sel-title" className="h2">{t.typesTitle}</h2>
        <p>{t.typesLead}</p>
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
              <span>{label(c.k, lang).toUpperCase()}</span>
              <span className={s.typeArrow} aria-hidden="true">→</span>
            </div>
            {/* Transparent button covering the whole card. */}
            <AssistantButton type_={c.k} className={s.typeHit} aria-label={t.typeAria(label(c.k, lang))} />
          </li>
        ))}
      </ul>
      <div data-rv className={s.mobileBanner}>
        <span className={s.mobileIcon} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ICONS.mobileGold} alt="" width={26} height={26} />
        </span>
        <span className={s.mobileText}>
          <b>{t.mobileTitle}</b>
          <span>{t.mobileText}</span>
        </span>
        <span className={s.mobileActions}>
          <a href={localize(lang, "/evaluare-bunuri-mobile")} className={s.mobileMore}>{t.mobileMore}</a>
          <AssistantButton type_={MOBILE} className={s.mobileCta}>{t.mobileCta}</AssistantButton>
        </span>
      </div>
    </section>
  );
}

export function Purposes() {
  const lang = getLang();
  const t = T[lang];
  return (
    <section aria-labelledby="scop-title" className={`container ${s.purposes}`}>
      <div className={s.purposeGrid}>
        <div className={s.purposeIntro}>
          <div className="eyebrow">{t.purposeEyebrow}</div>
          <h2 id="scop-title" className="h2">{t.purposeTitle}</h2>
          <p>{t.purposeLead}</p>
        </div>
        <ul data-rv className={s.purposeList}>
          {PURPOSES.map((p, i) => (
            <li key={p}>
              <AssistantButton purpose={p} className={s.purposeBtn}>
                <span className={s.purposeN}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.purposeText}>
                  <span className={s.purposeLabel}>{label(p, lang)}</span>
                  <span className={s.purposeDesc}>{t.purposeDesc[i]}</span>
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
