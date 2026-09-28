import Image from "next/image";
import { LogoutButton } from "./LogoutButton";
import a from "./admin.module.css";

export function AdminShell({ children, active }: { children: React.ReactNode; active?: "listings" | "inquiries" | "leads" }) {
  return (
    <>
      <header className={a.top}>
        <div className={a.topInner}>
          <a href="/admin" className={a.brand}>
            <Image src="/valuefy-logo.png" alt="VALUEFY" width={117} height={24} />
            <span>Admin</span>
          </a>
          <nav className={a.nav} aria-label="Admin">
            <a href="/admin" aria-current={active === "listings" ? "page" : undefined}>Proprietăți</a>
            <a href="/admin#cereri" aria-current={active === "inquiries" ? "page" : undefined}>Cereri anunțuri</a>
            <a href="/admin/solicitari" aria-current={active === "leads" ? "page" : undefined}>Solicitări</a>
            <a href="/imobiliare" target="_blank" rel="noopener">Vezi site-ul ↗</a>
          </nav>
          <LogoutButton />
        </div>
      </header>
      <main className={a.main}>{children}</main>
    </>
  );
}
