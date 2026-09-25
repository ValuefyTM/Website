"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { useAssistant } from "./Assistant";
import s from "./Header.module.css";

const mobileLinks = [
  ["Servicii", "/#servicii"],
  ["Cum funcționează", "/#cum-functioneaza"],
  ["Despre noi", "/#despre"],
  ["Întrebări frecvente", "/#faq"],
  ["Portal client", site.portalUrl],
  ["Contact", "/#contact"],
];

export function Header() {
  const { open, menuOpen, setMenuOpen } = useAssistant();
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
          <a href="/" aria-label="VALUEFY — acasă" className={s.logo}>
            <Image src="/valuefy-logo.png" alt="VALUEFY" width={137} height={28} priority />
          </a>
          <nav aria-label="Navigare principală" className={s.nav}>
            <a href="/#servicii">Servicii</a>
            <a href="/#cum-functioneaza">Cum funcționează</a>
            <a href="/#faq">Întrebări</a>
          </nav>
          <div className={s.actions}>
            <a href={site.portalUrl} className={s.portal}>
              <span className={s.portalIcon}><span /></span>Portal client
            </a>
            <button type="button" className={s.cta} onClick={() => open()}>
              Solicită evaluare<span className={s.ctaArrow} aria-hidden="true">→</span>
            </button>
          </div>
          <button
            type="button"
            className={s.burger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Închide meniul" : "Deschide meniul"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span /><span /><span />
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-menu" aria-label="Meniu mobil" className={s.mobileMenu}>
            {mobileLinks.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)}>
                {label}<span aria-hidden="true">→</span>
              </a>
            ))}
            <button type="button" onClick={() => open()} className={s.mobileCta}>Solicită evaluare</button>
          </nav>
        )}
      </header>
      <div aria-hidden="true" className={s.spacer} />
    </>
  );
}
