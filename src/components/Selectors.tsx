import Image from "next/image";
import { unsplash } from "@/lib/icons";
import { ICONS } from "@/lib/icons";
import { MOBILE, PURPOSES, TYPES } from "@/lib/lead";
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

export function PropertyTypes() {
  return (
    <section aria-labelledby="sel-title" className={`container ${s.types}`}>
      <div className={s.typesHead}>
        <h2 id="sel-title" className="h2">Ce dorești să evaluezi?</h2>
        <p>Selectează tipul proprietății și te ghidăm mai departe.</p>
      </div>
      <div data-rv className={s.typeGrid}>
        {TYPES.map((t) => (
          <AssistantButton key={t.k} type_={t.k} className={s.typeCard} aria-label={`Evaluare ${t.k}`}>
            <div className={s.typeImg}>
              <Image src={unsplash(t.img, 600)} alt="" fill sizes="(max-width: 560px) 50vw, 220px" />
              <div className={s.typeShade} />
              <div className={s.typeIcon}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.icon} alt="" width={24} height={24} />
              </div>
            </div>
            <div className={s.typeFoot}>
              <span>{t.k.toUpperCase()}</span>
              <span className={s.typeArrow} aria-hidden="true">→</span>
            </div>
          </AssistantButton>
        ))}
      </div>
      <div data-rv className={s.mobileBanner}>
        <span className={s.mobileIcon} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ICONS.mobileGold} alt="" width={26} height={26} />
        </span>
        <span className={s.mobileText}>
          <b>Evaluăm și bunuri mobile</b>
          <span>Utilaje, echipamente, autovehicule și mijloace fixe — pentru credit, raportare financiară, vânzare sau alte scopuri.</span>
        </span>
        <AssistantButton type_={MOBILE} className={s.mobileCta}>Solicită evaluare →</AssistantButton>
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
