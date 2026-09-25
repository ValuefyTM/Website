import type { Metadata } from "next";
import Image from "next/image";
import { site, phoneHref } from "@/config/site";

export const metadata: Metadata = {
  title: "Portal client | VALUEFY",
  robots: { index: false },
};

// Placeholder until the client portal is built (see the separate portal design).
export default function ClientPortal() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--cream)" }}>
      <div style={{ maxWidth: 440, display: "flex", flexDirection: "column", gap: 16, textAlign: "center", alignItems: "center" }}>
        <a href="/" aria-label="VALUEFY — acasă">
          <Image src="/valuefy-logo.png" alt="VALUEFY" width={137} height={28} />
        </a>
        <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.03em" }}>Portalul client</h1>
        <p style={{ margin: 0, color: "var(--muted-2)", lineHeight: 1.65 }}>
          Accesul în portal îl primești odată cu confirmarea comenzii de evaluare. Pentru detalii despre un dosar în lucru, contactează-ne.
        </p>
        <p style={{ margin: 0, fontWeight: 700 }}>
          <a href={phoneHref(site.phone)}>{site.phone}</a> · <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <a href="/" style={{ marginTop: 8, fontWeight: 700, color: "var(--acc-text)" }}>← Înapoi la site</a>
      </div>
    </main>
  );
}
