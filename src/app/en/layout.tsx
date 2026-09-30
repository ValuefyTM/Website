import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import { LangProvider } from "@/i18n/client";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "VALUEFY | Property valuations",
  description:
    "Valuations for apartments, houses, land, commercial property and movable assets by an ANEVAR-authorised firm. Request a quote quickly through VALUEFY.",
  openGraph: {
    siteName: "VALUEFY",
    title: "VALUEFY | Property valuations",
    description: "Property valuations. Simple, fast and professional. ANEVAR-authorised firm.",
    locale: "en_GB",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F2ECE0",
};

/** Root layout for the English site (/en/…). */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LangProvider lang="en">{children}</LangProvider>
      </body>
    </html>
  );
}
