"use client";

import { useEffect, useRef, useState } from "react";
import { shareMessage, socialPost, type Listing } from "@/lib/listing-format";
import { cardBlob } from "@/lib/social-card";
import s from "./listing.module.css";

/** Share menu: WhatsApp recommendation, social networks, copy link, plus a ready-made image and text for a social post. */
export function ShareButton({ listing }: { listing: Listing }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const [making, setMaking] = useState(false);
  const [url, setUrl] = useState(`/imobiliare/${listing.slug}`);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => setUrl(`${location.origin}/imobiliare/${listing.slug}`), [listing.slug]);

  useEffect(() => {
    if (!open) return;
    const off = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", off);
    document.addEventListener("keydown", off);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", off); };
  }, [open]);

  const message = shareMessage(listing, url);
  const [native, setNative] = useState(false);
  useEffect(() => setNative(typeof navigator.share === "function"), []);
  const nativeShare = () => navigator.share({ title: listing.title, text: message.replace(url, "").trim(), url }).catch(() => {});
  const copy = (what: string, text: string) =>
    navigator.clipboard.writeText(text).then(() => { setCopied(what); setTimeout(() => setCopied(""), 1800); });

  // 4:5 image ready for an Instagram / Facebook post, drawn in the browser from the cover photo.
  const downloadImage = async () => {
    setMaking(true);
    try {
      const blob = await cardBlob(listing, "post", 0.9);
      const file = new File([blob], `${listing.slug}.jpg`, { type: "image/jpeg" });
      if (window.matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: socialPost(listing, url) }).catch(() => {});
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      }
    } finally {
      setMaking(false);
    }
  };

  return (
    <div className={s.share} ref={box}>
      <button type="button" className={s.shareBtn} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        Distribuie
      </button>
      {open && (
        <div className={s.shareMenu} role="menu">
          <a role="menuitem" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener"><i className={s.icWa} aria-hidden="true">✆</i>Recomandă pe WhatsApp</a>
          <a role="menuitem" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener"><i className={s.icFb} aria-hidden="true">f</i>Facebook</a>
          <a role="menuitem" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener"><i className={s.icIn} aria-hidden="true">in</i>LinkedIn</a>
          <a role="menuitem" href={`mailto:?subject=${encodeURIComponent(listing.title)}&body=${encodeURIComponent(message)}`}><i aria-hidden="true">@</i>Email</a>
          <button role="menuitem" type="button" onClick={() => copy("link", url)}><i aria-hidden="true">⧉</i>{copied === "link" ? "Link copiat ✓" : "Copiază linkul"}</button>
          {native && <button role="menuitem" type="button" onClick={nativeShare}><i aria-hidden="true">⋯</i>Alte aplicații…</button>}
          <div className={s.shareSep} role="separator" />
          <button role="menuitem" type="button" onClick={downloadImage} disabled={making}><i aria-hidden="true">▣</i>{making ? "Se pregătește…" : "Imagine pentru Instagram / Facebook"}</button>
          <button role="menuitem" type="button" onClick={() => copy("post", socialPost(listing, url))}><i aria-hidden="true">✎</i>{copied === "post" ? "Text copiat ✓" : "Copiază textul pentru postare"}</button>
        </div>
      )}
    </div>
  );
}
