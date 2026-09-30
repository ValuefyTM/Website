import Image from "next/image";
import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { LoginForm } from "./LoginForm";
import a from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminLogin() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className={a.loginWrap}>
      <div className={a.loginCard}>
        <Image src="/valuefy-logo.png" alt="VALUEFY" width={137} height={28} />
        <h1>Administrare</h1>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p className={a.warn}>
            Adminul nu este activat. Adaugă în Cloudflare, la Settings → Variables and Secrets, un secret <code>ADMIN_PASSWORD</code> cu parola dorită.
          </p>
        )}
      </div>
    </div>
  );
}
