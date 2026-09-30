import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import { LangProvider } from "@/i18n/client";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "VALUEFY | Evaluări imobiliare",
  description:
    "Evaluări pentru apartamente, case, terenuri, proprietăți comerciale și bunuri mobile, realizate de firmă autorizată ANEVAR. Solicită rapid o ofertă prin VALUEFY.",
  openGraph: {
    siteName: "VALUEFY",
    title: "VALUEFY | Evaluări imobiliare",
    description: "Evaluări imobiliare. Simplu, rapid și profesionist. Firmă autorizată ANEVAR.",
    locale: "ro_RO",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F2ECE0",
};

/** Root layout for the Romanian site (and the admin). English pages have their own, under /en. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>
        <LangProvider lang="ro">{children}</LangProvider>
      </body>
    </html>
  );
}
