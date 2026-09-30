"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n/client";
import s from "./listing.module.css";

const T = {
  ro: {
    soon: "Fotografiile vor fi adăugate în curând",
    open: (i: number, n: number) => `Deschide fotografia ${i} din ${n}`,
    photo: (title: string, i: number) => `${title} — fotografia ${i}`,
    photoOf: (title: string, i: number, n: number) => `${title} — fotografia ${i} din ${n}`,
    seeOne: "Vezi fotografia", seeAll: (n: number) => `Vezi toate cele ${n} fotografii`,
    dialog: (title: string) => `Fotografii — ${title}`, close: "Închide galeria",
    prev: "Fotografia anterioară", next: "Fotografia următoare", nth: (i: number) => `Fotografia ${i}`,
  },
  en: {
    soon: "Photos will be added soon",
    open: (i: number, n: number) => `Open photo ${i} of ${n}`,
    photo: (title: string, i: number) => `${title} — photo ${i}`,
    photoOf: (title: string, i: number, n: number) => `${title} — photo ${i} of ${n}`,
    seeOne: "View the photo", seeAll: (n: number) => `View all ${n} photos`,
    dialog: (title: string) => `Photos — ${title}`, close: "Close gallery",
    prev: "Previous photo", next: "Next photo", nth: (i: number) => `Photo ${i}`,
  },
};

/** Photo grid on the page + full-screen carousel with every photo. */
export function Gallery({ photos, title }: { photos: string[]; title: string }) {
  const t = T[useLang()];
  const dialog = useRef<HTMLDialogElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const touch = useRef<number | null>(null);
  const n = photos.length;

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };
  const close = () => dialog.current?.close();
  const go = useCallback((d: number) => setIndex((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    const onClose = () => { document.documentElement.style.overflow = ""; };
    el.addEventListener("keydown", onKey);
    el.addEventListener("close", onClose);
    return () => { el.removeEventListener("keydown", onKey); el.removeEventListener("close", onClose); };
  }, [go]);

  // Keep the active thumbnail visible.
  useEffect(() => {
    strip.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  if (!n) {
    return (
      <div className={s.gallery} data-count={1}>
        <div className={`${s.mainPhoto} ${s.noPhoto}`}>{t.soon}</div>
      </div>
    );
  }

  return (
    <>
      <div className={s.gallery} data-count={Math.min(n, 3)}>
        {photos.slice(0, 3).map((src, i) => (
          <button key={src} type="button" className={`${s.tile} ${i === 0 ? s.mainPhoto : ""}`} onClick={() => open(i)} aria-label={t.open(i + 1, n)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={i === 0 ? title : t.photo(title, i + 1)} loading={i === 0 ? "eager" : "lazy"} />
          </button>
        ))}
        <button type="button" className={s.allPhotos} onClick={() => open(0)}>
          <span aria-hidden="true">▦</span> {n === 1 ? t.seeOne : t.seeAll(n)}
        </button>
      </div>

      <dialog ref={dialog} className={s.lightbox} aria-label={t.dialog(title)} onClick={(e) => e.target === e.currentTarget && close()}>
        <div className={s.lbTop}>
          <span className={s.lbCount}>{index + 1} / {n}</span>
          <button type="button" className={s.lbClose} onClick={close} aria-label={t.close}>✕</button>
        </div>
        <div
          className={s.lbStage}
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            touch.current = null;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={photos[index]} src={photos[index]} alt={t.photoOf(title, index + 1, n)} className={s.lbImg} />
          {n > 1 && (
            <>
              <button type="button" className={`${s.lbNav} ${s.lbPrev}`} onClick={() => go(-1)} aria-label={t.prev}>‹</button>
              <button type="button" className={`${s.lbNav} ${s.lbNext}`} onClick={() => go(1)} aria-label={t.next}>›</button>
            </>
          )}
          {/* Preload neighbours so swiping feels instant. */}
          {n > 1 && (
            <span hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[(index + 1) % n]} alt="" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[(index - 1 + n) % n]} alt="" />
            </span>
          )}
        </div>
        {n > 1 && (
          <div className={s.lbStrip} ref={strip}>
            {photos.map((src, i) => (
              <button key={src} type="button" data-i={i} className={i === index ? s.lbThumbOn : undefined} onClick={() => setIndex(i)} aria-label={t.nth(i + 1)} aria-current={i === index}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </dialog>
    </>
  );
}
