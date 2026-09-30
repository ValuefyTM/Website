"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { useLang } from "@/i18n/client";
import { localize, switchPath, type Lang } from "@/i18n/lang";
import { useAssistant } from "./Assistant";
import s from "./Header.module.css";

const T = {
  ro: {
    home: "VALUEFY — acasă", nav: "Navigare principală", services: "Servicii", how: "Cum funcționează", faqShort: "Întrebări",
    about: "Despre noi", faq: "Întrebări frecvente", contact: "Contact", portal: "Portal client", estate: "Portal Imobiliar",
    cta: "Solicită evaluare", openMenu: "Deschide meniul", closeMenu: "Închide meniul", mobileMenu: "Meniu mobil", language: "Limba",
  },
  en: {
    home: "VALUEFY — home", nav: "Main navigation", services: "Services", how: "How it works", faqShort: "FAQ",
    about: "About us", faq: "FAQ", contact: "Contact", portal: "Client portal", estate: "Real Estate Portal",
    cta: "Request a valuation", openMenu: "Open menu", closeMenu: "Close menu", mobileMenu: "Mobile menu", language: "Language",
  },
};

/** RO / EN switch — links to the same page in the other language. */
export function LangSwitch({ className }: { className?: string }) {
  const lang = useLang();
  const path = usePathname() || "/";
  const t = T[lang];
  return (
    <div className={`${s.lang} ${className ?? ""}`} role="group" aria-label={t.language}>
      {(["ro", "en"] as Lang[]).map((l) => (
        <a key={l} href={switchPath(path, l)} hrefLang={l} lang={l} aria-current={l === lang ? "true" : undefined}>
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}

export function Header() {
  const { open, menuOpen, setMenuOpen } = useAssistant();
  const lang = useLang();
  const t = T[lang];
  const L = (p: string) => localize(lang, p);
  const mobileLinks = [
    [t.services, L("/#servicii")],
    [t.how, L("/#cum-functioneaza")],
    [t.about, L("/#despre")],
    [t.faq, L("/#faq")],
    [t.portal, L(site.portalUrl)],
    [t.estate, L("/imobiliare")],
    [t.contact, L("/#contact")],
  ];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`${s.header} ${scrolled ? s.scrolled : ""}`}>
        <div className={s.bar}>
          <a href={L("/")} aria-label={t.home} className={s.logo}>
            <Image src="/valuefy-logo.png" alt="VALUEFY" width={137} height={28} priority />
          </a>
          <nav aria-label={t.nav} className={s.nav}>
            <a href={L("/#servicii")}>{t.services}</a>
            <a href={L("/#cum-functioneaza")}>{t.how}</a>
            <a href={L("/#faq")}>{t.faqShort}</a>
          </nav>
          <div className={s.actions}>
            <LangSwitch />
            <a href={L(site.portalUrl)} className={s.portal}>
              <span className={s.portalIcon}><span /></span>{t.portal}
            </a>
            <a href={L("/imobiliare")} className={`${s.portal} ${s.estate}`}>
              <span className={s.estateIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" />
                </svg>
              </span>
              {t.estate}
            </a>
            <button type="button" className={s.cta} onClick={() => open()}>
              {t.cta}<span className={s.ctaArrow} aria-hidden="true">→</span>
            </button>
          </div>
          <LangSwitch className={s.langMobile} />
          <button
            type="button"
            className={s.burger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span /><span /><span />
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-menu" aria-label={t.mobileMenu} className={s.mobileMenu}>
            {mobileLinks.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)}>
                {label}<span aria-hidden="true">→</span>
              </a>
            ))}
            <button type="button" onClick={() => open()} className={s.mobileCta}>{t.cta}</button>
          </nav>
        )}
      </header>
      <div aria-hidden="true" className={s.spacer} />
    </>
  );
}
