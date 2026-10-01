// 404 for URLs that match no route at all (the site has two root layouts, RO and /en).
import type { Metadata } from "next";
import { LangProvider } from "@/i18n/client";
import { NotFoundView } from "@/components/NotFound";
import "./globals.css";

export const metadata: Metadata = { title: "Pagina nu există | VALUEFY", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="ro">
      <body>
        <LangProvider lang="ro">
          <NotFoundView lang="ro" bilingual />
        </LangProvider>
      </body>
    </html>
  );
}
