"use client";

import { useEffect } from "react";

/** Fades/slides section content in as it scrolls into view (skipped for reduced motion). */
export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = document.querySelector("main > section");
    const els = Array.from(document.querySelectorAll<HTMLElement>("main h2, main [data-rv], main ol li, main article")).filter(
      (el) => el.closest("section") !== hero,
    );
    const vh = window.innerHeight || 800;
    const idx = (el: Element) => (el.parentElement ? Math.max(0, Array.from(el.parentElement.children).indexOf(el)) : 0);
    const show = (el: HTMLElement, i = 0) => {
      if (el.dataset.rvDone) return;
      el.dataset.rvDone = "1";
      setTimeout(() => {
        el.classList.add("rv-shown");
        el.classList.remove("rv-pending");
      }, Math.min(i, 6) * 80);
    };
    // Only hide what is below the fold, so nothing visible flickers.
    const pending = els.filter((el) => el.getBoundingClientRect().top > vh * 0.95);
    pending.forEach((el) => el.classList.add("rv-pending"));

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            io.unobserve(e.target);
            show(e.target as HTMLElement, idx(e.target));
          }
        }),
      { threshold: 0 },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
