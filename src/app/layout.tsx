import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "VALUEFY | Evaluări imobiliare",
  description:
    "Servicii profesionale de evaluare pentru apartamente, case, terenuri și proprietăți comerciale. Solicită rapid o ofertă prin VALUEFY.",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
